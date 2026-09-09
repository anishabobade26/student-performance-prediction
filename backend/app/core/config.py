import os
from pathlib import Path
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Student Performance Prediction AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Security
    SECRET_KEY: str = "super-secret-production-grade-jwt-signing-key-student-ai-2026-xyz"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "https://student-performance-ai.vercel.app",
        "*"
    ]

    # Database: Default to local SQLite with dynamic PostgreSQL override
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./student_ai.db")

    # Redis Cache (optional)
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    # Dataset & Models paths
    DATASET_PATH: str = os.getenv("DATASET_PATH", "")
    SAVED_MODELS_DIR: str = str(Path(__file__).resolve().parent.parent.parent / "saved_models")

    # Admin default credentials
    ADMIN_USERNAME: str = "admin"
    ADMIN_EMAIL: str = "admin@studentai.io"
    ADMIN_PASSWORD: str = "Admin@12345"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()
