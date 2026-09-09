# REST API Specification & Endpoints Reference

The FastAPI backend provides interactive Swagger documentation at `http://localhost:8000/docs` and OpenAPI JSON at `http://localhost:8000/openapi.json`.

---

## 1. Authentication Endpoints

### `POST /api/v1/auth/register`
Creates a new user account and returns signed JWT tokens.
- **Request Body**:
```json
{
  "username": "alex_student",
  "email": "alex@example.com",
  "full_name": "Alex Johnson",
  "password": "Password@123"
}
```
- **Response**: `201 Created` with `Token` object.

### `POST /api/v1/auth/login`
Authenticates credentials and returns access and refresh tokens.
- **Request Body**:
```json
{
  "username": "admin",
  "password": "Admin@12345"
}
```

### `GET /api/v1/auth/me`
Returns the currently authenticated user profile (`Bearer <token>` required).

---

## 2. Prediction Endpoints

### `POST /api/v1/predict`
Generates comprehensive student performance prediction, SHAP attributions, and personalized recommendations.
- **Request Body**:
```json
{
  "school": "GP",
  "sex": "F",
  "age": 17,
  "address": "U",
  "famsize": "GT3",
  "Pstatus": "T",
  "Medu": 4,
  "Fedu": 3,
  "Mjob": "services",
  "Fjob": "other",
  "reason": "course",
  "guardian": "mother",
  "traveltime": 1,
  "studytime": 3,
  "failures": 0,
  "schoolsup": "no",
  "famsup": "yes",
  "paid": "yes",
  "activities": "yes",
  "nursery": "yes",
  "higher": "yes",
  "internet": "yes",
  "romantic": "no",
  "famrel": 4,
  "freetime": 3,
  "goout": 2,
  "Dalc": 1,
  "Walc": 1,
  "health": 5,
  "absences": 2,
  "G1": 14.0,
  "G2": 15.0
}
```
- **Response Sample**:
```json
{
  "predicted_g3": 15.2,
  "predicted_percentage": 76.0,
  "pass_fail": "Pass",
  "pass_probability": 0.942,
  "risk_level": "Low",
  "confidence_score": 89.4,
  "performance_tier": "Good",
  "model_version": "v1.0.0",
  "champion_regressor": "Random Forest",
  "top_features": [...],
  "human_readable_insights": [...],
  "recommendations": [...]
}
```

### `GET /api/v1/presets`
Returns 4 pre-configured student profiles ("Top Performer", "Average", "At-Risk", "Improver") for immediate 1-click evaluation.

---

## 3. Batch Inference Endpoints

### `POST /api/v1/batch-predict`
Accepts multipart CSV upload, executes vectorized inference across all rows, and returns summary stats.

### `GET /api/v1/batch-predict/download/{batch_id}`
Streams downloadable CSV file annotated with `Predicted_G3`, `Pass_Fail`, `Risk_Level`, and `Top_Recommendation`.

### `GET /api/v1/batch-predict/template`
Downloads standard CSV template with valid headers and sample rows.

---

## 4. Analytics & Model Endpoints

### `GET /api/v1/analytics/overview`
Returns grade distributions, study time trends, failure rates vs absences, and the multi-model leaderboard.

### `GET /api/v1/model-info`
Returns active model metadata, algorithm specifications, and feature importance rankings.

### `POST /api/v1/admin/retrain`
Triggers full retraining across all algorithms and updates the champion model in memory.

### `GET /health`
Returns service uptime, database health, and ML model status.
