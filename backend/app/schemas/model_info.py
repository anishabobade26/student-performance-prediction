from typing import List, Dict, Any, Optional
from pydantic import BaseModel


class FeatureImportanceItem(BaseModel):
    feature: str
    importance: float
    category: str


class ModelMetadataResponse(BaseModel):
    version: str
    is_trained: bool
    champion_regressor_name: str
    champion_classifier_name: str
    total_features_count: int
    dataset_students_count: int
    r2_score: float
    rmse: float
    mae: float
    classifier_accuracy: float
    classifier_f1_score: float
    training_timestamp: str
    feature_importances: List[FeatureImportanceItem]
