from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.student import StudentInput
from app.schemas.prediction import PredictionResponse, PresetStudent
from app.services.prediction_service import PredictionService
from app.services.auth_service import get_current_user_optional
from app.models.user import User

router = APIRouter(prefix="", tags=["Prediction"])


@router.post("/predict", response_model=PredictionResponse, status_code=status.HTTP_200_OK)
def predict_student_performance(
    student_input: StudentInput,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Predicts student final grade (G3), Pass/Fail outcome, Risk Level,
    SHAP/LIME explainability breakdown, and personalized actionable recommendations.
    """
    return PredictionService.predict_single(student_input, db=db, current_user=current_user)


@router.get("/presets", response_model=List[PresetStudent])
def get_sample_presets():
    """
    Returns curated preset profiles to enable instant 1-click demo evaluation.
    """
    return [
        PresetStudent(
            name="Top Performer (Honors Track)",
            description="High study time, strong parental education, zero failures, consistent high test scores.",
            tag="Top Performer",
            data=StudentInput(
                school="GP", sex="F", age=16, address="U", famsize="LE3", Pstatus="T",
                Medu=4, Fedu=4, Mjob="teacher", Fjob="health", reason="reputation", guardian="mother",
                traveltime=1, studytime=4, failures=0, schoolsup="no", famsup="yes", paid="yes",
                activities="yes", nursery="yes", higher="yes", internet="yes", romantic="no",
                famrel=5, freetime=2, goout=2, Dalc=1, Walc=1, health=5, absences=1,
                G1=17.0, G2=18.0
            )
        ),
        PresetStudent(
            name="Average Dedicated Student",
            description="Moderate study time, typical absences, steady passing performance with room for growth.",
            tag="Average",
            data=StudentInput(
                school="GP", sex="M", age=17, address="U", famsize="GT3", Pstatus="T",
                Medu=3, Fedu=2, Mjob="services", Fjob="other", reason="course", guardian="mother",
                traveltime=2, studytime=2, failures=0, schoolsup="no", famsup="yes", paid="no",
                activities="yes", nursery="yes", higher="yes", internet="yes", romantic="no",
                famrel=4, freetime=3, goout=3, Dalc=1, Walc=2, health=4, absences=4,
                G1=11.0, G2=12.0
            )
        ),
        PresetStudent(
            name="At-Risk Student (Early Intervention Needed)",
            description="Past failures, high absences, low study hours, low G1/G2 scores requiring active remediation.",
            tag="At-Risk",
            data=StudentInput(
                school="MS", sex="M", age=18, address="R", famsize="GT3", Pstatus="A",
                Medu=1, Fedu=1, Mjob="other", Fjob="other", reason="other", guardian="other",
                traveltime=3, studytime=1, failures=2, schoolsup="no", famsup="no", paid="no",
                activities="no", nursery="no", higher="no", internet="no", romantic="yes",
                famrel=2, freetime=4, goout=5, Dalc=3, Walc=4, health=2, absences=18,
                G1=6.0, G2=7.0
            )
        ),
        PresetStudent(
            name="High Potential with High Absences",
            description="Strong baseline aptitude but recent attendance drop impacting momentum.",
            tag="Improver",
            data=StudentInput(
                school="GP", sex="F", age=17, address="U", famsize="GT3", Pstatus="T",
                Medu=4, Fedu=3, Mjob="health", Fjob="services", reason="home", guardian="mother",
                traveltime=1, studytime=3, failures=0, schoolsup="no", famsup="yes", paid="no",
                activities="yes", nursery="yes", higher="yes", internet="yes", romantic="no",
                famrel=4, freetime=3, goout=2, Dalc=1, Walc=1, health=3, absences=14,
                G1=14.0, G2=13.0
            )
        )
    ]
