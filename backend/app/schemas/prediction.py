from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.student import StudentInput


class FeatureImpactItem(BaseModel):
    feature: str
    raw_feature_name: str
    impact: float
    direction: str  # "positive" or "negative"
    magnitude: float


class LimeItem(BaseModel):
    rule: str
    weight: float


class RecommendationItem(BaseModel):
    id: str
    category: str
    title: str
    priority: str  # "High", "Medium", "Low"
    expected_impact: str
    description: str
    action_steps: List[str]
    target_metric: str


class PredictionResponse(BaseModel):
    prediction_id: Optional[int] = None
    predicted_g3: float = Field(..., description="Predicted final grade (0-20 scale)")
    predicted_percentage: float = Field(..., description="Predicted grade as percentage (0-100%)")
    pass_fail: str = Field(..., description="'Pass' or 'Fail'")
    pass_probability: float = Field(..., description="Probability of passing (0.0 to 1.0)")
    risk_level: str = Field(..., description="'Low', 'Medium', 'High', or 'Critical'")
    confidence_score: float = Field(..., description="Confidence score percentage (0-100%)")
    performance_tier: str = Field(..., description="'Excellent', 'Good', 'Average', or 'Needs Improvement'")
    model_version: str
    champion_regressor: str
    champion_classifier: str
    top_features: List[FeatureImpactItem]
    top_positive_factors: List[FeatureImpactItem]
    top_negative_factors: List[FeatureImpactItem]
    lime_explanations: List[LimeItem]
    human_readable_insights: List[str]
    recommendations: List[RecommendationItem]
    baseline_expected_value: float
    latency_ms: float
    created_at: datetime


class BatchPredictionItem(BaseModel):
    row_index: int
    predicted_g3: float
    pass_fail: str
    risk_level: str
    pass_probability: float
    performance_tier: str
    top_recommendation: str


class BatchPredictionResponse(BaseModel):
    batch_id: str
    total_students: int
    passed_count: int
    failed_count: int
    pass_rate_percentage: float
    average_predicted_grade: float
    high_risk_count: int
    predictions: List[BatchPredictionItem]
    download_url: Optional[str] = None
    processing_time_seconds: float


class PredictionHistoryItem(BaseModel):
    id: int
    student_data: Dict[str, Any]
    predicted_g3: float
    pass_fail: str
    pass_probability: float
    risk_level: str
    confidence_score: float
    performance_tier: str
    model_version: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class PredictionHistoryResponse(BaseModel):
    total: int
    page: int
    page_size: int
    predictions: List[PredictionHistoryItem]


class PresetStudent(BaseModel):
    name: str
    description: str
    tag: str  # "Top Performer", "Average", "At-Risk", "Improver"
    data: StudentInput
