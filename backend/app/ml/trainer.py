import os
import time
from typing import Dict, Any, Tuple, Optional
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LinearRegression, Ridge, Lasso, LogisticRegression
from sklearn.ensemble import (
    RandomForestRegressor,
    GradientBoostingRegressor,
    ExtraTreesRegressor,
    RandomForestClassifier,
    GradientBoostingClassifier,
)
from sklearn.tree import DecisionTreeRegressor
from loguru import logger

# Import XGBoost and LightGBM with graceful fallback
try:
    import xgboost as xgb
    HAS_XGBOOST = True
except ImportError:
    HAS_XGBOOST = False

try:
    import lightgbm as lgb
    HAS_LIGHTGBM = True
except ImportError:
    HAS_LIGHTGBM = False

try:
    import catboost as cb
    HAS_CATBOOST = True
except ImportError:
    HAS_CATBOOST = False

from app.ml.preprocessor import MLPreprocessor
from app.ml.evaluator import evaluate_regression, evaluate_classification
from app.ml.data_loader import load_dataset, get_feature_and_target


def get_regression_models() -> Dict[str, Any]:
    """Instantiates a dictionary of diverse regression algorithms for benchmarking."""
    models = {
        "Linear Regression": LinearRegression(),
        "Ridge Regression": Ridge(alpha=1.0, random_state=42),
        "Lasso Regression": Lasso(alpha=0.1, random_state=42),
        "Decision Tree": DecisionTreeRegressor(max_depth=5, random_state=42),
        "Extra Trees": ExtraTreesRegressor(n_estimators=100, max_depth=8, random_state=42),
        "Random Forest": RandomForestRegressor(n_estimators=150, max_depth=7, min_samples_split=4, random_state=42),
        "Gradient Boosting": GradientBoostingRegressor(n_estimators=120, learning_rate=0.05, max_depth=4, random_state=42),
    }

    if HAS_XGBOOST:
        models["XGBoost"] = xgb.XGBRegressor(
            n_estimators=120,
            learning_rate=0.05,
            max_depth=4,
            random_state=42,
            verbosity=0
        )

    if HAS_LIGHTGBM:
        models["LightGBM"] = lgb.LGBMRegressor(
            n_estimators=120,
            learning_rate=0.05,
            max_depth=4,
            random_state=42,
            verbose=-1
        )

    if HAS_CATBOOST:
        models["CatBoost"] = cb.CatBoostRegressor(
            iterations=120,
            learning_rate=0.05,
            depth=4,
            random_seed=42,
            verbose=False
        )

    return models


def get_classification_models() -> Dict[str, Any]:
    """Instantiates classification models for Pass/Fail prediction."""
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Random Forest Classifier": RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42),
        "Gradient Boosting Classifier": GradientBoostingClassifier(n_estimators=100, learning_rate=0.05, max_depth=3, random_state=42),
    }

    if HAS_XGBOOST:
        models["XGBoost Classifier"] = xgb.XGBClassifier(
            n_estimators=100,
            learning_rate=0.05,
            max_depth=3,
            random_state=42,
            eval_metric="logloss"
        )

    if HAS_LIGHTGBM:
        models["LightGBM Classifier"] = lgb.LGBMClassifier(
            n_estimators=100,
            learning_rate=0.05,
            max_depth=3,
            random_state=42,
            verbose=-1
        )

    return models


class ModelTrainer:
    """
    Orchestrates end-to-end multi-model benchmarking, hyperparameter tuning,
    evaluation, leaderboard generation, and champion model selection.
    """
    def __init__(self, test_size: float = 0.2, random_state: int = 42):
        self.test_size = test_size
        self.random_state = random_state
        self.preprocessor = MLPreprocessor()
        self.regression_leaderboard: list = []
        self.classification_leaderboard: list = []
        self.champion_regressor = None
        self.champion_regressor_name: str = ""
        self.champion_classifier = None
        self.champion_classifier_name: str = ""
        self.training_summary: Dict[str, Any] = {}

    def train_pipeline(
        self,
        df: Optional[pd.DataFrame] = None,
        dataset_path: Optional[str] = None,
        dataset_type: str = "mat"
    ) -> Dict[str, Any]:
        """
        Executes complete training pipeline:
        1. Load & validate dataset
        2. Train/Test split
        3. Fit preprocessor
        4. Train & evaluate all regression candidate models
        5. Train & evaluate all classification candidate models
        6. Select champions and record leaderboard
        """
        start_time = time.time()
        logger.info("Starting ML Pipeline Training...")

        if df is None:
            df = load_dataset(dataset_path, dataset_type)

        X, y = get_feature_and_target(df)
        y_binary = (y >= 10).astype(int)  # 1: Pass, 0: Fail (Pass is >= 10 in Portuguese school grading)

        X_train, X_test, y_train, y_test, y_bin_train, y_bin_test = train_test_split(
            X, y, y_binary, test_size=self.test_size, random_state=self.random_state
        )

        logger.info(f"Dataset split: {len(X_train)} train rows, {len(X_test)} test rows.")

        # Fit preprocessor on X_train only to prevent data leakage
        X_train_trans = self.preprocessor.fit_transform(X_train)
        X_test_trans = self.preprocessor.transform(X_test)
        n_features = X_train_trans.shape[1]

        # -----------------------------
        # 1. Benchmarking Regression Models
        # -----------------------------
        logger.info("Training Regression Models...")
        reg_models = get_regression_models()
        best_r2 = -float("inf")
        champion_reg = None
        champion_reg_name = ""
        reg_results = []

        for name, model in reg_models.items():
            try:
                t0 = time.time()
                model.fit(X_train_trans, y_train)
                fit_duration = time.time() - t0

                y_pred_train = model.predict(X_train_trans)
                y_pred_test = model.predict(X_test_trans)

                train_metrics = evaluate_regression(y_train, y_pred_train, n_features)
                test_metrics = evaluate_regression(y_test, y_pred_test, n_features)

                # 5-fold cross validation score
                cv_scores = cross_val_score(model, X_train_trans, y_train, cv=5, scoring="r2")
                cv_r2_mean = float(np.mean(cv_scores))
                cv_r2_std = float(np.std(cv_scores))

                result = {
                    "model_name": name,
                    "train_metrics": train_metrics,
                    "test_metrics": test_metrics,
                    "cv_r2_mean": round(cv_r2_mean, 4),
                    "cv_r2_std": round(cv_r2_std, 4),
                    "fit_time_seconds": round(fit_duration, 4),
                    "r2_score": test_metrics["r2_score"],
                    "rmse": test_metrics["rmse"],
                    "mae": test_metrics["mae"],
                }
                reg_results.append(result)
                logger.info(f"Regressor '{name}': R2 = {test_metrics['r2_score']}, RMSE = {test_metrics['rmse']}")

                if test_metrics["r2_score"] > best_r2:
                    best_r2 = test_metrics["r2_score"]
                    champion_reg = model
                    champion_reg_name = name

            except Exception as e:
                logger.error(f"Failed to train regression model '{name}': {e}")

        # Rank regression models by R2 score descending
        reg_results = sorted(reg_results, key=lambda x: x["r2_score"], reverse=True)
        self.regression_leaderboard = reg_results
        self.champion_regressor = champion_reg
        self.champion_regressor_name = champion_reg_name
        logger.info(f"Champion Regressor selected: {champion_reg_name} (R2={best_r2:.4f})")

        # -----------------------------
        # 2. Benchmarking Classification Models
        # -----------------------------
        logger.info("Training Classification Models (Pass/Fail)...")
        clf_models = get_classification_models()
        best_f1 = -float("inf")
        champion_clf = None
        champion_clf_name = ""
        clf_results = []

        for name, model in clf_models.items():
            try:
                t0 = time.time()
                model.fit(X_train_trans, y_bin_train)
                fit_duration = time.time() - t0

                y_pred_test = model.predict(X_test_trans)
                y_prob_test = model.predict_proba(X_test_trans)[:, 1] if hasattr(model, "predict_proba") else None

                metrics = evaluate_classification(y_bin_test, y_pred_test, y_prob_test)

                result = {
                    "model_name": name,
                    "metrics": metrics,
                    "fit_time_seconds": round(fit_duration, 4),
                    "accuracy": metrics["accuracy"],
                    "f1_score": metrics["f1_score"],
                    "roc_auc": metrics["roc_auc"],
                }
                clf_results.append(result)
                logger.info(f"Classifier '{name}': Accuracy = {metrics['accuracy']}, F1 = {metrics['f1_score']}")

                if metrics["f1_score"] > best_f1:
                    best_f1 = metrics["f1_score"]
                    champion_clf = model
                    champion_clf_name = name

            except Exception as e:
                logger.error(f"Failed to train classifier '{name}': {e}")

        # Rank classification models by F1-Score descending
        clf_results = sorted(clf_results, key=lambda x: x["f1_score"], reverse=True)
        self.classification_leaderboard = clf_results
        self.champion_classifier = champion_clf
        self.champion_classifier_name = champion_clf_name
        logger.info(f"Champion Classifier selected: {champion_clf_name} (F1={best_f1:.4f})")

        total_training_time = round(time.time() - start_time, 2)

        self.training_summary = {
            "total_samples": len(df),
            "train_samples": len(X_train),
            "test_samples": len(X_test),
            "total_features_engineered": n_features,
            "champion_regressor": champion_reg_name,
            "champion_classifier": champion_clf_name,
            "regression_leaderboard": self.regression_leaderboard,
            "classification_leaderboard": self.classification_leaderboard,
            "training_duration_seconds": total_training_time,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "dataset_info": {
                "math_students": len(df),
                "target_mean": float(y.mean()),
                "target_std": float(y.std()),
                "pass_percentage": round(float((y >= 10).mean() * 100), 2)
            }
        }

        logger.info(f"Pipeline training completed successfully in {total_training_time}s.")
        return self.training_summary
