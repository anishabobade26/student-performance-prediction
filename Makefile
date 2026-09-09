.PHONY: help install train test run-backend run-frontend docker-up docker-down clean

help:
	@echo "Student Performance Prediction AI - Command Menu"
	@echo "================================================"
	@echo "make install      : Install Python & Node dependencies"
	@echo "make train        : Execute ML training pipeline across all algorithms"
	@echo "make test         : Run Pytest test suite"
	@echo "make run-backend  : Start FastAPI backend with Uvicorn (port 8000)"
	@echo "make run-frontend : Start React Vite dev server (port 5173)"
	@echo "make docker-up    : Launch complete stack via Docker Compose"
	@echo "make docker-down  : Stop Docker Compose services"
	@echo "make clean        : Remove cached files and pycache"

install:
	pip install -r backend/requirements.txt
	cd frontend && npm install

train:
	python scripts/train_models.py

test:
	pytest -v

run-backend:
	cd backend && uvicorn app.main:app --reload --port 8000

run-frontend:
	cd frontend && npm run dev

docker-up:
	docker compose up --build

docker-down:
	docker compose down

clean:
	rm -rf __pycache__ .pytest_cache frontend/dist backend/__pycache__
