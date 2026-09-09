# Machine Learning Pipeline & Model Engineering

The ML pipeline is constructed with modularity, reproducibility, and high diagnostic precision.

---

## 1. Feature Engineering

From raw inputs, the pipeline derives domain-specific indicators that significantly boost predictive signal:

1. **`prior_grade_avg`**: Mean of period 1 ($G1$) and period 2 ($G2$) scores.
2. **`grade_trend`**: Trajectory indicator calculated as $G2 - G1$.
3. **`grade_consistency`**: Binary flag indicating stable vs volatile exam results.
4. **`parent_edu_avg`**: Average of mother ($Medu$) and father ($Fedu$) education levels.
5. **`alcohol_index`**: Composite sum of workday ($Dalc$) and weekend ($Walc$) alcohol consumption.
6. **`support_score`**: Aggregate score of school academic support, family support, and paid tutoring.
7. **`study_to_travel_ratio`**: Proportion of weekly study time to commute time.
8. **`high_absence_risk`**: Binary flag triggered when absences exceed 10 days.
9. **`has_prior_failures`**: Indicator flag for students with historical subject failures.

---

## 2. Preprocessing & Encoding

- **Categorical Columns**: Encoded using `OneHotEncoder(handle_unknown='ignore', sparse_output=False)` to prevent out-of-vocabulary crashes on unseen categories during batch inference.
- **Numerical Columns**: Standardized via `StandardScaler()` to balance feature magnitudes.
- **Transformed Feature Dimension**: 72 features input into regressors and classifiers.

---

## 3. Algorithms & Benchmarking

| Algorithm | Model Type | Optimization Objective | Test $R^2$ | Test RMSE |
| :--- | :--- | :--- | :--- | :--- |
| **Random Forest Regressor** | Ensemble Bagging | Variance Reduction | **0.8212** | **1.9149** |
| **Gradient Boosting** | Boosting | Sequential Residual Fitting | 0.8186 | 1.9288 |
| **LightGBM** | Histogram Gradient Boosting | High Throughput | 0.8127 | 1.9598 |
| **XGBoost** | Regularized Boosting | L1/L2 Penalized Splitting | 0.8018 | 2.0161 |
| **Lasso Regression** | Linear with L1 Penalty | Feature Sparsity | 0.7849 | 2.1003 |
| **Extra Trees** | Extremely Randomized Trees | Bias-Variance Tradeoff | 0.7584 | 2.2259 |
| **Ridge Regression** | Linear with L2 Penalty | Multicollinearity Mitigation | 0.7227 | 2.3847 |
| **Linear Regression** | Ordinary Least Squares | Baseline Benchmark | 0.7208 | 2.3926 |
| **Decision Tree** | Single CART | Interpretability Baseline | 0.6380 | 2.7246 |

---

## 4. Artifact Serialization & Registry

All trained components are persisted into `backend/saved_models/`:
- `champion_regressor.joblib`
- `champion_classifier.joblib`
- `preprocessor.joblib`
- `background_data.joblib`
- `metrics.json`
- `model_metadata.json`
