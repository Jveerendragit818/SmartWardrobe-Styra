from uuid import UUID
from fastapi.testclient import TestClient

from app.main import app
from app.core.auth import get_current_user
from app.api.v1.routes import saved_outfits as saved_outfits_route


TEST_USER = {
    "user_id": "test-user-001",
    "access_token": "mock-token",
}

ITEM_ID_1 = "11111111-1111-4111-8111-111111111111"
ITEM_ID_2 = "22222222-2222-4222-8222-222222222222"
OUTFIT_ID = "33333333-3333-4333-8333-333333333333"


def test_save_outfit_for_authenticated_user(monkeypatch):
    async def mock_create_saved_outfit(**kwargs):
        assert kwargs["current_user"] == TEST_USER
        assert kwargs["title"] == "College Outfit"
        assert kwargs["item_ids"] == [UUID(ITEM_ID_1), UUID(ITEM_ID_2)]
        return {
            "id": OUTFIT_ID,
            "user_id": TEST_USER["user_id"],
            "title": "College Outfit",
        }

    monkeypatch.setattr(
        saved_outfits_route,
        "create_saved_outfit",
        mock_create_saved_outfit,
    )

    app.dependency_overrides[get_current_user] = lambda: TEST_USER

    try:
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/saved-outfits",
                json={
                    "title": "College Outfit",
                    "item_ids": [ITEM_ID_1, ITEM_ID_2],
                },
            )

        assert response.status_code == 201
        assert response.json()["data"]["id"] == OUTFIT_ID
        assert response.json()["error"] is None

    finally:
        app.dependency_overrides.clear()


def test_get_saved_outfits(monkeypatch):
    saved_data = [
        {
            "id": OUTFIT_ID,
            "user_id": TEST_USER["user_id"],
            "title": "College Outfit",
            "items": [{"id": ITEM_ID_1}],
        }
    ]

    async def mock_list_saved_outfits(current_user):
        assert current_user == TEST_USER
        return saved_data

    monkeypatch.setattr(
        saved_outfits_route,
        "list_saved_outfits",
        mock_list_saved_outfits,
    )

    app.dependency_overrides[get_current_user] = lambda: TEST_USER

    try:
        with TestClient(app) as client:
            response = client.get("/api/v1/saved-outfits")

        assert response.status_code == 200
        assert response.json()["data"] == saved_data

    finally:
        app.dependency_overrides.clear()


def test_delete_saved_outfit(monkeypatch):
    async def mock_delete_saved_outfit(current_user, outfit_id):
        assert current_user == TEST_USER
        assert outfit_id == OUTFIT_ID
        return {"deleted": True, "id": outfit_id}

    monkeypatch.setattr(
        saved_outfits_route,
        "delete_saved_outfit",
        mock_delete_saved_outfit,
    )

    app.dependency_overrides[get_current_user] = lambda: TEST_USER

    try:
        with TestClient(app) as client:
            response = client.delete(
                f"/api/v1/saved-outfits/{OUTFIT_ID}"
            )

        assert response.status_code == 200
        assert response.json()["data"]["deleted"] is True

    finally:
        app.dependency_overrides.clear()


def test_save_outfit_rejects_duplicate_item_ids():
    app.dependency_overrides[get_current_user] = lambda: TEST_USER

    try:
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/saved-outfits",
                json={
                    "title": "Duplicate Outfit",
                    "item_ids": [ITEM_ID_1, ITEM_ID_1],
                },
            )

        assert response.status_code == 422

    finally:
        app.dependency_overrides.clear()


def test_save_outfit_rejects_empty_item_list():
    app.dependency_overrides[get_current_user] = lambda: TEST_USER

    try:
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/saved-outfits",
                json={
                    "title": "Empty Outfit",
                    "item_ids": [],
                },
            )

        assert response.status_code == 422

    finally:
        app.dependency_overrides.clear()
