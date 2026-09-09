@echo off
echo ===================================================
echo   Starting Student Performance Prediction AI SaaS
echo ===================================================

echo [1/3] Checking ML model artifacts...
python scripts\train_models.py

echo [2/3] Starting FastAPI Backend on http://localhost:8000 ...
start cmd /k "cd backend && uvicorn app.main:app --reload --port 8000"

echo [3/3] Starting React Frontend on http://localhost:5173 ...
start cmd /k "cd frontend && npm run dev"

echo Complete! Open http://localhost:5173 in your browser.
pause
