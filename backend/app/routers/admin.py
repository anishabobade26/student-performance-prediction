from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.auth import UserResponse
from app.services.auth_service import get_current_admin_user, get_current_user_optional
from app.repositories.user_repository import UserRepository
from app.repositories.prediction_repository import PredictionRepository
from app.repositories.audit_repository import AuditRepository
from app.ml.trainer import ModelTrainer
from app.ml.registry import model_registry
from app.ml.data_loader import load_dataset, get_feature_and_target
from app.models.user import User

router = APIRouter(prefix="/admin", tags=["Admin & Operations"])


@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Returns list of all registered platform users.
    """
    return [UserResponse.model_validate(u) for u in UserRepository.list_all(db)]


@router.get("/stats")
def get_admin_system_stats(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Returns system level aggregated metrics for admin dashboard.
    """
    total_users = UserRepository.count(db)
    pred_stats = PredictionRepository.get_aggregate_stats(db)

    return {
        "total_users": total_users,
        "total_predictions": pred_stats["total_predictions"],
        "average_g3": pred_stats["average_g3"],
        "pass_count": pred_stats["pass_count"],
        "fail_count": pred_stats["fail_count"],
        "high_risk_count": pred_stats["high_risk_count"],
        "active_model_version": model_registry.metadata.get("version", "v1.0.0"),
        "champion_model": model_registry.metadata.get("champion_regressor_name", "Random Forest")
    }


@router.post("/retrain")
def trigger_model_retraining(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Triggers complete ML retraining and cross-validation across all algorithms.
    """
    try:
        df = load_dataset()
        trainer = ModelTrainer(test_size=0.2, random_state=42)
        summary = trainer.train_pipeline(df=df)

        X, _ = get_feature_and_target(df)
        background_transformed = trainer.preprocessor.transform(X[:100])

        model_registry.save_artifacts(
            trainer_summary=summary,
            champion_regressor=trainer.champion_regressor,
            champion_classifier=trainer.champion_classifier,
            preprocessor=trainer.preprocessor,
            background_data=background_transformed,
            version="v1.1.0"
        )

        AuditRepository.log_action(
            db=db,
            action="MODEL_RETRAIN",
            endpoint="/api/v1/admin/retrain",
            user_id=current_user.id if current_user else None,
            details={"champion_regressor": summary["champion_regressor"]}
        )

        return {
            "success": True,
            "message": "Model retraining executed successfully.",
            "champion_regressor": summary["champion_regressor"],
            "champion_classifier": summary["champion_classifier"],
            "best_r2_score": summary["regression_leaderboard"][0]["r2_score"],
            "best_rmse": summary["regression_leaderboard"][0]["rmse"]
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Retraining failed: {str(e)}"
        )


@router.get("/logs")
def get_system_audit_logs(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Returns recent system audit logs for administrative monitoring.
    """
    logs = AuditRepository.get_recent_logs(db, limit=50)
    return [
        {
            "id": l.id,
            "action": l.action,
            "endpoint": l.endpoint,
            "ip_address": l.ip_address,
            "latency_ms": l.latency_ms,
            "created_at": l.created_at
        }
        for l in logs
    ]
