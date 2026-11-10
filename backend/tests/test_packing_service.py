
import pytest
from unittest.mock import AsyncMock

from app.services import packing_service


@pytest.fixture
def anyio_backend():
    """Use asyncio for asynchronous tests."""
    return "asyncio"


@pytest.mark.anyio
async def test_get_packing_suggestions_uses_current_users_wardrobe(
    monkeypatch,
):
    user = {
        "user_id": "user-123",
        "access_token": "test-token",
    }

    wardrobe = [
        {
            "id": "item-1",
            "name": "Blue T-shirt",
            "category": "tshirt",
            "season": "all_season",
            "occasion": [],
        },
        {
            "id": "item-2",
            "name": "Jeans",
            "category": "jeans",
            "season": "all_season",
            "occasion": [],
        },
        {
            "id": "item-3",
            "name": "Sneakers",
            "category": "shoes",
            "season": "all_season",
            "occasion": [],
        },
    ]

    mock_request = AsyncMock(return_value=wardrobe)

    monkeypatch.setattr(
        packing_service,
        "supabase_request",
        mock_request,
    )

    result = await packing_service.get_packing_suggestions(
        current_user=user,
        trip_days=2,
    )

    assert result["trip_days"] == 2
    assert len(result["essential"]) > 0

    mock_request.assert_awaited_once()

    args = mock_request.await_args

    assert args.args[0] == "GET"
    assert args.args[1] == "clothing_items"
    assert args.args[2]["user_id"] == "user-123"

    assert (
        args.kwargs["params"]["user_id"]
        == "eq.user-123"
    )


@pytest.mark.anyio
async def test_handles_empty_database_wardrobe(monkeypatch):
    user = {
        "user_id": "user-123",
        "access_token": "test-token",
    }

    mock_request = AsyncMock(return_value=[])

    monkeypatch.setattr(
        packing_service,
        "supabase_request",
        mock_request,
    )

    result = await packing_service.get_packing_suggestions(
        current_user=user,
        trip_days=3,
    )

    assert result["essential"] == []
    assert result["optional"] == []

    assert (
        result["message"]
        == "No suitable clothing found in your wardrobe."
    )

    mock_request.assert_awaited_once()
