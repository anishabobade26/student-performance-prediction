from typing import Optional, List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from app.models.prediction import Prediction


class PredictionRepository:
    @staticmethod
    def create(db: Session, prediction_data: Dict[str, Any]) -> Prediction:
        db_prediction = Prediction(**prediction_data)
        db.add(db_prediction)
        db.commit()
        db.refresh(db_prediction)
        return db_prediction

    @staticmethod
    def bulk_create(db: Session, predictions_data: List[Dict[str, Any]]) -> List[Prediction]:
        db_objs = [Prediction(**data) for data in predictions_data]
        db.add_all(db_objs)
        db.commit()
        return db_objs

    @staticmethod
    def get_by_id(db: Session, prediction_id: int) -> Optional[Prediction]:
        return db.query(Prediction).filter(Prediction.id == prediction_id).first()

    @staticmethod
    def get_by_user_id(
        db: Session,
        user_id: Optional[int],
        skip: int = 0,
        limit: int = 20
    ) -> Tuple[List[Prediction], int]:
        query = db.query(Prediction)
        if user_id is not None:
            query = query.filter(Prediction.user_id == user_id)
        
        total = query.count()
        predictions = query.order_by(desc(Prediction.created_at)).offset(skip).limit(limit).all()
        return predictions, total

    @staticmethod
    def delete_by_id(db: Session, prediction_id: int, user_id: Optional[int] = None) -> bool:
        query = db.query(Prediction).filter(Prediction.id == prediction_id)
        if user_id is not None:
            query = query.filter(Prediction.user_id == user_id)
        
        db_pred = query.first()
        if not db_pred:
            return False
        
        db.delete(db_pred)
        db.commit()
        return True

    @staticmethod
    def get_aggregate_stats(db: Session) -> Dict[str, Any]:
        total_count = db.query(Prediction).count()
        if total_count == 0:
            return {
                "total_predictions": 0,
                "average_g3": 0.0,
                "pass_count": 0,
                "fail_count": 0,
                "high_risk_count": 0
            }

        avg_score = db.query(func.avg(Prediction.predicted_g3)).scalar() or 0.0
        pass_count = db.query(Prediction).filter(Prediction.pass_fail == "Pass").count()
        fail_count = db.query(Prediction).filter(Prediction.pass_fail == "Fail").count()
        high_risk_count = db.query(Prediction).filter(Prediction.risk_level.in_(["High", "Critical"])).count()

        return {
            "total_predictions": total_count,
            "average_g3": round(float(avg_score), 2),
            "pass_count": pass_count,
            "fail_count": fail_count,
            "high_risk_count": high_risk_count
        }

    @staticmethod
    def get_recent(db: Session, limit: int = 10) -> List[Prediction]:
        return db.query(Prediction).order_by(desc(Prediction.created_at)).limit(limit).all()
