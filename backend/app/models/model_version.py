from datetime import datetime, timezone
from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime, JSON
from app.core.database import Base


class ModelVersion(Base):
    __tablename__ = "model_versions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    version = Column(String(50), unique=True, index=True, nullable=False)
    regressor_name = Column(String(100), nullable=False)
    classifier_name = Column(String(100), nullable=False)
    r2_score = Column(Float, nullable=False)
    rmse_score = Column(Float, nullable=False)
    mae_score = Column(Float, nullable=False)
    accuracy_score = Column(Float, nullable=False)
    f1_score = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
