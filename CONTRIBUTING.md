# Contributing to Student Performance Prediction AI

Thank you for your interest in contributing! This project adheres to enterprise development and testing standards.

---

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/student-performance-ai.git
   cd student-performance-ai
   ```

2. Set up Python backend:
   ```bash
   pip install -r backend/requirements.txt
   python scripts/train_models.py
   pytest -v
   ```

3. Set up React frontend:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

---

## Coding Standards

- **Python**: Follow PEP 8 guidelines. Formatted with `black` and linted with `ruff`.
- **TypeScript**: Strict type checking with 0 compilation errors.
- **Git Commits**: Conventional Commits standard (`feat:`, `fix:`, `docs:`, `perf:`, `refactor:`, `test:`).
