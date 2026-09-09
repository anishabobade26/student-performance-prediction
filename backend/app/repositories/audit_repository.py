from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.audit_log import AuditLog


class AuditRepository:
    @staticmethod
    def log_action(
        db: Session,
        action: str,
        endpoint: str,
        user_id: Optional[int] = None,
        ip_address: Optional[str] = None,
        status_code: Optional[int] = None,
        latency_ms: Optional[float] = None,
        details: Optional[Dict[str, Any]] = None
    ) -> AuditLog:
        log_entry = AuditLog(
            user_id=user_id,
            action=action,
            endpoint=endpoint,
            ip_address=ip_address,
            status_code=status_code,
            latency_ms=latency_ms,
            details=details
        )
        db.add(log_entry)
        db.commit()
        db.refresh(log_entry)
        return log_entry

    @staticmethod
    def get_recent_logs(db: Session, limit: int = 50) -> List[AuditLog]:
        return db.query(AuditLog).order_by(desc(AuditLog.created_at)).limit(limit).all()
