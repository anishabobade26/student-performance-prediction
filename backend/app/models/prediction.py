from datetime import datetime, timezone
from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    
    # Input data snapshot
    student_data = Column(JSON, nullable=False)
    
    # ML Forecast Outputs
    predicted_g3 = Column(Float, nullable=False)
    pass_fail = Column(String(10), nullable=False)  # "Pass" / "Fail"
    pass_probability = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False)  # "Low", "Medium", "High", "Critical"
    confidence_score = Column(Float, nullable=False)
    performance_tier = Column(String(30), nullable=False)  # "Excellent", "Good", "Average", "Needs Improvement"

    # Explainability & Recommendations
    shap_explanation = Column(JSON, nullable=True)
    lime_explanation = Column(JSON, nullable=True)
    human_insights = Column(JSON, nullable=True)
    recommendations = Column(JSON, nullable=True)

    # Metadata
    model_version = Column(String(20), default="v1.0.0", nullable=False)
    is_batch = Column(Boolean, default=False, nullable=False)
    batch_id = Column(String(50), nullable=True, index=True)
    latency_ms = Column(Float, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)

    # Relationships
    user = relationship("User", back_populates="predictions")
