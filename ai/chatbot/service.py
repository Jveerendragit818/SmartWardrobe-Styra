
"""
Rule-based fashion chatbot for the Styra Smart Wardrobe project.

The service uses only wardrobe items supplied in the context.
It does not invent clothing items or assume missing attributes.
"""

from typing import Any


TOP_CATEGORIES = {"t_shirt", "shirt"}
BOTTOM_CATEGORIES = {"jeans"}
DRESS_CATEGORIES = {"dress"}


def _get_wardrobe(context: dict) -> list[dict]:
    """Read wardrobe items from the Day 6 context format."""
    if not isinstance(context, dict):
        return []

    items = context.get("wardrobe_items", [])

    if not isinstance(items, list):
        return []

    valid_items = []

    for item in items:
        if not isinstance(item, dict):
            continue

        item_id = item.get("item_id")
        category = item.get("category")

        if not item_id or not isinstance(category, str):
            continue

        valid_items.append(item)

    return valid_items


def _item_description(item: dict) -> str:
    """Create a description using only available confirmed attributes."""
    color = item.get("color")
    category = item.get("category", "clothing item")

    if color:
        return f"{color.replace('_', ' ')} {category.replace('_', ' ')}"

    return category.replace("_", " ")


def _build_outfit_reply(items: list[dict]) -> dict:
    """Suggest a casual combination using available wardrobe items."""
    tops = [item for item in items if item.get("category") in TOP_CATEGORIES]
    bottoms = [
        item for item in items
        if item.get("category") in BOTTOM_CATEGORIES
    ]
    dresses = [
        item for item in items
        if item.get("category") in DRESS_CATEGORIES
    ]

    if tops and bottoms:
        top = tops[0]
        bottom = bottoms[0]

        reply = (
            f"For a casual look, try your {_item_description(top)} "
            f"with your {_item_description(bottom)}. "
            "This suggestion uses items from your saved wardrobe."
        )

        return {
            "reply": reply,
            "used_item_ids": [top["item_id"], bottom["item_id"]],
            "source": "rule_based_fallback",
        }

    if dresses:
        dress = dresses[0]

        return {
            "reply": (
                f"You can try your {_item_description(dress)} "
                "for a simple outfit. Your saved wardrobe context "
                "does not contain enough information to suggest "
                "additional matching pieces."
            ),
            "used_item_ids": [dress["item_id"]],
            "source": "rule_based_fallback",
        }

    return {
        "reply": (
            "I couldn't find enough confirmed clothing items to "
            "suggest a casual outfit. Add or confirm a shirt, T-shirt, "
            "jeans, or dress in your wardrobe."
        ),
        "used_item_ids": [],
        "source": "rule_based_fallback",
    }


def _answer_blue_shirt_question(items: list[dict]) -> dict:
    """Find a confirmed blue shirt and suggest available jeans."""
    blue_shirts = [
        item for item in items
        if item.get("category") == "shirt"
        and item.get("color") == "blue"
    ]

    if not blue_shirts:
        return {
            "reply": (
                "I couldn't find a confirmed blue shirt in your "
                "available wardrobe context. Check whether the shirt "
                "has been saved with its correct color."
            ),
            "used_item_ids": [],
            "source": "rule_based_fallback",
        }

    shirt = blue_shirts[0]

    jeans_items = [
        item for item in items
        if item.get("category") == "jeans"
    ]

    if jeans_items:
        jeans = jeans_items[0]

        return {
            "reply": (
                f"You can pair your {_item_description(shirt)} "
                f"with your {_item_description(jeans)}. "
                "This is a simple combination using your saved items."
            ),
            "used_item_ids": [shirt["item_id"], jeans["item_id"]],
            "source": "rule_based_fallback",
        }

    return {
        "reply": (
            f"I found your {_item_description(shirt)}, but I couldn't "
            "find confirmed jeans in your wardrobe context. Add more "
            "items to get a matching suggestion."
        ),
        "used_item_ids": [shirt["item_id"]],
        "source": "rule_based_fallback",
    }


def generate_reply(message: str, context: dict) -> dict:
    """
    Generate a wardrobe-grounded chatbot reply.

    Expected context:
    {
        "wardrobe_items": [
            {
                "item_id": "sample-item-001",
                "category": "t_shirt",
                "color": "light_blue"
            }
        ]
    }
    """
    if not isinstance(message, str) or not message.strip():
        return {
            "reply": "Please enter a fashion question.",
            "used_item_ids": [],
            "source": "rule_based_fallback",
        }

    items = _get_wardrobe(context)
    question = message.lower().strip()

    if not items:
        return {
            "reply": (
                "Your wardrobe context is empty. Add and confirm "
                "some clothing items before asking for outfit suggestions."
            ),
            "used_item_ids": [],
            "source": "rule_based_fallback",
        }

    if "blue shirt" in question:
        return _answer_blue_shirt_question(items)

    if any(
        phrase in question
        for phrase in ("casual", "outfit", "what should i wear", "suggest")
    ):
        return _build_outfit_reply(items)

    return {
        "reply": (
            "I can help suggest casual outfits and combinations "
            "from your saved wardrobe. Try asking: "
            "'Suggest a casual outfit' or "
            "'What can I wear with my blue shirt?'"
        ),
        "used_item_ids": [],
        "source": "rule_based_fallback",
    }
