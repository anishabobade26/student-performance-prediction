import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from app.ml.registry import model_registry
from loguru import logger


def evaluate_active_model():
    logger.info("=== Student Performance AI - Model Evaluation Report ===")
    if not model_registry.is_trained():
        logger.error("No active model artifacts found. Please run scripts/train_models.py first.")
        return

    model_registry.load_artifacts()
    metrics = model_registry.metrics
    metadata = model_registry.metadata

    print("\n" + "="*60)
    print(f"  ACTIVE MODEL VERSION: {metadata.get('version', 'v1.0.0')}")
    print(f"  CHAMPION REGRESSOR:  {metadata.get('champion_regressor_name')}")
    print(f"  CHAMPION CLASSIFIER: {metadata.get('champion_classifier_name')}")
    print(f"  TOTAL SAMPLES:       {metrics.get('total_samples')}")
    print(f"  TOTAL FEATURES:      {metadata.get('features_count')}")
    print("="*60)

    print("\n--- REGRESSION BENCHMARK LEADERBOARD ---")
    print(f"{'Model Name':<25} | {'Test R²':<10} | {'Test RMSE':<10} | {'Test MAE':<10} | {'CV R² Mean':<10}")
    print("-" * 75)
    for row in metrics.get("regression_leaderboard", []):
        print(f"{row['model_name']:<25} | {row['r2_score']:<10.4f} | {row['rmse']:<10.4f} | {row['mae']:<10.4f} | {row.get('cv_r2_mean', 0.0):<10.4f}")

    print("\n--- CLASSIFICATION (PASS/FAIL) LEADERBOARD ---")
    print(f"{'Model Name':<30} | {'Accuracy':<10} | {'F1-Score':<10} | {'ROC-AUC':<10}")
    print("-" * 70)
    for row in metrics.get("classification_leaderboard", []):
        print(f"{row['model_name']:<30} | {row['accuracy']:<10.4f} | {row['f1_score']:<10.4f} | {row.get('roc_auc', 0.0):<10.4f}")
    print("="*60 + "\n")


if __name__ == "__main__":
    evaluate_active_model()
