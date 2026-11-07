
from fastapi.testclient import TestClient

from app.main import app
from app.core.auth import get_current_user
from app.api.v1.routes import preferences as preferences_route


TEST_USER = {
    "user_id": "test-user-001",
    "access_token": "mock-token",
}


def test_get_preferences_returns_defaults(monkeypatch):
    async def mock_supabase_request(*args, **kwargs):
        assert args[0] == "GET"
        assert args[1] == "user_preferences"
        assert kwargs["params"]["user_id"] == "eq.test-user-001"
        return []

    monkeypatch.setattr(
        preferences_route,
        "supabase_request",
        mock_supabase_request,
    )

    app.dependency_overrides[get_current_user] = lambda: TEST_USER

    try:
        with TestClient(app) as client:
            response = client.get("/api/v1/preferences")

        assert response.status_code == 200

        data = response.json()["data"]
        assert data["user_id"] == "test-user-001"
        assert data["preferred_colors"] == []
        assert data["preferred_styles"] == []
        assert data["usual_occasions"] == []
        assert data["disliked_colors"] == []

    finally:
        app.dependency_overrides.clear()


def test_get_preferences_returns_saved_data(monkeypatch):
    saved_preferences = {
        "user_id": "test-user-001",
        "preferred_colors": ["blue", "black"],
        "preferred_styles": ["casual"],
        "usual_occasions": ["college"],
        "disliked_colors": ["yellow"],
    }

    async def mock_supabase_request(*args, **kwargs):
        return [saved_preferences]

    monkeypatch.setattr(
        preferences_route,
        "supabase_request",
        mock_supabase_request,
    )

    app.dependency_overrides[get_current_user] = lambda: TEST_USER

    try:
        with TestClient(app) as client:
            response = client.get("/api/v1/preferences")

        assert response.status_code == 200
        assert response.json()["data"] == saved_preferences

    finally:
        app.dependency_overrides.clear()


def test_put_preferences_saves_for_authenticated_user(monkeypatch):
    async def mock_supabase_request(*args, **kwargs):
        assert args[0] == "POST"
        assert args[1] == "user_preferences"
        assert kwargs["params"]["on_conflict"] == "user_id"

        payload = kwargs["payload"]

        assert payload["user_id"] == "test-user-001"
        assert payload["preferred_colors"] == ["blue", "black"]
        assert payload["preferred_styles"] == ["casual"]
        assert payload["usual_occasions"] == ["college"]
        assert payload["disliked_colors"] == ["yellow"]
        assert "updated_at" in payload

        return [payload]

    monkeypatch.setattr(
        preferences_route,
        "supabase_request",
        mock_supabase_request,
    )

    app.dependency_overrides[get_current_user] = lambda: TEST_USER

    try:
        with TestClient(app) as client:
            response = client.put(
                "/api/v1/preferences",
                json={
                    "preferred_colors": ["Blue", "Black"],
                    "preferred_styles": ["Casual"],
                    "usual_occasions": ["College"],
                    "disliked_colors": ["Yellow"],
                },
            )

        assert response.status_code == 200
        assert response.json()["data"]["user_id"] == "test-user-001"
        assert response.json()["error"] is None

    finally:
        app.dependency_overrides.clear()
