import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from app.ml.data_loader import load_dataset, get_feature_and_target
from app.ml.trainer import ModelTrainer
from app.ml.registry import model_registry
from loguru import logger


def run_training():
    logger.info("=== Starting Student Performance AI Training Pipeline ===")
    
    # 1. Load dataset
    df = load_dataset()
    logger.info(f"Loaded dataset: {df.shape[0]} rows, {df.shape[1]} columns")

    # 2. Run trainer
    trainer = ModelTrainer(test_size=0.2, random_state=42)
    summary = trainer.train_pipeline(df=df)

    # 3. Transform full training features to save as background data for SHAP/LIME
    X, _ = get_feature_and_target(df)
    background_transformed = trainer.preprocessor.transform(X[:100])

    # 4. Save artifacts
    model_registry.save_artifacts(
        trainer_summary=summary,
        champion_regressor=trainer.champion_regressor,
        champion_classifier=trainer.champion_classifier,
        preprocessor=trainer.preprocessor,
        background_data=background_transformed,
        version="v1.0.0"
    )

    logger.info("=== Training Complete! ===")
    logger.info(f"Champion Regressor: {summary['champion_regressor']}")
    logger.info(f"Champion Classifier: {summary['champion_classifier']}")
    logger.info(f"Best Test R2: {summary['regression_leaderboard'][0]['r2_score']}")
    logger.info(f"Best Test RMSE: {summary['regression_leaderboard'][0]['rmse']}")
    logger.info(f"Best Classifier F1: {summary['classification_leaderboard'][0]['f1_score']}")


if __name__ == "__main__":
    run_training()
