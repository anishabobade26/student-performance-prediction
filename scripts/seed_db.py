import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from app.core.database import SessionLocal, init_db
from app.repositories.user_repository import UserRepository
from app.schemas.auth import UserCreate
from app.schemas.student import StudentInput
from app.services.prediction_service import PredictionService
from loguru import logger


def seed_database():
    logger.info("Initializing and seeding database with demo evaluations...")
    init_db()
    db = SessionLocal()

    try:
        # Seed admin
        admin = UserRepository.get_by_username(db, "admin")
        if not admin:
            admin = UserRepository.create(
                db,
                UserCreate(
                    username="admin",
                    email="admin@studentai.io",
                    full_name="Platform Administrator",
                    password="Admin@12345"
                ),
                is_admin=True
            )
            logger.info("Admin user created: admin / Admin@12345")

        # Seed student user
        student = UserRepository.get_by_username(db, "demo_student")
        if not student:
            student = UserRepository.create(
                db,
                UserCreate(
                    username="demo_student",
                    email="demostudent@studentai.io",
                    full_name="Demo Student Evaluator",
                    password="DemoStudent@123"
                ),
                is_admin=False
            )
            logger.info("Demo student user created: demo_student / DemoStudent@123")

        # Seed sample predictions
        sample_profiles = [
            StudentInput(
                school="GP", sex="F", age=17, address="U", famsize="GT3", Pstatus="T",
                Medu=4, Fedu=3, Mjob="services", Fjob="other", reason="reputation", guardian="mother",
                traveltime=1, studytime=3, failures=0, schoolsup="no", famsup="yes", paid="yes",
                activities="yes", nursery="yes", higher="yes", internet="yes", romantic="no",
                famrel=4, freetime=3, goout=2, Dalc=1, Walc=1, health=5, absences=2,
                G1=14.0, G2=15.0
            ),
            StudentInput(
                school="GP", sex="M", age=16, address="U", famsize="LE3", Pstatus="T",
                Medu=3, Fedu=2, Mjob="services", Fjob="other", reason="course", guardian="mother",
                traveltime=2, studytime=2, failures=0, schoolsup="no", famsup="yes", paid="no",
                activities="yes", nursery="yes", higher="yes", internet="yes", romantic="no",
                famrel=4, freetime=3, goout=3, Dalc=1, Walc=2, health=4, absences=4,
                G1=11.0, G2=12.0
            ),
            StudentInput(
                school="MS", sex="M", age=18, address="R", famsize="GT3", Pstatus="A",
                Medu=1, Fedu=1, Mjob="other", Fjob="other", reason="other", guardian="other",
                traveltime=3, studytime=1, failures=2, schoolsup="no", famsup="no", paid="no",
                activities="no", nursery="no", higher="no", internet="no", romantic="yes",
                famrel=2, freetime=4, goout=5, Dalc=3, Walc=4, health=2, absences=18,
                G1=6.0, G2=7.0
            )
        ]

        for prof in sample_profiles:
            PredictionService.predict_single(prof, db=db, current_user=admin)

        logger.info(f"Seeded {len(sample_profiles)} sample prediction records.")
        print("Database seeded successfully!")

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
