import pytest
from pathlib import Path
import sys
from fastapi.testclient import TestClient

backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from app.main import app
from app.core.database import init_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_test_db():
    init_db()


def test_auth_flow():
    import uuid
    rand_suffix = uuid.uuid4().hex[:6]
    test_user = {
        "username": f"testuser_{rand_suffix}",
        "email": f"test_{rand_suffix}@example.com",
        "full_name": "Test User",
        "password": "Password@123"
    }

    # 1. Register
    reg_res = client.post("/api/v1/auth/register", json=test_user)
    assert reg_res.status_code == 201
    reg_data = reg_res.json()
    assert "access_token" in reg_data
    assert "user" in reg_data
    assert reg_data["user"]["username"] == test_user["username"]

    # 2. Login
    login_res = client.post(
        "/api/v1/auth/login",
        json={"username": test_user["username"], "password": test_user["password"]}
    )
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]

    # 3. Get /me
    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == test_user["email"]
