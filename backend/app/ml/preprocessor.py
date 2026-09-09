import pandas as pd
import numpy as np
from typing import List, Tuple
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from loguru import logger

from app.ml.feature_engineering import add_engineered_features


# Binary columns that map directly to 0/1
BINARY_COLUMNS = [
    "school", "sex", "address", "famsize", "Pstatus", "schoolsup", 
    "famsup", "paid", "activities", "nursery", "higher", "internet", "romantic"
]

# Nominal multi-category columns
CATEGORICAL_COLUMNS = [
    "Mjob", "Fjob", "reason", "guardian"
]

# Base numeric features
BASE_NUMERICAL_COLUMNS = [
    "age", "Medu", "Fedu", "traveltime", "studytime", "failures",
    "famrel", "freetime", "goout", "Dalc", "Walc", "health", "absences",
    "G1", "G2"
]

# Engineered numeric features
ENGINEERED_NUMERICAL_COLUMNS = [
    "prior_grade_avg", "grade_trend", "grade_consistency", "parent_edu_avg",
    "parent_edu_max", "parent_edu_diff", "alcohol_index", "high_alcohol_flag",
    "support_score", "study_to_travel_ratio", "social_index",
    "high_absence_risk", "has_prior_failures", "motivation_index"
]


class FeatureEngineeringTransformer(BaseEstimator, TransformerMixin):
    """Custom transformer that applies feature engineering to raw input dataframe."""
    def fit(self, X, y=None):
        return self

    def transform(self, X):
        if isinstance(X, pd.DataFrame):
            return add_engineered_features(X)
        elif isinstance(X, dict):
            return add_engineered_features(pd.DataFrame([X]))
        else:
            raise ValueError("Input to FeatureEngineeringTransformer must be DataFrame or dict")


def build_preprocessor() -> Tuple[Pipeline, List[str]]:
    """
    Builds the preprocessing pipeline:
    1. Feature Engineering
    2. ColumnTransformer (OneHotEncoder on categoricals + binary, StandardScaler on numerics)
    """
    all_cat_cols = BINARY_COLUMNS + CATEGORICAL_COLUMNS
    all_num_cols = BASE_NUMERICAL_COLUMNS + ENGINEERED_NUMERICAL_COLUMNS

    column_transformer = ColumnTransformer(
        transformers=[
            (
                "cat",
                OneHotEncoder(handle_unknown="ignore", sparse_output=False, drop=None),
                all_cat_cols,
            ),
            (
                "num",
                StandardScaler(),
                all_num_cols,
            ),
        ],
        remainder="drop",
    )

    pipeline = Pipeline(
        steps=[
            ("feature_engineering", FeatureEngineeringTransformer()),
            ("column_transformer", column_transformer),
        ]
    )

    return pipeline, all_cat_cols, all_num_cols


class MLPreprocessor:
    """
    High-level preprocessor wrapper that maintains transformed feature names
    and allows seamless transformation for single rows and dataframes.
    """
    def __init__(self):
        self.pipeline, self.cat_cols, self.num_cols = build_preprocessor()
        self.transformed_feature_names: List[str] = []
        self.is_fitted = False

    def fit(self, X: pd.DataFrame, y=None) -> "MLPreprocessor":
        logger.info("Fitting ML Preprocessor...")
        self.pipeline.fit(X, y)
        self._extract_feature_names()
        self.is_fitted = True
        logger.info(f"Preprocessor fitted with {len(self.transformed_feature_names)} transformed features.")
        return self

    def transform(self, X: pd.DataFrame) -> np.ndarray:
        if not self.is_fitted:
            raise RuntimeError("MLPreprocessor is not fitted yet.")
        return self.pipeline.transform(X)

    def fit_transform(self, X: pd.DataFrame, y=None) -> np.ndarray:
        self.fit(X, y)
        return self.transform(X)

    def _extract_feature_names(self):
        col_transformer: ColumnTransformer = self.pipeline.named_steps["column_transformer"]
        cat_encoder: OneHotEncoder = col_transformer.named_transformers_["cat"]
        
        cat_features = cat_encoder.get_feature_names_out(self.cat_cols).tolist()
        all_features = cat_features + self.num_cols
        self.transformed_feature_names = all_features

    def get_feature_names(self) -> List[str]:
        return self.transformed_feature_names
