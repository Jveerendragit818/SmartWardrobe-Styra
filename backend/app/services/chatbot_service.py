
from ai.chatbot.service import generate_reply
from ai.vision.normalization import normalize_attribute
from app.api.v1.routes.wardrobe import supabase_request


def build_confirmed_wardrobe_context(rows: list[dict]) -> dict:
    """Build context using only explicitly confirmed attributes."""

    wardrobe_items = []

    for row in rows:
        if not isinstance(row, dict):
            continue

        item_id = row.get("id")
        confirmed = row.get("confirmed_attributes") or {}

        if not item_id or not isinstance(confirmed, dict):
            continue

        category = normalize_attribute(
            "category",
            confirmed.get("category"),
            user_confirmed=True,
        )

        if category["status"] != "normalized":
            continue

        context_item = {
            "item_id": str(item_id),
            "category": category["value"],
        }

        color = normalize_attribute(
            "color",
            confirmed.get("color"),
            user_confirmed=True,
        )

        if color["status"] == "normalized":
            context_item["color"] = color["value"]

        wardrobe_items.append(context_item)

    return {"wardrobe_items": wardrobe_items}


async def get_chatbot_reply(current_user: dict, message: str) -> dict:
    """Fetch the authenticated user's wardrobe and generate a reply."""

    rows = await supabase_request(
        "GET",
        "clothing_items",
        current_user,
        params={
            "select": "id,confirmed_attributes",
            "user_id": f"eq.{current_user['user_id']}",
            "order": "created_at.desc",
        },
    )

    context = build_confirmed_wardrobe_context(rows or [])

    result = generate_reply(
        message=message,
        context=context,
    )

    return {
        "reply": result["reply"],
        "used_item_ids": result["used_item_ids"],
        "source": result["source"],
    }
