import numpy as np
from typing import Dict, Any, Union
from sklearn.metrics import (
    mean_absolute_error,
    root_mean_squared_error,
    r2_score,
    mean_absolute_percentage_error,
    median_absolute_error,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report
)


def calculate_adjusted_r2(r2: float, n: int, p: int) -> float:
    """Calculates Adjusted R2 score given R2, sample size n, and feature count p."""
    if n <= p + 1:
        return r2
    return 1.0 - (1.0 - r2) * (n - 1.0) / (n - p - 1.0)


def evaluate_regression(
    y_true: Union[np.ndarray, list],
    y_pred: Union[np.ndarray, list],
    n_features: int = 1
) -> Dict[str, Any]:
    """
    Computes comprehensive regression evaluation metrics.
    """
    y_true = np.array(y_true, dtype=float)
    y_pred = np.array(y_pred, dtype=float)

    mae = float(mean_absolute_error(y_true, y_pred))
    rmse = float(root_mean_squared_error(y_true, y_pred))
    r2 = float(r2_score(y_true, y_pred))
    medae = float(median_absolute_error(y_true, y_pred))
    
    # Safe MAPE avoiding division by zero
    non_zero_mask = y_true != 0
    if np.sum(non_zero_mask) > 0:
        mape = float(mean_absolute_percentage_error(y_true[non_zero_mask], y_pred[non_zero_mask]))
    else:
        mape = 0.0

    adj_r2 = float(calculate_adjusted_r2(r2, len(y_true), n_features))

    return {
        "mae": round(mae, 4),
        "rmse": round(rmse, 4),
        "r2_score": round(r2, 4),
        "adjusted_r2": round(adj_r2, 4),
        "median_absolute_error": round(medae, 4),
        "mape": round(mape, 4),
    }


def evaluate_classification(
    y_true: Union[np.ndarray, list],
    y_pred: Union[np.ndarray, list],
    y_prob: Union[np.ndarray, list, None] = None
) -> Dict[str, Any]:
    """
    Computes comprehensive classification metrics (e.g. for Pass/Fail binary target).
    """
    y_true = np.array(y_true, dtype=int)
    y_pred = np.array(y_pred, dtype=int)

    acc = float(accuracy_score(y_true, y_pred))
    prec = float(precision_score(y_true, y_pred, zero_division=0))
    rec = float(recall_score(y_true, y_pred, zero_division=0))
    f1 = float(f1_score(y_true, y_pred, zero_division=0))
    
    roc_auc = 0.0
    if y_prob is not None:
        try:
            roc_auc = float(roc_auc_score(y_true, y_prob))
        except Exception:
            roc_auc = 0.0

    cm = confusion_matrix(y_true, y_pred).tolist()
    report = classification_report(y_true, y_pred, output_dict=True, zero_division=0)

    return {
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "roc_auc": round(roc_auc, 4),
        "confusion_matrix": cm,
        "classification_report": report
    }
