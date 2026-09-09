import pytest
import numpy as np
import pandas as pd
from pathlib import Path
import sys

backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from app.ml.data_loader import load_dataset, get_feature_and_target
from app.ml.feature_engineering import add_engineered_features, get_engineered_feature_names
from app.ml.preprocessor import MLPreprocessor
from app.ml.evaluator import evaluate_regression, evaluate_classification
from app.ml.trainer import ModelTrainer


def test_data_loader():
    df = load_dataset()
    assert not df.empty
    assert "G3" in df.columns
    assert len(df) > 300

    X, y = get_feature_and_target(df)
    assert "G3" not in X.columns
    assert len(y) == len(df)


def test_feature_engineering():
    df = load_dataset()
    eng_df = add_engineered_features(df)
    
    assert "prior_grade_avg" in eng_df.columns
    assert "grade_trend" in eng_df.columns
    assert "alcohol_index" in eng_df.columns
    assert "support_score" in eng_df.columns

    # Verify calculation correctness
    sample = eng_df.iloc[0]
    expected_avg = (float(sample["G1"]) + float(sample["G2"])) / 2.0
    assert sample["prior_grade_avg"] == pytest.approx(expected_avg, 0.01)


def test_preprocessor_transformation():
    df = load_dataset()
    X, _ = get_feature_and_target(df)
    
    preprocessor = MLPreprocessor()
    X_trans = preprocessor.fit_transform(X)
    
    assert isinstance(X_trans, np.ndarray)
    assert X_trans.shape[0] == len(X)
    assert X_trans.shape[1] > 30
    assert len(preprocessor.get_feature_names()) == X_trans.shape[1]


def test_evaluator_metrics():
    y_true = [12.0, 15.0, 8.0, 10.0, 18.0]
    y_pred = [12.5, 14.2, 8.5, 10.1, 17.6]

    reg_metrics = evaluate_regression(y_true, y_pred, n_features=5)
    assert "r2_score" in reg_metrics
    assert "rmse" in reg_metrics
    assert "mae" in reg_metrics
    assert reg_metrics["r2_score"] > 0.9

    y_bin_true = [1, 1, 0, 1, 1]
    y_bin_pred = [1, 1, 0, 1, 1]
    clf_metrics = evaluate_classification(y_bin_true, y_bin_pred)
    assert clf_metrics["accuracy"] == 1.0
    assert clf_metrics["f1_score"] == 1.0
