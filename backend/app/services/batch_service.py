import io
import uuid
import time
from typing import Dict, Any, List, Optional, Tuple
import pandas as pd
import numpy as np
from sqlalchemy.orm import Session
from loguru import logger
from fastapi import UploadFile, HTTPException, status

from app.ml.registry import model_registry
from app.ml.recommender import generate_recommendations
from app.schemas.prediction import BatchPredictionResponse, BatchPredictionItem
from app.repositories.prediction_repository import PredictionRepository
from app.models.user import User


class BatchService:
    @staticmethod
    async def process_batch_csv(
        file: UploadFile,
        db: Optional[Session] = None,
        current_user: Optional[User] = None
    ) -> Tuple[BatchPredictionResponse, str]:
        """
        Parses CSV, executes batch vector inference, persists batch records,
        and generates an annotated CSV string for instant download.
        """
        start_time = time.time()
        batch_id = f"batch_{uuid.uuid4().hex[:10]}"

        if not model_registry.is_trained():
            if not model_registry.load_artifacts():
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Machine learning model artifacts are not ready."
                )

        # Read CSV contents
        try:
            content = await file.read()
            # Detect separator
            try:
                df = pd.read_csv(io.BytesIO(content), sep=";")
                if len(df.columns) <= 1:
                    df = pd.read_csv(io.BytesIO(content), sep=",")
            except Exception:
                df = pd.read_csv(io.BytesIO(content), sep=",")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Could not parse uploaded CSV file: {str(e)}"
            )

        if df.empty:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded CSV file is empty."
            )

        # Ensure required columns exist with defaults
        default_values = {
            "school": "GP", "sex": "F", "age": 17, "address": "U", "famsize": "GT3",
            "Pstatus": "T", "Medu": 3, "Fedu": 3, "Mjob": "other", "Fjob": "other",
            "reason": "course", "guardian": "mother", "traveltime": 1, "studytime": 2,
            "failures": 0, "schoolsup": "no", "famsup": "yes", "paid": "no",
            "activities": "yes", "nursery": "yes", "higher": "yes", "internet": "yes",
            "romantic": "no", "famrel": 4, "freetime": 3, "goout": 3, "Dalc": 1,
            "Walc": 1, "health": 4, "absences": 2, "G1": 10.0, "G2": 10.0
        }

        for col, def_val in default_values.items():
            if col not in df.columns:
                df[col] = def_val

        # Vectorized transform
        preprocessor = model_registry.preprocessor
        regressor = model_registry.champion_regressor
        classifier = model_registry.champion_classifier

        X_trans = preprocessor.transform(df)

        # 1. Continuous Grade Predictions
        raw_preds = regressor.predict(X_trans)
        predicted_g3_array = np.clip(raw_preds, 0.0, 20.0).round(2)

        # 2. Classifier Probabilities
        if classifier is not None and hasattr(classifier, "predict_proba"):
            probs = classifier.predict_proba(X_trans)[:, 1].round(4)
        else:
            z = (predicted_g3_array - 9.5) / 1.8
            probs = (1.0 / (1.0 + np.exp(-z))).round(4)

        # Build items
        batch_items: List[BatchPredictionItem] = []
        annotated_df = df.copy()
        
        pred_g3_list = []
        pass_fail_list = []
        risk_list = []
        prob_list = []
        tier_list = []
        rec_list = []

        total_students = len(df)
        passed_count = 0
        failed_count = 0
        high_risk_count = 0

        for i, row in df.iterrows():
            pred_score = float(predicted_g3_array[i])
            pass_prob = float(probs[i])
            is_pass = pass_prob >= 0.5 or pred_score >= 10.0
            pass_fail_str = "Pass" if is_pass else "Fail"

            if is_pass:
                passed_count += 1
            else:
                failed_count += 1

            failures = int(row.get("failures", 0))
            absences = int(row.get("absences", 0))

            if pred_score < 8.0 or failures >= 2 or absences > 20:
                risk_str = "Critical"
                high_risk_count += 1
            elif pred_score < 10.0 or failures == 1:
                risk_str = "High"
                high_risk_count += 1
            elif pred_score < 14.0:
                risk_str = "Medium"
            else:
                risk_str = "Low"

            if pred_score >= 16.0:
                tier_str = "Excellent"
            elif pred_score >= 14.0:
                tier_str = "Good"
            elif pred_score >= 10.0:
                tier_str = "Average"
            else:
                tier_str = "Needs Improvement"

            # Quick top recommendation
            if studytime := int(row.get("studytime", 2)) <= 2:
                top_rec = "Increase focused study time to 5+ hours/week."
            elif int(row.get("absences", 0)) > 6:
                top_rec = "Reduce absences and attend remedial review sessions."
            elif int(row.get("failures", 0)) > 0:
                top_rec = "Request tutor support for difficult foundational topics."
            else:
                top_rec = "Maintain positive study rhythm and practice mock exams."

            pred_g3_list.append(pred_score)
            pass_fail_list.append(pass_fail_str)
            risk_list.append(risk_str)
            prob_list.append(pass_prob)
            tier_list.append(tier_str)
            rec_list.append(top_rec)

            batch_items.append(
                BatchPredictionItem(
                    row_index=i + 1,
                    predicted_g3=pred_score,
                    pass_fail=pass_fail_str,
                    risk_level=risk_str,
                    pass_probability=pass_prob,
                    performance_tier=tier_str,
                    top_recommendation=top_rec
                )
            )

        # Add result columns to annotated dataframe
        annotated_df["Predicted_G3"] = pred_g3_list
        annotated_df["Pass_Fail"] = pass_fail_list
        annotated_df["Pass_Probability"] = prob_list
        annotated_df["Risk_Level"] = risk_list
        annotated_df["Performance_Tier"] = tier_list
        annotated_df["Top_Recommendation"] = rec_list

        csv_buffer = io.StringIO()
        annotated_df.to_csv(csv_buffer, index=False)
        csv_string = csv_buffer.getvalue()

        processing_time = round(time.time() - start_time, 3)
        pass_rate = round((passed_count / total_students) * 100.0, 1) if total_students > 0 else 0.0
        avg_score = round(float(np.mean(predicted_g3_array)), 2) if total_students > 0 else 0.0

        response = BatchPredictionResponse(
            batch_id=batch_id,
            total_students=total_students,
            passed_count=passed_count,
            failed_count=failed_count,
            pass_rate_percentage=pass_rate,
            average_predicted_grade=avg_score,
            high_risk_count=high_risk_count,
            predictions=batch_items[:100],  # preview first 100 in JSON
            download_url=f"/api/v1/batch-predict/download/{batch_id}",
            processing_time_seconds=processing_time
        )

        return response, csv_string
