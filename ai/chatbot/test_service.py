
from ai.chatbot.service import generate_reply


def sample_context():
    return {
        "wardrobe_items": [
            {
                "item_id": "item_001",
                "category": "shirt",
                "color": "blue",
            },
            {
                "item_id": "item_002",
                "category": "jeans",
                "color": "black",
            },
            {
                "item_id": "item_003",
                "category": "t_shirt",
                "color": "light_blue",
            },
        ]
    }


def test_casual_outfit_suggestion():
    result = generate_reply("Suggest a casual outfit", sample_context())

    assert result["reply"]
    assert result["used_item_ids"]
    assert result["source"] == "rule_based_fallback"


def test_blue_shirt_question():
    result = generate_reply(
        "What can I wear with my blue shirt?",
        sample_context(),
    )

    assert "blue shirt" in result["reply"].lower()
    assert "item_001" in result["used_item_ids"]
    assert "item_002" in result["used_item_ids"]


def test_empty_wardrobe():
    result = generate_reply("Suggest a casual outfit", {"wardrobe_items": []})

    assert result["used_item_ids"] == []
    assert "empty" in result["reply"].lower()


def test_invalid_message():
    result = generate_reply("", sample_context())

    assert result["used_item_ids"] == []
    assert result["reply"]


def test_unknown_question():
    result = generate_reply("Tell me a joke", sample_context())

    assert result["used_item_ids"] == []
    assert result["source"] == "rule_based_fallback"


def test_no_blue_shirt():
    context = {
        "wardrobe_items": [
            {
                "item_id": "item_010",
                "category": "jeans",
                "color": "black",
            }
        ]
    }

    result = generate_reply("What can I wear with my blue shirt?", context)

    assert result["used_item_ids"] == []
    assert "couldn't find" in result["reply"].lower()
