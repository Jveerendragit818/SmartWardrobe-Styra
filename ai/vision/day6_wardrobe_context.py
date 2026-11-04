from normalization import normalize_attribute


def build_wardrobe_context(items):
    wardrobe_items = []

    for item in items:
        confirmed = item.get("user_confirmed_attributes") or {}
        item_id = item.get("id") or item.get("item_id")

        if not item_id:
            continue

        category = normalize_attribute(
            "category",
            confirmed.get("category"),
            user_confirmed=True,
        )

        if category["status"] != "normalized":
            continue

        context_item = {
            "item_id": item_id,
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
    