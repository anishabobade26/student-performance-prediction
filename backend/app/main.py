import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from loguru import logger

from app.core.config import settings
from app.core.logging import setup_logging
from app.core.database import init_db, SessionLocal
from app.core.exceptions import (
    AppException,
    app_exception_handler,
    validation_exception_handler,
    unhandled_exception_handler
)
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import UserCreate
from app.ml.registry import model_registry
from app.ml.trainer import ModelTrainer
from app.ml.data_loader import load_dataset, get_feature_and_target

# Import routers
from app.routers import auth, predict, batch_predict, analytics, history, model_info, admin, health


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Setup logging
    setup_logging()
    logger.info("Initializing Student Performance Prediction AI Backend...")

    # 2. Initialize Database tables
    init_db()

    # 3. Seed default admin user if not exists
    db = SessionLocal()
    try:
        admin_user = UserRepository.get_by_username(db, settings.ADMIN_USERNAME)
        if not admin_user:
            logger.info("Seeding initial default admin user...")
            UserRepository.create(
                db,
                UserCreate(
                    username=settings.ADMIN_USERNAME,
                    email=settings.ADMIN_EMAIL,
                    full_name="Platform Administrator",
                    password=settings.ADMIN_PASSWORD
                ),
                is_admin=True
            )
            logger.info("Admin user seeded successfully (admin / Admin@12345).")
    finally:
        db.close()

    # 4. Check ML Model artifacts & auto-train if missing
    if not model_registry.is_trained():
        logger.warning("ML artifacts not found. Starting automatic initial model training...")
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
                version="v1.0.0"
            )
            logger.info("Initial ML model training completed and loaded.")
        except Exception as e:
            logger.error(f"Failed to auto-train initial ML pipeline: {e}")
    else:
        logger.info("Loading existing ML model artifacts from disk...")
        model_registry.load_artifacts()

    logger.info(f"{settings.PROJECT_NAME} startup complete. Ready to serve requests!")
    yield
    logger.info("Shutting down backend services...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production-grade Student Performance Prediction AI SaaS API with Multi-Model Benchmarking, SHAP/LIME Explainable AI, and Personalized Study Recommendations.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request Latency & Logging Middleware
@app.middleware("http")
async def log_requests_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration_ms = round((time.time() - start_time) * 1000, 2)
    response.headers["X-Process-Time"] = f"{duration_ms}ms"
    logger.info(f"{request.method} {request.url.path} - Status: {response.status_code} - {duration_ms}ms")
    return response


# Register Exception Handlers
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)

# Mount Routers
app.include_router(health.router)
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(predict.router, prefix=settings.API_V1_STR)
app.include_router(batch_predict.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(history.router, prefix=settings.API_V1_STR)
app.include_router(model_info.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "operational",
        "docs": "/docs",
        "health": "/health",
    }
