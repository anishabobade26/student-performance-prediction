from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.prediction import PredictionHistoryResponse, PredictionHistoryItem
from app.repositories.prediction_repository import PredictionRepository
from app.services.auth_service import get_current_user_optional
from app.models.user import User

router = APIRouter(prefix="/history", tags=["Prediction History"])


@router.get("", response_model=PredictionHistoryResponse)
def get_prediction_history(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Returns paginated history of predictions for the current user or global history.
    """
    skip = (page - 1) * page_size
    user_id = current_user.id if current_user and not current_user.is_admin else None
    
    predictions, total = PredictionRepository.get_by_user_id(db, user_id=user_id, skip=skip, limit=page_size)
    
    return PredictionHistoryResponse(
        total=total,
        page=page,
        page_size=page_size,
        predictions=[PredictionHistoryItem.model_validate(p) for p in predictions]
    )


@router.get("/{prediction_id}", response_model=PredictionHistoryItem)
def get_single_prediction_history(
    prediction_id: int,
    db: Session = Depends(get_db)
):
    """
    Returns full details of a specific past prediction.
    """
    pred = PredictionRepository.get_by_id(db, prediction_id)
    if not pred:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prediction with ID {prediction_id} not found."
        )
    return PredictionHistoryItem.model_validate(pred)


@router.delete("/{prediction_id}", status_code=status.HTTP_200_OK)
def delete_prediction(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Deletes a specific prediction record from history.
    """
    user_id = current_user.id if current_user and not current_user.is_admin else None
    deleted = PredictionRepository.delete_by_id(db, prediction_id, user_id=user_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prediction record {prediction_id} not found or permission denied."
        )
    return {"success": True, "message": f"Prediction {prediction_id} deleted successfully."}
