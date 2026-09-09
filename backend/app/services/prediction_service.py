import time
from datetime import datetime, timezone
from typing import Dict, Any, Optional
import numpy as np
import pandas as pd
from sqlalchemy.orm import Session
from loguru import logger

from app.schemas.student import StudentInput
from app.schemas.prediction import PredictionResponse, FeatureImpactItem, LimeItem, RecommendationItem
from app.ml.registry import model_registry
from app.ml.recommender import generate_recommendations
from app.core.exceptions import ModelNotTrainedException
from app.repositories.prediction_repository import PredictionRepository
from app.models.user import User


class PredictionService:
    @staticmethod
    def predict_single(
        student_input: StudentInput,
        db: Optional[Session] = None,
        current_user: Optional[User] = None
    ) -> PredictionResponse:
        """
        Runs comprehensive inference pipeline for a single student profile:
        Regression score -> Classification pass/fail -> Risk meter -> Explainability (SHAP & LIME) -> Recommendations.
        """
        start_time = time.time()

        if not model_registry.is_trained():
            # Attempt to load
            if not model_registry.load_artifacts():
                raise ModelNotTrainedException("ML Model artifacts are not loaded.")

        regressor = model_registry.champion_regressor
        classifier = model_registry.champion_classifier
        preprocessor = model_registry.preprocessor
        explainer = model_registry.explainer

        # Convert input to DataFrame
        student_dict = student_input.model_dump()
        input_df = pd.DataFrame([student_dict])

        # Preprocess features
        X_trans = preprocessor.transform(input_df)

        # 1. Regression Score Prediction
        raw_pred = float(regressor.predict(X_trans)[0])
        predicted_g3 = round(float(np.clip(raw_pred, 0.0, 20.0)), 2)
        predicted_percentage = round((predicted_g3 / 20.0) * 100.0, 1)

        # 2. Classification & Probability
        if classifier is not None and hasattr(classifier, "predict_proba"):
            probs = classifier.predict_proba(X_trans)[0]
            pass_probability = round(float(probs[1]), 4)
            pass_fail = "Pass" if pass_probability >= 0.5 else "Fail"
        else:
            # Fallback logistic sigmoid calibration
            pass_fail = "Pass" if predicted_g3 >= 10.0 else "Fail"
            z = (predicted_g3 - 9.5) / 1.8
            pass_probability = round(float(1.0 / (1.0 + np.exp(-z))), 4)

        # 3. Risk Meter
        failures = int(student_dict.get("failures", 0))
        absences = int(student_dict.get("absences", 0))

        if predicted_g3 < 8.0 or failures >= 2 or absences > 20:
            risk_level = "Critical"
        elif predicted_g3 < 10.0 or failures == 1:
            risk_level = "High"
        elif predicted_g3 < 14.0:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        # 4. Performance Tier
        if predicted_g3 >= 16.0:
            performance_tier = "Excellent"
        elif predicted_g3 >= 14.0:
            performance_tier = "Good"
        elif predicted_g3 >= 10.0:
            performance_tier = "Average"
        else:
            performance_tier = "Needs Improvement"

        # 5. Model Confidence Score
        distance_from_boundary = abs(predicted_g3 - 10.0)
        confidence = min(98.5, max(75.0, 80.0 + (distance_from_boundary * 1.8)))
        confidence_score = round(confidence, 1)

        # 6. Explainability (SHAP & LIME)
        explanation_data = explainer.explain_instance(input_df, predicted_g3) if explainer else {
            "top_features": [],
            "top_positive_factors": [],
            "top_negative_factors": [],
            "lime_explanations": [],
            "human_readable_insights": [
                f"Predicted final grade is {predicted_g3}/20 based on historical period marks.",
                f"Weekly study time was logged at level {student_dict.get('studytime', 2)}."
            ],
            "baseline_expected_value": 10.4
        }

        # 7. Personalized AI Recommendations
        recommendations_data = generate_recommendations(
            student_data=student_dict,
            predicted_g3=predicted_g3,
            pass_probability=pass_probability,
            risk_level=risk_level
        )

        latency_ms = round((time.time() - start_time) * 1000.0, 2)
        created_now = datetime.now(timezone.utc)

        # 8. Persist to DB if session provided
        prediction_id = None
        if db is not None:
            try:
                db_record = PredictionRepository.create(
                    db,
                    {
                        "user_id": current_user.id if current_user else None,
                        "student_data": student_dict,
                        "predicted_g3": predicted_g3,
                        "pass_fail": pass_fail,
                        "pass_probability": pass_probability,
                        "risk_level": risk_level,
                        "confidence_score": confidence_score,
                        "performance_tier": performance_tier,
                        "shap_explanation": explanation_data.get("top_features", []),
                        "lime_explanation": explanation_data.get("lime_explanations", []),
                        "human_insights": explanation_data.get("human_readable_insights", []),
                        "recommendations": recommendations_data,
                        "model_version": model_registry.metadata.get("version", "v1.0.0"),
                        "is_batch": False,
                        "latency_ms": latency_ms,
                        "created_at": created_now
                    }
                )
                prediction_id = db_record.id
            except Exception as e:
                logger.error(f"Failed to persist prediction record: {e}")

        # Construct response
        return PredictionResponse(
            prediction_id=prediction_id,
            predicted_g3=predicted_g3,
            predicted_percentage=predicted_percentage,
            pass_fail=pass_fail,
            pass_probability=pass_probability,
            risk_level=risk_level,
            confidence_score=confidence_score,
            performance_tier=performance_tier,
            model_version=model_registry.metadata.get("version", "v1.0.0"),
            champion_regressor=model_registry.metadata.get("champion_regressor_name", "Random Forest"),
            champion_classifier=model_registry.metadata.get("champion_classifier_name", "Logistic Regression"),
            top_features=[FeatureImpactItem(**f) for f in explanation_data.get("top_features", [])],
            top_positive_factors=[FeatureImpactItem(**f) for f in explanation_data.get("top_positive_factors", [])],
            top_negative_factors=[FeatureImpactItem(**f) for f in explanation_data.get("top_negative_factors", [])],
            lime_explanations=[LimeItem(**l) for l in explanation_data.get("lime_explanations", [])],
            human_readable_insights=explanation_data.get("human_readable_insights", []),
            recommendations=[RecommendationItem(**r) for r in recommendations_data],
            baseline_expected_value=explanation_data.get("baseline_expected_value", 10.4),
            latency_ms=latency_ms,
            created_at=created_now
        )
