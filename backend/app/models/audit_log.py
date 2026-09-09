from datetime import datetime, timezone
from sqlalchemy import Column, Integer, Float, String, DateTime, Text, JSON
from app.core.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, nullable=True, index=True)
    action = Column(String(50), nullable=False, index=True)  # "LOGIN", "PREDICTION", "BATCH_PREDICTION", "RETRAIN"
    endpoint = Column(String(150), nullable=False)
    ip_address = Column(String(50), nullable=True)
    status_code = Column(Integer, nullable=True)
    latency_ms = Column(Float, nullable=True)
    details = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
