# Changelog

All notable changes to the **Student Performance Prediction AI** platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-09-09

### Added
- Multi-Model ML Pipeline benchmarking 9+ algorithms (Random Forest, XGBoost, LightGBM, Extra Trees, Gradient Boosting, Ridge, Lasso, Linear Regression).
- Dual-mode prediction: Continuous grade estimation ($G3 \in [0, 20]$) and binary Pass/Fail classification ($G3 \ge 10$).
- Explainable AI Engine powered by SHAP (Tree/Linear explainers) and LIME (Local Interpretable Model-agnostic Explanations).
- Dynamic Natural Language Reasoning translating mathematical Shapley values into human-readable insights.
- Prescriptive, prioritized AI study and lifestyle recommendation engine.
- High-throughput Vectorized Batch CSV inference with downloadable annotated CSV reports.
- FastAPI layered backend architecture (`routers`, `services`, `repositories`, `schemas`, `models`, `core`).
- Full JWT authentication (access & refresh tokens) with role-based access control.
- Interactive React 19 Frontend built with TypeScript, Tailwind CSS, Recharts, and Framer Motion.
- Dark and Light mode theme switcher with glassmorphism design system.
- One-command Docker Compose orchestration (PostgreSQL, Redis, FastAPI, React, Nginx).
- Automated CI/CD pipeline via GitHub Actions.
- Comprehensive documentation suite and unit test suite with 100% test pass rate.
