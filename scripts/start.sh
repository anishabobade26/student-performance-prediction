#!/usr/bin/env bash
set -e

echo "==================================================="
echo "  Starting Student Performance Prediction AI SaaS"
echo "==================================================="

echo "[1/3] Verifying ML model artifacts..."
python scripts/train_models.py

echo "[2/3] Starting FastAPI Backend on http://localhost:8000 ..."
(cd backend && uvicorn app.main:app --reload --port 8000) &

echo "[3/3] Starting React Frontend on http://localhost:5173 ..."
(cd frontend && npm run dev) &

wait
