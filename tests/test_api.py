import pytest
import io
from pathlib import Path
import sys
from fastapi.testclient import TestClient

backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from app.main import app
from app.core.database import init_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_app():
    init_db()


def test_health_check():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert data["database"] == "healthy"
    assert data["ml_model_loaded"] is True


def test_predict_presets():
    res = client.get("/api/v1/presets")
    assert res.status_code == 200
    presets = res.json()
    assert len(presets) >= 3
    assert presets[0]["name"] != ""


def test_predict_single_endpoint():
    student_payload = {
        "school": "GP", "sex": "F", "age": 17, "address": "U", "famsize": "GT3", "Pstatus": "T",
        "Medu": 4, "Fedu": 3, "Mjob": "services", "Fjob": "other", "reason": "course", "guardian": "mother",
        "traveltime": 1, "studytime": 3, "failures": 0, "schoolsup": "no", "famsup": "yes", "paid": "no",
        "activities": "yes", "nursery": "yes", "higher": "yes", "internet": "yes", "romantic": "no",
        "famrel": 4, "freetime": 3, "goout": 2, "Dalc": 1, "Walc": 1, "health": 5, "absences": 2,
        "G1": 15.0, "G2": 16.0
    }

    res = client.post("/api/v1/predict", json=student_payload)
    assert res.status_code == 200
    data = res.json()
    assert "predicted_g3" in data
    assert 0 <= data["predicted_g3"] <= 20
    assert data["pass_fail"] in ["Pass", "Fail"]
    assert "risk_level" in data
    assert len(data["top_features"]) > 0
    assert len(data["recommendations"]) >= 3
    assert len(data["human_readable_insights"]) > 0


def test_analytics_overview():
    res = client.get("/api/v1/analytics/overview")
    assert res.status_code == 200
    data = res.json()
    assert "total_predictions" in data
    assert "grade_distribution" in data
    assert "study_time_analysis" in data
    assert "leaderboard" in data
    assert len(data["leaderboard"]) > 0


def test_model_info():
    res = client.get("/api/v1/model-info")
    assert res.status_code == 200
    data = res.json()
    assert data["is_trained"] is True
    assert "champion_regressor_name" in data
    assert len(data["feature_importances"]) > 0


def test_batch_predict():
    csv_content = (
        "school;sex;age;address;famsize;Pstatus;Medu;Fedu;Mjob;Fjob;reason;guardian;traveltime;studytime;failures;schoolsup;famsup;paid;activities;nursery;higher;internet;romantic;famrel;freetime;goout;Dalc;Walc;health;absences;G1;G2\n"
        "GP;F;17;U;GT3;T;4;3;services;other;course;mother;1;3;0;no;yes;no;yes;yes;yes;yes;no;4;3;2;1;1;5;2;14;15\n"
        "MS;M;18;R;GT3;A;1;1;other;other;other;other;3;1;2;no;no;no;no;no;no;no;yes;2;4;5;3;4;2;18;6;7\n"
    )
    files = {"file": ("test_batch.csv", io.BytesIO(csv_content.encode("utf-8")), "text/csv")}
    res = client.post("/api/v1/batch-predict", files=files)
    assert res.status_code == 200
    data = res.json()
    assert data["total_students"] == 2
    assert len(data["predictions"]) == 2
    assert "batch_id" in data
