import os
from pathlib import Path
from typing import Optional, Tuple
import pandas as pd
from loguru import logger

# Default dataset locations to search in priority order
DEFAULT_DATASET_PATHS = [
    Path(__file__).resolve().parent.parent.parent.parent / "student+performance" / "student" / "student-mat.csv",
    Path(__file__).resolve().parent.parent.parent / "data" / "student-mat.csv",
    Path("data/student-mat.csv"),
    Path("student+performance/student/student-mat.csv"),
    Path("../student+performance/student/student-mat.csv"),
]

SECONDARY_DATASET_PATHS = [
    Path(__file__).resolve().parent.parent.parent.parent / "student+performance" / "student" / "student-por.csv",
    Path(__file__).resolve().parent.parent.parent / "data" / "student-por.csv",
    Path("data/student-por.csv"),
    Path("student+performance/student/student-por.csv"),
    Path("../student+performance/student/student-por.csv"),
]

# Expected dataset column schema
EXPECTED_CATEGORICAL_COLUMNS = [
    "school", "sex", "address", "famsize", "Pstatus", "Mjob", "Fjob", 
    "reason", "guardian", "schoolsup", "famsup", "paid", "activities", 
    "nursery", "higher", "internet", "romantic"
]

EXPECTED_NUMERICAL_COLUMNS = [
    "age", "Medu", "Fedu", "traveltime", "studytime", "failures", 
    "famrel", "freetime", "goout", "Dalc", "Walc", "health", "absences", 
    "G1", "G2"
]

TARGET_COLUMN = "G3"


def find_dataset_file(custom_path: Optional[str] = None, dataset_type: str = "mat") -> Path:
    """
    Locates the dataset file using custom path or predefined candidate locations.
    """
    if custom_path:
        p = Path(custom_path)
        if p.is_file():
            return p
        logger.warning(f"Custom dataset path {custom_path} not found. Falling back to search paths.")

    candidate_paths = DEFAULT_DATASET_PATHS if dataset_type == "mat" else SECONDARY_DATASET_PATHS
    
    for candidate in candidate_paths:
        if candidate.is_file():
            logger.info(f"Dataset found at: {candidate}")
            return candidate

    raise FileNotFoundError(
        f"Could not locate {dataset_type} dataset file. Checked: {[str(p) for p in candidate_paths]}"
    )


def load_dataset(
    file_path: Optional[str] = None,
    dataset_type: str = "mat"
) -> pd.DataFrame:
    """
    Loads and validates the UCI Student Performance dataset.
    Detects delimiter (semicolon or comma) and cleans data.
    """
    path = find_dataset_file(file_path, dataset_type)
    logger.info(f"Loading dataset from: {path}")

    # UCI dataset uses semicolon separator by default
    try:
        df = pd.read_csv(path, sep=";")
        if len(df.columns) <= 1:
            df = pd.read_csv(path, sep=",")
    except Exception as e:
        logger.error(f"Error reading dataset CSV: {e}")
        raise

    # Validate presence of target and critical features
    if TARGET_COLUMN not in df.columns:
        raise ValueError(f"Target column '{TARGET_COLUMN}' missing from dataset.")

    # Strip any stray quotes from string columns
    for col in df.select_dtypes(include=["object"]).columns:
        df[col] = df[col].astype(str).str.strip().str.replace('"', '').str.replace("'", "")

    # Clean numeric columns
    numeric_cols = [c for c in EXPECTED_NUMERICAL_COLUMNS if c in df.columns] + [TARGET_COLUMN]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    # Drop nulls if any
    initial_len = len(df)
    df = df.dropna().reset_index(drop=True)
    if len(df) < initial_len:
        logger.warning(f"Dropped {initial_len - len(df)} rows with missing values.")

    logger.info(f"Successfully loaded dataset with shape: {df.shape}")
    return df


def get_feature_and_target(
    df: pd.DataFrame
) -> Tuple[pd.DataFrame, pd.Series]:
    """
    Splits DataFrame into features X and target y.
    """
    if TARGET_COLUMN not in df.columns:
        raise ValueError(f"Target column {TARGET_COLUMN} not in dataframe")
    
    X = df.drop(columns=[TARGET_COLUMN])
    y = df[TARGET_COLUMN]
    return X, y
