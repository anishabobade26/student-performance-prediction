from typing import List, Dict, Any, Optional
from pydantic import BaseModel


class MetricCard(BaseModel):
    title: str
    value: str
    numeric_value: float
    change_percentage: Optional[float] = None
    status: Optional[str] = None


class GradeDistributionBin(BaseModel):
    grade_range: str
    count: int
    percentage: float


class StudyTimeVsGrade(BaseModel):
    study_time_category: str
    average_grade: float
    student_count: int
    pass_rate: float


class AbsencesVsGrade(BaseModel):
    absence_bucket: str
    average_grade: float
    failure_rate: float


class CorrelationItem(BaseModel):
    feature_x: str
    feature_y: str
    correlation: float


class RiskDistributionItem(BaseModel):
    risk_level: str
    count: int
    percentage: float


class DemographicsSummary(BaseModel):
    male_count: int
    female_count: int
    urban_count: int
    rural_count: int
    school_gp_count: int
    school_ms_count: int


class LeaderboardModelItem(BaseModel):
    model_name: str
    r2_score: float
    rmse: float
    mae: float
    cv_r2_mean: float
    fit_time_seconds: float
    is_champion: bool


class AnalyticsOverviewResponse(BaseModel):
    total_predictions: int
    average_predicted_grade: float
    overall_pass_rate: float
    high_risk_percentage: float
    model_r2_score: float
    grade_distribution: List[GradeDistributionBin]
    study_time_analysis: List[StudyTimeVsGrade]
    absences_analysis: List[AbsencesVsGrade]
    risk_distribution: List[RiskDistributionItem]
    top_correlations: List[CorrelationItem]
    demographics: DemographicsSummary
    leaderboard: List[LeaderboardModelItem]
