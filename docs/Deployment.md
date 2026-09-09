# Deployment & Production Infrastructure

The Student Performance Prediction AI platform is configured for zero-friction containerized deployment and modern cloud platforms.

---

## 1. Docker Compose (Single Command Launch)

Launch the full stack including PostgreSQL, Redis, FastAPI backend, React frontend, and Nginx reverse proxy:

```bash
docker compose up --build
```

### Services Orchestrated:
- **`db`**: PostgreSQL 16 on port 5432 with persistent volume storage (`postgres_data`).
- **`redis`**: Redis 7 on port 6379 with in-memory caching.
- **`backend`**: FastAPI application on port 8000.
- **`frontend`**: Production React build served via Nginx on port 80.

---

## 2. Deploying on Render (Backend + PostgreSQL)

1. Push your repository to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com), click **New** -> **Blueprint**.
3. Select this repository. Render will parse [`render.yaml`](../render.yaml) and automatically provision:
   - Managed PostgreSQL database `student-ai-postgres`.
   - Web Service `student-performance-ai-backend`.
4. Your API will be live at `https://<your-service>.onrender.com`.

---

## 3. Deploying on Vercel (Frontend SPA)

1. Import the repository into [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Vite`.
4. Add Environment Variable:
   - `VITE_API_URL`: `https://<your-render-backend-url>/api/v1`
5. Click **Deploy**. Vercel will apply [`vercel.json`](../vercel.json) rewrites for SPA routing.

---

## 4. Local Development

### Backend:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173`.
