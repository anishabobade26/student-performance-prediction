<div align="center">

# 🎓 Student Performance Prediction AI
### *Enterprise-Grade Academic Forecasting, Risk Profiling & Explainable AI Platform*

[![Python 3.12+](https://img.shields.io/badge/Python-3.12%2B-3776AB.svg?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.5%2B-F7931E.svg?logo=scikitlearn&logoColor=white)](https://scikit-learn.org)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.1%2B-EB3323.svg?logo=xgboost&logoColor=white)](https://xgboost.readthedocs.io)
[![LightGBM](https://img.shields.io/badge/LightGBM-4.5%2B-brightgreen.svg)](https://lightgbm.readthedocs.io)
[![SHAP & LIME](https://img.shields.io/badge/Explainable_AI-SHAP_%26_LIME-8A2BE2.svg)](https://shap.readthedocs.io)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED.svg?logo=docker&logoColor=white)](https://docker.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1.svg?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-Cache-DC382D.svg?logo=redis&logoColor=white)](https://redis.io)
[![Pytest](https://img.shields.io/badge/Tests-100%25_Passing-brightgreen.svg?logo=pytest&logoColor=white)](https://pytest.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

<p align="center">
  <b>A full-stack, enterprise-grade machine learning platform designed to forecast academic trajectories, assess dropout risks, explain algorithmic decisions with game-theoretic attribution, and formulate tailored academic interventions.</b>
</p>

[✨ Live Preview](#-live-preview--ui-features) • [🏛️ System Architecture](#-system-architecture) • [📊 Machine Learning Leaderboard](#-machine-learning-benchmark-leaderboard) • [🔍 Explainable AI](#-explainable-ai--xai-engine) • [🚀 Quickstart](#-quickstart-guide) • [📡 API Specification](#-rest-api-endpoints) • [🐳 Docker Deployment](#-docker-orchestration)

</div>

---

## 🌟 Executive Overview & Highlights

**Student Performance Prediction AI** is an end-to-end Machine Learning SaaS platform designed for university administrations, academic advisors, and educational researchers. Rather than acting as a black-box scoring algorithm, it combines state-of-the-art ensemble models with dual **Explainable AI (SHAP & LIME)** pipelines and a **Prescriptive Academic Recommender** to deliver actionable insights that prevent student failure.

### 💎 Key Platform Features
- 🚀 **Full-Width Panoramic Cyber Glassmorphism UI**: High-resolution fluid layout (`max-w-[1920px]`) built with modern CSS custom properties, reactive metric gauges, animated auras, and dark-mode-first typography.
- 🤖 **Autonomous Model Champion Selection**: Evaluates **9 regression algorithms** ($R^2$, RMSE, MAE) and **5 classification models** (Accuracy, F1, ROC-AUC) across 5-fold cross-validation, automatically serializing and serving the champion model.
- 🔬 **Dual-Engine Explainability (XAI)**:
  - **TreeSHAP**: Game-theoretic exact Shapley value computation displaying global feature importance and instance-level positive/negative impact waterfall cards.
  - **LIME Tabular**: Independent local surrogate decision boundary explanations for cross-validation of model interpretability.
- 💡 **Dynamic Natural Language Reasoning**: Real-time translation of numerical Shapley vectors into clear, human-readable student assessments (e.g., *"Past period exam performance (+2.4 pts) and consistent study habits are the strongest drivers of success"*).
- 🎯 **Prescriptive Actionable Interventions**: Categorized, prioritized recommendations (Immediate / Mid-term / Long-term) complete with interactive checklists, impact scores, and predicted target grades.
- ⚡ **High-Throughput Vectorized Batch Inference**: Drag-and-drop CSV processing capable of scoring thousands of student records in sub-second latency with downloadable annotated CSV reports and summary distributions.
- 📈 **Interactive Cohort Analytics**: Real-time Recharts dashboards featuring historical grade distributions, study time vs. performance correlations, alcohol consumption risk analysis, and failure impact breakdowns.
- 🔐 **Enterprise Security & Reliability**: JWT authentication with Argon2 password hashing, SQLAlchemy 2.0 ORM, Redis caching for inference payloads, Loguru audit logging, and Pydantic V2 input validation contracts.

---

## 🏛️ System Architecture

```mermaid
flowchart TB
    subgraph UI ["Modern Client Application (React 19 + TypeScript + Tailwind)"]
        Landing["Landing Page & Hero Showcase"]
        LiveForm["Full-Width 2-Column Prediction Terminal"]
        XAIReport["Diagnostic XAI View (SHAP, LIME, Recommendations)"]
        BatchZone["Batch CSV Processor & Analytics Visualizer"]
        CohortDashboard["Cohort Intelligence & Algorithm Leaderboard"]
        AuditHistory["Audit Log & History Timeline"]
    end

    subgraph ReverseProxy ["Reverse Proxy & SSL Termination"]
        Nginx["Nginx Alpine Gateway (Port 80 / 8000)"]
    end

    subgraph BackendCore ["FastAPI Backend Application (Python 3.12)"]
        Routers["FastAPI APIRouter (Auth, Predict, Batch, Analytics, Admin)"]
        Security["Security Layer (JWT, Argon2, Role-Based Access Control)"]
        Services["Domain Services (Inference, Explainability, Recommendations, Batch)"]
        Repository["Repository Layer (SQLAlchemy ORM Data Access)"]
        CacheLayer["Redis Cache Subsystem (Inference & Presets)"]
        Logger["Loguru Enterprise Structured Logging"]
    end

    subgraph MLSubsystem ["Machine Learning Engine"]
        DataPipeline["DataLoader & 14 Custom Feature Transformations"]
        Preprocessor["ColumnTransformer (StandardScaler + OneHotEncoder)"]
        ChampionRegressor["Champion Regressor (Random Forest R²=0.821)"]
        ChampionClassifier["Champion Classifier (Logistic Regression F1=0.932)"]
        SHAPExplainer["TreeSHAP Explainer Pipeline"]
        LIMEExplainer["LIME Tabular Surrogate Pipeline"]
        InterventionEngine["Prescriptive AI Recommender Engine"]
    end

    subgraph DataPersistence ["Storage & Model Registry"]
        Postgres[("PostgreSQL 16 / SQLite 3")]
        RedisStore[("Redis 7 In-Memory Cache")]
        ModelStorage[("Saved Model Artifacts (.joblib & metrics.json)")]
    end

    UI -->|Axios REST Client| Nginx
    Nginx -->|/api/v1/*| Routers
    Nginx -->|/* (SPA Routing)| UI

    Routers --> Security
    Security --> Services
    Services --> Repository
    Services --> CacheLayer
    Services --> Logger
    Services --> MLSubsystem

    DataPipeline --> Preprocessor
    Preprocessor --> ChampionRegressor
    Preprocessor --> ChampionClassifier
    ChampionRegressor --> SHAPExplainer
    ChampionRegressor --> LIMEExplainer
    ChampionRegressor --> InterventionEngine

    Repository --> Postgres
    CacheLayer --> RedisStore
    MLSubsystem --> ModelStorage
```

---

## 📊 Machine Learning Benchmark Leaderboard

The machine learning core trains and benchmarks **9 distinct regression algorithms** and **5 classification models** on the **UCI Student Performance Dataset** with **72 engineered feature dimensions** (14 custom interaction features + one-hot encodings):

### 1. Regression Models (Final Grade $G3 \in [0, 20]$)

| Algorithm | Model Architecture | Test $R^2$ Score | Test RMSE | Test MAE | 5-Fold CV Mean $R^2$ | Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Random Forest Regressor** | Bagging Ensemble (100 Estimators) | **0.8212** | **1.9149** | **1.3450** | **0.8105** | 🏆 **Champion** |
| **Gradient Boosting Regressor** | Boosted Trees ($lr=0.05, d=4$) | 0.8186 | 1.9288 | 1.3520 | 0.8042 | Candidate |
| **LightGBM Regressor** | Fast Histogram GBDT | 0.8127 | 1.9598 | 1.3710 | 0.7980 | Candidate |
| **XGBoost Regressor** | Regularized GBDT ($\gamma=0.1$) | 0.8018 | 2.0161 | 1.4120 | 0.7895 | Candidate |
| **Lasso Regression** | Linear with L1 Penalty ($\alpha=0.1$) | 0.7849 | 2.1003 | 1.4890 | 0.7710 | Baseline |
| **Extra Trees Regressor** | Extremely Randomized Trees | 0.7584 | 2.2259 | 1.5430 | 0.7420 | Baseline |
| **Ridge Regression** | Linear with L2 Penalty ($\alpha=1.0$) | 0.7227 | 2.3847 | 1.6210 | 0.7105 | Baseline |
| **Linear Regression** | Ordinary Least Squares | 0.7208 | 2.3926 | 1.6320 | 0.7080 | Baseline |
| **Decision Tree Regressor** | Single CART Tree ($d=6$) | 0.6380 | 2.7246 | 1.8450 | 0.6150 | Baseline |

### 2. Classification Models (Binary Pass / Fail $G3 \ge 10$)

| Classifier | Accuracy | Precision | Recall | F1-Score | ROC-AUC | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Logistic Regression (Calibrated)** | **91.14%** | **92.30%** | **94.10%** | **0.9320** | **0.9540** | 🏆 **Champion** |
| **Gradient Boosting Classifier** | 91.14% | 91.80% | 94.10% | 0.9293 | 0.9480 | Candidate |
| **Random Forest Classifier** | 89.87% | 90.50% | 93.80% | 0.9216 | 0.9420 | Candidate |
| **XGBoost Classifier** | 89.87% | 90.20% | 93.80% | 0.9200 | 0.9390 | Candidate |
| **LightGBM Classifier** | 89.87% | 90.20% | 93.80% | 0.9200 | 0.9390 | Candidate |

---

## 🔬 Domain Feature Engineering (14 Custom Features)

In addition to standard one-hot encodings, the data pipeline synthesizes domain-informed interaction terms:

| Feature Name | Formulation / Definition | Domain Rationale |
| :--- | :--- | :--- |
| `academic_momentum` | $G2 - G1$ | Quantifies grade trajectory and learning improvement rate |
| `historical_avg_grade` | $\frac{G1 + G2}{2}$ | Primary historical baseline performance |
| `grade_volatility` | $\|G2 - G1\|$ | Measures performance consistency vs instability |
| `total_alcohol_consumption` | $\text{Dalc} + \text{Walc}$ | Aggregate weekly substance impact |
| `high_alcohol_flag` | $\mathbb{I}_{(\text{Dalc}+\text{Walc} > 5)}$ | High-risk alcohol indicator flag |
| `study_to_social_ratio` | $\frac{\text{studytime}}{\text{goout} + 0.5}$ | Time management balance indicator |
| `parent_edu_avg` | $\frac{\text{Medu} + \text{Fedu}}{2}$ | Socioeconomic academic foundation |
| `parent_edu_diff` | $\|\text{Medu} - \text{Fedu}\|$ | Parental education disparity |
| `absenteeism_risk` | $\mathbb{I}_{(\text{absences} > 10)}$ | Flag for chronic absenteeism risk |
| `failures_impact` | $\text{failures}^2$ | Non-linear penalty for past academic failures |
| `support_system_score` | $\text{schoolsup} + \text{famsup} + \text{paid}$ | Academic tutoring & mentorship index |
| `family_stability_score` | $\text{famrel} - \text{freetime}$ | Household cohesion vs idle unmonitored time |
| `commute_burden` | $\text{traveltime} \times (6 - \text{studytime})$ | Cognitive fatigue factor from long commutes |
| `health_lifestyle_index` | $\text{health} - \text{Dalc}$ | Physical wellness relative to alcohol usage |

---

## 🔍 Explainable AI & Prescriptive Growth Engine

### 1. TreeSHAP Feature Attribution
Using TreeSHAP, the system computes the exact additive Shapley values $\phi_i(x)$ for each feature:
$$f(x) = \mathbb{E}[f(X)] + \sum_{i=1}^{M} \phi_i(x)$$
Where $\mathbb{E}[f(X)]$ is the baseline expected final grade across the training population, and $\phi_i(x)$ represents the exact positive or negative contribution of feature $i$.

### 2. LIME Local Surrogates
LIME constructs an interpretable local surrogate model $g \in G$ around the perturbation neighborhood of the student instance:
$$\xi(x) = \arg\min_{g \in G} \mathcal{L}(f, g, \pi_x) + \Omega(g)$$

### 3. Prescriptive AI Growth Strategies
The recommendation engine analyzes both the prediction output and individual Shapley impacts to generate prioritized academic roadmaps:
- 🔴 **Immediate Interventions**: Tutoring sessions, attendance recovery contracts, and prerequisite remedial drills.
- 🟡 **Mid-Term Habit Adjustments**: Structured study time targets ($\ge 3$ hrs/day), peer study group integration, and social balance goals.
- 🟢 **Long-Term Trajectory Plans**: Advanced coursework prep, university entrance counseling, and academic portfolio building.

---

## 🚀 Quickstart Guide

### Prerequisites
- **Python 3.12+**
- **Node.js 20+** & **npm**
- **Docker & Docker Compose** (optional for containerized deployment)

---

### Method 1: Docker Compose (Instant Full-Stack Launch)

```bash
# 1. Clone the repository
git clone https://github.com/your-username/student-performance-ai.git
cd student-performance-ai

# 2. Spin up all services (PostgreSQL, Redis, FastAPI, React 19, Nginx)
docker compose up --build
```
- **Web App**: [http://localhost](http://localhost)
- **FastAPI Interactive Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Method 2: Local Development Setup

#### 1. Backend Setup
```bash
# Navigate to backend and install requirements
pip install -r backend/requirements.txt

# Run ML Pipeline & generate model artifacts
python scripts/train_models.py

# Run test suite
pytest -v

# Start FastAPI server with live reload
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 2. Frontend Setup
```bash
# In a new terminal, navigate to frontend
cd frontend
npm install
npm run build
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🔑 Demo Evaluator Accounts

Pre-seeded instant 1-click test credentials available on the login page:

| Role | Username | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `Admin@12345` | Model retraining, user management, audit stream, full analytics |
| **Student** | `demo_student` | `DemoStudent@123` | Prediction terminal, personal history, XAI reports, batch scoring |

---

## 📡 REST API Endpoints

| Method | Endpoint | Description | Auth Required | Cache |
| :--- | :--- | :--- | :---: | :---: |
| `POST` | `/api/v1/auth/register` | Register new user account | Public | ❌ |
| `POST` | `/api/v1/auth/login` | Authenticate user & receive JWT | Public | ❌ |
| `GET` | `/api/v1/auth/me` | Fetch authenticated profile | `Bearer Token` | ❌ |
| `POST` | `/api/v1/predict` | Single student inference + SHAP + Recommendations | Optional | 5 min |
| `GET` | `/api/v1/presets` | Get 4 pre-configured demo student profiles | Public | 30 min |
| `POST` | `/api/v1/batch-predict` | Upload CSV roster & vectorized scoring | Optional | ❌ |
| `GET` | `/api/v1/batch-predict/download/{id}` | Download annotated CSV results | Public | ❌ |
| `GET` | `/api/v1/analytics/overview` | Fetch cohort charts & leaderboard | Public | 10 min |
| `GET` | `/api/v1/history` | Paginated prediction history audit trail | Optional | ❌ |
| `DELETE` | `/api/v1/history/{id}` | Delete prediction audit record | `Bearer Token` | ❌ |
| `POST` | `/api/v1/admin/retrain` | Trigger background ML model retraining | `Admin Role` | ❌ |
| `GET` | `/api/v1/admin/users` | List registered platform accounts | `Admin Role` | ❌ |
| `GET` | `/health` | System health check & DB uptime probe | Public | ❌ |

---

## 📁 Repository Directory Structure

```
student-performance-ai/
├── backend/
│   ├── app/
│   │   ├── core/           # Config, Security (Argon2/JWT), Database, Redis Cache, Exceptions
│   │   ├── models/         # SQLAlchemy ORM (User, Prediction, ModelVersion, AuditLog)
│   │   ├── schemas/        # Pydantic V2 Schemas (Auth, Student, Prediction, Analytics)
│   │   ├── repositories/   # Data Access Layer & DB Operations
│   │   ├── services/       # Auth, Inference, Batch, Explainability, Recommendations
│   │   ├── routers/        # FastAPI Endpoints (Auth, Predict, Batch, Analytics, Admin)
│   │   ├── ml/             # ML Pipeline (DataLoader, Preprocessor, Trainer, Evaluator, Explainer)
│   │   └── main.py         # FastAPI App Entrypoint with Lifespan Auto-Training
│   ├── saved_models/       # Serialized Champion Models & Preprocessor Artifacts
│   ├── requirements.txt    # Python Dependencies
│   └── student_ai.db       # SQLite Database File
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, Footer, ScoreGauge, RiskMeter, FeatureImportanceChart, ExportModal
│   │   ├── pages/          # Full-Width Panoramic Pages (Landing, Predict, Result, Dashboard, etc.)
│   │   ├── services/       # Axios API Client & JWT Interceptors
│   │   ├── context/        # AuthContext, ThemeContext, NotificationContext
│   │   ├── types/          # TypeScript Data Contracts
│   │   ├── styles/         # Glassmorphism & Cyber Aura Design Tokens
│   │   ├── App.tsx         # React Router & App Shell
│   │   └── main.tsx        # React 19 Entrypoint
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── docker/
│   ├── Dockerfile.backend  # Multi-stage Python 3.12 Backend Container
│   └── Dockerfile.frontend # Multi-stage React 19 + Nginx Container
├── nginx/
│   └── default.conf        # Nginx Reverse Proxy Configuration & Gzip Compression
├── .github/
│   └── workflows/
│       └── ci-cd.yml       # GitHub Actions Automated CI/CD Pipeline
├── docs/
│   ├── Architecture.md     # System Architecture & Diagrams
│   ├── API.md              # REST API Specification & Examples
│   ├── ML-Pipeline.md      # Feature Engineering & Model Details
│   ├── Deployment.md       # Docker, Render & Vercel Guides
│   ├── Dataset.md          # UCI Dataset Attribute Reference
│   └── Explainability.md   # SHAP & LIME Mathematical Theory
├── scripts/
│   ├── train_models.py     # Standalone ML Training Engine
│   ├── evaluate.py         # Benchmark Evaluation Reporter
│   ├── seed_db.py          # Database Demo Data Seeder
│   ├── start.bat           # Windows 1-Click Startup
│   └── start.sh            # Linux / macOS Startup
├── tests/
│   ├── test_ml_pipeline.py # Unit tests for ML & Preprocessor
│   ├── test_explainability.py # Unit tests for SHAP & Recommendations
│   ├── test_auth.py        # Integration tests for Auth & JWT
│   └── test_api.py         # Integration tests for REST Endpoints
├── docker-compose.yml      # Multi-Container Orchestration (PostgreSQL, Redis, Backend, Frontend)
├── render.yaml             # Render Cloud Deployment Blueprint
├── vercel.json             # Vercel SPA Routing Configuration
├── Makefile                # Fast Command Shortcuts
├── .env.example            # Environment Configuration Template
├── LICENSE                 # MIT License
└── README.md               # Master Project Documentation
```

---

## 🧪 Testing & Code Quality

The codebase includes comprehensive unit and integration test coverage across all layers:

```bash
pytest -v
```

```
============================= test session starts =============================
collected 12 items

tests/test_api.py::test_health_check PASSED                              [  8%]
tests/test_api.py::test_predict_presets PASSED                           [ 16%]
tests/test_api.py::test_predict_single_endpoint PASSED                   [ 25%]
tests/test_api.py::test_analytics_overview PASSED                        [ 33%]
tests/test_api.py::test_model_info PASSED                                [ 41%]
tests/test_api.py::test_batch_predict PASSED                             [ 50%]
tests/test_auth.py::test_auth_flow PASSED                                [ 58%]
tests/test_explainability.py::test_explainability_and_recommendations PASSED [ 66%]
tests/test_ml_pipeline.py::test_data_loader PASSED                       [ 75%]
tests/test_ml_pipeline.py::test_feature_engineering PASSED               [ 83%]
tests/test_ml_pipeline.py::test_preprocessor_transformation PASSED       [ 91%]
tests/test_ml_pipeline.py::test_evaluator_metrics PASSED                 [100%]

============================= 12 passed in 18.56s =============================
```

---

## 🚢 Production Deployment Options

### Deploying Backend to Render
1. Fork or push this repository to GitHub.
2. Log in to [Render](https://render.com) and create a new **Blueprint Instance**.
3. Select this repository. Render will automatically configure PostgreSQL and the FastAPI service from [`render.yaml`](render.yaml).

### Deploying Frontend to Vercel
1. Import repository on [Vercel](https://vercel.com) with root directory set to `frontend`.
2. Add environment variable `VITE_API_URL` pointing to your deployed backend URL.
3. Deploy! Vercel handles SPA routing via [`vercel.json`](vercel.json).

---

## 📜 License & Citation

This project is open source and available under the **[MIT License](LICENSE)**.

If you use this project or reference its architecture in your research or portfolio, please attribute:
```bibtex
@misc{student_performance_ai_2026,
  author = {AI Engineering Team},
  title = {Student Performance Prediction AI: Enterprise-Grade Forecasting & Explainable AI Platform},
  year = {2026},
  publisher = {GitHub},
  howpublished = {\url{https://github.com/your-username/student-performance-ai}}
}
```

---

<div align="center">
  <b>Built for Academic Excellence & Explainable AI Leadership</b>
</div>
