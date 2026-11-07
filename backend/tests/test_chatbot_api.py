
from fastapi.testclient import TestClient

from app.main import app
from app.core.auth import get_current_user
from app.api.v1.routes import chatbot as chatbot_route


def test_chatbot_endpoint_success(monkeypatch):
    async def mock_get_chatbot_reply(current_user, message):
        assert current_user["user_id"] == "test-user-001"
        assert message == "Suggest a casual outfit"

        return {
            "reply": "Try your blue shirt with black jeans.",
            "used_item_ids": ["item_001", "item_002"],
            "source": "rule_based_fallback",
        }

    monkeypatch.setattr(
        chatbot_route,
        "get_chatbot_reply",
        mock_get_chatbot_reply,
    )

    app.dependency_overrides[get_current_user] = lambda: {
        "user_id": "test-user-001",
        "access_token": "mock-token",
    }

    try:
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/chatbot/chat",
                json={"message": "Suggest a casual outfit"},
            )

        assert response.status_code == 200

        data = response.json()["data"]

        assert data["reply"] == "Try your blue shirt with black jeans."
        assert data["used_item_ids"] == ["item_001", "item_002"]
        assert data["source"] == "rule_based_fallback"
        assert response.json()["error"] is None

    finally:
        app.dependency_overrides.clear()


def test_chatbot_endpoint_rejects_empty_message():
    app.dependency_overrides[get_current_user] = lambda: {
        "user_id": "test-user-001",
        "access_token": "mock-token",
    }

    try:
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/chatbot/chat",
                json={"message": ""},
            )

        assert response.status_code == 422

    finally:
        app.dependency_overrides.clear()

def test_chatbot_requires_authentication():
    with TestClient(app) as client:
        response = client.post(
            "/api/v1/chatbot/chat",
            json={"message": "Suggest a casual outfit"},
        )

    assert response.status_code == 401