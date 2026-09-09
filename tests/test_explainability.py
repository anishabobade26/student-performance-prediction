import pytest
import pandas as pd
from pathlib import Path
import sys

backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from app.ml.registry import model_registry
from app.ml.recommender import generate_recommendations


def test_explainability_and_recommendations():
    # Ensure models are loaded
    if not model_registry.is_trained():
        model_registry.load_artifacts()

    student_data = {
        "school": "GP", "sex": "F", "age": 17, "address": "U", "famsize": "GT3", "Pstatus": "T",
        "Medu": 4, "Fedu": 3, "Mjob": "services", "Fjob": "other", "reason": "course", "guardian": "mother",
        "traveltime": 1, "studytime": 3, "failures": 0, "schoolsup": "no", "famsup": "yes", "paid": "no",
        "activities": "yes", "nursery": "yes", "higher": "yes", "internet": "yes", "romantic": "no",
        "famrel": 4, "freetime": 3, "goout": 2, "Dalc": 1, "Walc": 1, "health": 5, "absences": 2,
        "G1": 14.0, "G2": 15.0
    }

    input_df = pd.DataFrame([student_data])
    explainer = model_registry.explainer
    assert explainer is not None

    explanation = explainer.explain_instance(input_df, 15.2)
    assert "top_features" in explanation
    assert "top_positive_factors" in explanation
    assert "human_readable_insights" in explanation
    assert len(explanation["human_readable_insights"]) > 0

    recs = generate_recommendations(student_data, 15.2, 0.95, "Low")
    assert len(recs) >= 3
    for r in recs:
        assert "title" in r
        assert "priority" in r
        assert "action_steps" in r
