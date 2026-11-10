
import pytest
from fastapi import HTTPException

from app.services import saved_outfit_service as service


TEST_USER = {
    "user_id": "test-user-001",
    "access_token": "mock-token",
}

ITEM_ID_1 = "11111111-1111-4111-8111-111111111111"
ITEM_ID_2 = "22222222-2222-4222-8222-222222222222"
OUTFIT_ID = "33333333-3333-4333-8333-333333333333"


@pytest.mark.anyio
async def test_create_saved_outfit_success(monkeypatch):
    calls = []

    async def mock_supabase_request(method, endpoint, current_user, **kwargs):
        calls.append((method, endpoint, kwargs))

        if endpoint == "clothing_items":
            return [{"id": ITEM_ID_1}, {"id": ITEM_ID_2}]

        if endpoint == "saved_outfits":
            return [{
                "id": OUTFIT_ID,
                "user_id": TEST_USER["user_id"],
                "title": "College Outfit",
            }]

        if endpoint == "saved_outfit_items":
            return None

    monkeypatch.setattr(service, "supabase_request", mock_supabase_request)

    result = await service.create_saved_outfit(
        TEST_USER, "College Outfit", [ITEM_ID_1, ITEM_ID_2]
    )

    assert result["id"] == OUTFIT_ID
    assert len(calls) == 3
    assert calls[0][1] == "clothing_items"
    assert calls[1][1] == "saved_outfits"
    assert calls[2][1] == "saved_outfit_items"


@pytest.mark.anyio
async def test_create_saved_outfit_rejects_foreign_item(monkeypatch):
    async def mock_supabase_request(method, endpoint, current_user, **kwargs):
        return [{"id": ITEM_ID_1}]

    monkeypatch.setattr(service, "supabase_request", mock_supabase_request)

    with pytest.raises(HTTPException) as exc:
        await service.create_saved_outfit(
            TEST_USER, "Invalid Outfit", [ITEM_ID_1, ITEM_ID_2]
        )

    assert exc.value.status_code == 403


@pytest.mark.anyio
async def test_list_saved_outfits_returns_items(monkeypatch):
    outfit = {
        "id": OUTFIT_ID,
        "user_id": TEST_USER["user_id"],
        "title": "College Outfit",
    }

    item = {"id": ITEM_ID_1, "name": "Blue Shirt"}

    async def mock_supabase_request(method, endpoint, current_user, **kwargs):
        if endpoint == "saved_outfits":
            return [outfit]
        if endpoint == "saved_outfit_items":
            return [{
                "saved_outfit_id": OUTFIT_ID,
                "clothing_item_id": ITEM_ID_1,
            }]
        if endpoint == "clothing_items":
            return [item]

    monkeypatch.setattr(service, "supabase_request", mock_supabase_request)

    result = await service.list_saved_outfits(TEST_USER)

    assert len(result) == 1
    assert result[0]["items"] == [item]


@pytest.mark.anyio
async def test_list_saved_outfits_handles_deleted_items(monkeypatch):
    async def mock_supabase_request(method, endpoint, current_user, **kwargs):
        if endpoint == "saved_outfits":
            return [{"id": OUTFIT_ID, "title": "Old Outfit"}]
        if endpoint == "saved_outfit_items":
            return [{
                "saved_outfit_id": OUTFIT_ID,
                "clothing_item_id": ITEM_ID_1,
            }]
        if endpoint == "clothing_items":
            return []

    monkeypatch.setattr(service, "supabase_request", mock_supabase_request)

    result = await service.list_saved_outfits(TEST_USER)

    assert len(result) == 1
    assert result[0]["items"] == []


@pytest.mark.anyio
async def test_list_saved_outfits_returns_empty_list(monkeypatch):
    async def mock_supabase_request(method, endpoint, current_user, **kwargs):
        return []

    monkeypatch.setattr(service, "supabase_request", mock_supabase_request)

    result = await service.list_saved_outfits(TEST_USER)

    assert result == []


@pytest.mark.anyio
async def test_delete_saved_outfit_success(monkeypatch):
    async def mock_supabase_request(method, endpoint, current_user, **kwargs):
        assert method == "DELETE"
        assert endpoint == "saved_outfits"
        assert kwargs["params"]["user_id"] == f"eq.{TEST_USER['user_id']}"
        return [{"id": OUTFIT_ID}]

    monkeypatch.setattr(service, "supabase_request", mock_supabase_request)

    result = await service.delete_saved_outfit(TEST_USER, OUTFIT_ID)

    assert result == {"deleted": True, "id": OUTFIT_ID}


@pytest.mark.anyio
async def test_delete_saved_outfit_not_found(monkeypatch):
    async def mock_supabase_request(method, endpoint, current_user, **kwargs):
        return []

    monkeypatch.setattr(service, "supabase_request", mock_supabase_request)

    with pytest.raises(HTTPException) as exc:
        await service.delete_saved_outfit(TEST_USER, OUTFIT_ID)

    assert exc.value.status_code == 404
