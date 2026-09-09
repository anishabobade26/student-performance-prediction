import pandas as pd
import numpy as np
from typing import List


def add_engineered_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Transforms raw input features by generating high-signal engineered domain features.
    Works for both single-row inference DataFrames and batch/training DataFrames.
    """
    df = df.copy()

    # 1. Academic Trajectory & Historical Performance
    if "G1" in df.columns and "G2" in df.columns:
        df["prior_grade_avg"] = (df["G1"].astype(float) + df["G2"].astype(float)) / 2.0
        df["grade_trend"] = df["G2"].astype(float) - df["G1"].astype(float)
        df["grade_consistency"] = np.where(np.abs(df["grade_trend"]) <= 1, 1, 0)
    else:
        df["prior_grade_avg"] = 0.0
        df["grade_trend"] = 0.0
        df["grade_consistency"] = 0

    # 2. Parental Education Indicators
    if "Medu" in df.columns and "Fedu" in df.columns:
        df["parent_edu_avg"] = (df["Medu"].astype(float) + df["Fedu"].astype(float)) / 2.0
        df["parent_edu_max"] = np.maximum(df["Medu"].astype(float), df["Fedu"].astype(float))
        df["parent_edu_diff"] = np.abs(df["Medu"].astype(float) - df["Fedu"].astype(float))
    else:
        df["parent_edu_avg"] = 0.0
        df["parent_edu_max"] = 0.0
        df["parent_edu_diff"] = 0.0

    # 3. Lifestyle & Alcohol Consumption
    if "Dalc" in df.columns and "Walc" in df.columns:
        df["alcohol_index"] = df["Dalc"].astype(float) + df["Walc"].astype(float)
        df["high_alcohol_flag"] = (df["alcohol_index"] >= 5).astype(int)
    else:
        df["alcohol_index"] = 0.0
        df["high_alcohol_flag"] = 0

    # 4. Support System Composite Score
    support_cols = ["schoolsup", "famsup", "paid"]
    for col in support_cols:
        if col not in df.columns:
            df[col] = "no"

    df["support_score"] = (
        (df["schoolsup"].str.lower() == "yes").astype(int) +
        (df["famsup"].str.lower() == "yes").astype(int) +
        (df["paid"].str.lower() == "yes").astype(int)
    )

    # 5. Study & Travel Time Ratios
    if "studytime" in df.columns and "traveltime" in df.columns:
        df["study_to_travel_ratio"] = df["studytime"].astype(float) / (df["traveltime"].astype(float) + 0.1)
    else:
        df["study_to_travel_ratio"] = 1.0

    # 6. Social & Free Time Index
    if "freetime" in df.columns and "goout" in df.columns:
        df["social_index"] = df["freetime"].astype(float) + df["goout"].astype(float)
    else:
        df["social_index"] = 0.0

    # 7. Absences and Failure Risk Flags
    if "absences" in df.columns:
        df["high_absence_risk"] = (df["absences"].astype(float) > 10).astype(int)
    else:
        df["high_absence_risk"] = 0

    if "failures" in df.columns:
        df["has_prior_failures"] = (df["failures"].astype(float) > 0).astype(int)
    else:
        df["has_prior_failures"] = 0

    # 8. Motivation Index (higher education aspirations + internet access)
    higher_yes = (df["higher"].astype(str).str.lower() == "yes").astype(int) if "higher" in df.columns else 1
    internet_yes = (df["internet"].astype(str).str.lower() == "yes").astype(int) if "internet" in df.columns else 1
    df["motivation_index"] = higher_yes * 2 + internet_yes

    return df


def get_engineered_feature_names() -> List[str]:
    """Returns list of engineered feature names."""
    return [
        "prior_grade_avg",
        "grade_trend",
        "grade_consistency",
        "parent_edu_avg",
        "parent_edu_max",
        "parent_edu_diff",
        "alcohol_index",
        "high_alcohol_flag",
        "support_score",
        "study_to_travel_ratio",
        "social_index",
        "high_absence_risk",
        "has_prior_failures",
        "motivation_index"
    ]
