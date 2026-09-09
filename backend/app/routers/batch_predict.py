from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, Response, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.prediction import BatchPredictionResponse
from app.services.batch_service import BatchService
from app.services.auth_service import get_current_user_optional
from app.models.user import User
from app.core.cache import cache

router = APIRouter(prefix="/batch-predict", tags=["Batch Prediction"])


@router.post("", response_model=BatchPredictionResponse, status_code=status.HTTP_200_OK)
async def upload_and_predict_batch(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Accepts CSV file upload with student records, performs vectorized inference,
    returns summary statistics, and prepares annotated CSV for download.
    """
    if not file.filename.endswith(".csv"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only .csv files are supported."
        )

    response, csv_content = await BatchService.process_batch_csv(file, db=db, current_user=current_user)
    
    # Cache generated CSV content for 30 minutes
    cache.set(f"batch_csv:{response.batch_id}", csv_content, ttl_seconds=1800)
    
    return response


@router.get("/download/{batch_id}")
def download_batch_results(batch_id: str):
    """
    Downloads annotated CSV results with predictions, risk tiers, and recommendations.
    """
    csv_content = cache.get(f"batch_csv:{batch_id}")
    if not csv_content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Batch prediction result expired or not found."
        )

    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=student_predictions_{batch_id}.csv"}
    )


@router.get("/template")
def download_sample_csv_template():
    """
    Returns sample CSV template with valid column headers and 3 example rows.
    """
    template_content = (
        "school,sex,age,address,famsize,Pstatus,Medu,Fedu,Mjob,Fjob,reason,guardian,traveltime,studytime,failures,schoolsup,famsup,paid,activities,nursery,higher,internet,romantic,famrel,freetime,goout,Dalc,Walc,health,absences,G1,G2\n"
        "GP,F,17,U,GT3,T,4,3,services,other,reputation,mother,1,3,0,no,yes,yes,yes,yes,yes,yes,no,4,3,2,1,1,5,2,14.0,15.0\n"
        "GP,M,16,U,LE3,T,2,2,other,other,home,mother,1,2,0,no,no,no,no,yes,yes,yes,no,4,4,4,1,1,3,0,11.0,12.0\n"
        "MS,M,18,R,GT3,A,1,1,other,other,other,other,3,1,2,no,no,no,no,no,no,no,yes,2,4,5,3,4,2,18,6.0,7.0\n"
    )
    return Response(
        content=template_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=student_batch_template.csv"}
    )
