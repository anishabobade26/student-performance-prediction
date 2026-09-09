import time
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db
from app.ml.registry import model_registry
from app.core.config import settings

router = APIRouter(tags=["Health & Status"])


@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    """
    Returns platform health status, database ping, and ML model status.
    """
    db_status = "healthy"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy ({str(e)})"

    return {
        "status": "online",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": db_status,
        "ml_model_loaded": model_registry.is_trained(),
        "active_version": model_registry.metadata.get("version", "v1.0.0"),
        "environment": settings.ENVIRONMENT
    }
