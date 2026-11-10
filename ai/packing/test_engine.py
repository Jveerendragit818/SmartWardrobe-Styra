import pytest

from ai.packing.engine import generate_packing_suggestions


@pytest.fixture
def wardrobe():
    return [
        {"id": "1", "name": "Blue T-shirt", "category": "tshirt", "season": "all_season"},
        {"id": "2", "name": "White Shirt", "category": "shirt", "season": "summer"},
        {"id": "3", "name": "Jeans", "category": "jeans", "season": "all_season"},
        {"id": "4", "name": "Black Trousers", "category": "trousers", "season": "all_season"},
        {"id": "5", "name": "Sneakers", "category": "shoes", "season": "all_season"},
        {"id": "6", "name": "Jacket", "category": "jacket", "season": "winter"},
        {"id": "7", "name": "Summer Dress", "category": "dress", "season": "summer"},
    ]


def test_generates_packing_for_short_trip(wardrobe):
    result = generate_packing_suggestions(wardrobe, trip_days=2)

    assert result["trip_days"] == 2
    assert len(result["essential"]) >= 1
    assert any(item["category"] == "shoes" for item in result["essential"])


def test_separates_optional_items(wardrobe):
    result = generate_packing_suggestions(wardrobe, trip_days=2)

    assert isinstance(result["essential"], list)
    assert isinstance(result["optional"], list)
    assert all(item not in result["essential"] for item in result["optional"])


def test_filters_by_season(wardrobe):
    result = generate_packing_suggestions(
        wardrobe, trip_days=2, season="summer"
    )

    selected = result["essential"] + result["optional"]

    assert all(
        item.get("season") in ("summer", "all_season")
        for item in selected
    )


def test_filters_by_occasion():
    items = [
        {"id": "1", "category": "shirt", "occasion": ["formal"]},
        {"id": "2", "category": "shirt", "occasion": ["casual"]},
    ]

    result = generate_packing_suggestions(
        items, trip_days=1, occasion="formal"
    )

    assert all(item["id"] == "1" for item in result["essential"])


def test_handles_empty_wardrobe():
    result = generate_packing_suggestions([], trip_days=3)

    assert result["essential"] == []
    assert result["optional"] == []
    assert result["message"] == "No suitable clothing found in your wardrobe."


def test_reports_missing_categories():
    result = generate_packing_suggestions(
        [{"id": "1", "category": "tshirt"}],
        trip_days=2,
    )

    missing = [item["category"] for item in result["missing_categories"]]

    assert "bottoms" in missing
    assert "shoes" in missing


@pytest.mark.parametrize("days", [0, -1, 31, True])
def test_rejects_invalid_trip_duration(days):
    with pytest.raises(ValueError):
        generate_packing_suggestions([], trip_days=days)


def test_rejects_invalid_season():
    with pytest.raises(ValueError):
        generate_packing_suggestions([], trip_days=2, season="unknown")