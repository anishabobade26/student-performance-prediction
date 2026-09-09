import os
import json
from pathlib import Path
from typing import Dict, Any, Optional, Tuple
import joblib
import pandas as pd
from loguru import logger

from app.ml.preprocessor import MLPreprocessor
from app.ml.explainer import ExplainabilityEngine

DEFAULT_MODEL_DIR = Path(__file__).resolve().parent.parent.parent / "saved_models"


class ModelRegistry:
    """
    Manages persistence, loading, versioning, and caching of trained ML artifacts.
    """
    def __init__(self, model_dir: Optional[Path] = None):
        self.model_dir = model_dir or DEFAULT_MODEL_DIR
        self.model_dir.mkdir(parents=True, exist_ok=True)
        
        self.regressor_path = self.model_dir / "champion_regressor.joblib"
        self.classifier_path = self.model_dir / "champion_classifier.joblib"
        self.preprocessor_path = self.model_dir / "preprocessor.joblib"
        self.background_path = self.model_dir / "background_data.joblib"
        self.metrics_path = self.model_dir / "metrics.json"
        self.metadata_path = self.model_dir / "model_metadata.json"

        # In-memory cached artifacts
        self.champion_regressor = None
        self.champion_classifier = None
        self.preprocessor: Optional[MLPreprocessor] = None
        self.background_data = None
        self.metrics: Dict[str, Any] = {}
        self.metadata: Dict[str, Any] = {}
        self.explainer: Optional[ExplainabilityEngine] = None

        if self.is_trained():
            self.load_artifacts()

    def is_trained(self) -> bool:
        """Returns True if essential model artifacts exist on disk."""
        return (
            self.regressor_path.exists()
            and self.preprocessor_path.exists()
            and self.metrics_path.exists()
        )

    def save_artifacts(
        self,
        trainer_summary: Dict[str, Any],
        champion_regressor: Any,
        champion_classifier: Any,
        preprocessor: MLPreprocessor,
        background_data: Any,
        version: str = "v1.0.0"
    ) -> None:
        """Serializes all pipeline components to disk."""
        logger.info(f"Saving ML model artifacts to: {self.model_dir}")
        self.model_dir.mkdir(parents=True, exist_ok=True)

        joblib.dump(champion_regressor, self.regressor_path)
        joblib.dump(champion_classifier, self.classifier_path)
        joblib.dump(preprocessor, self.preprocessor_path)
        joblib.dump(background_data, self.background_path)

        with open(self.metrics_path, "w", encoding="utf-8") as f:
            json.dump(trainer_summary, f, indent=2)

        metadata = {
            "version": version,
            "champion_regressor_name": trainer_summary.get("champion_regressor"),
            "champion_classifier_name": trainer_summary.get("champion_classifier"),
            "features_count": trainer_summary.get("total_features_engineered"),
            "dataset_info": trainer_summary.get("dataset_info"),
            "last_trained_timestamp": trainer_summary.get("timestamp"),
            "model_directory": str(self.model_dir),
        }

        with open(self.metadata_path, "w", encoding="utf-8") as f:
            json.dump(metadata, f, indent=2)

        logger.info("All model artifacts saved successfully.")
        # Reload into memory
        self.load_artifacts()

    def load_artifacts(self) -> bool:
        """Loads serialized models, preprocessors, and metadata into memory."""
        if not self.is_trained():
            logger.warning(f"No trained artifacts found at {self.model_dir}")
            return False

        try:
            logger.info("Loading ML artifacts into memory...")
            self.champion_regressor = joblib.load(self.regressor_path)
            self.champion_classifier = joblib.load(self.classifier_path) if self.classifier_path.exists() else None
            self.preprocessor = joblib.load(self.preprocessor_path)
            self.background_data = joblib.load(self.background_path) if self.background_path.exists() else None

            if self.metrics_path.exists():
                with open(self.metrics_path, "r", encoding="utf-8") as f:
                    self.metrics = json.load(f)

            if self.metadata_path.exists():
                with open(self.metadata_path, "r", encoding="utf-8") as f:
                    self.metadata = json.load(f)

            # Initialize explainability engine
            if self.champion_regressor and self.preprocessor:
                self.explainer = ExplainabilityEngine(
                    model=self.champion_regressor,
                    preprocessor=self.preprocessor,
                    background_data=self.background_data
                )

            logger.info("Successfully loaded active ML pipeline.")
            return True
        except Exception as e:
            logger.error(f"Error loading ML artifacts: {e}")
            return False

    def get_summary(self) -> Dict[str, Any]:
        """Returns metadata and metrics summary for API endpoints."""
        return {
            "is_trained": self.is_trained(),
            "metadata": self.metadata,
            "metrics": self.metrics,
        }


# Singleton instance
model_registry = ModelRegistry()
