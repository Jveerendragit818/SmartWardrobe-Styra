
from app.services.chatbot_service import build_confirmed_wardrobe_context


def test_confirmed_attributes_are_normalized():
    records = [
        {
            "id": "item_001",
            "confirmed_attributes": {
                "category": "t-shirt",
                "color": "light blue",
            },
        }
    ]

    result = build_confirmed_wardrobe_context(records)

    assert result == {
        "wardrobe_items": [
            {
                "item_id": "item_001",
                "category": "t_shirt",
                "color": "light_blue",
            }
        ]
    }


def test_ai_predictions_are_ignored():
    records = [
        {
            "id": "item_002",
            "ai_predictions": {
                "category": "jeans",
                "color": "blue",
            },
            "confirmed_attributes": {},
        }
    ]

    result = build_confirmed_wardrobe_context(records)

    assert result == {"wardrobe_items": []}


def test_unknown_category_is_excluded():
    records = [
        {
            "id": "item_003",
            "confirmed_attributes": {
                "category": "LABEL_17",
                "color": "red",
            },
        }
    ]

    result = build_confirmed_wardrobe_context(records)

    assert result == {"wardrobe_items": []}


def test_unknown_color_is_omitted():
    records = [
        {
            "id": "item_004",
            "confirmed_attributes": {
                "category": "shirt",
                "color": "purple",
            },
        }
    ]

    result = build_confirmed_wardrobe_context(records)

    assert result == {
        "wardrobe_items": [
            {
                "item_id": "item_004",
                "category": "shirt",
            }
        ]
    }


def test_empty_wardrobe():
    result = build_confirmed_wardrobe_context([])

    assert result == {"wardrobe_items": []}
