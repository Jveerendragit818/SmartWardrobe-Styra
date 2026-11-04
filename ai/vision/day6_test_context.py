from day6_wardrobe_context import build_wardrobe_context


items = [
    {
        "id": "item-001",
        "predicted_attributes": {"category": {"value": "jeans", "score": 0.95}},
        "user_confirmed_attributes": {
            "category": "t-shirt",
            "color": "light blue",
        },
    },
    {
        "id": "item-002",
        "user_confirmed_attributes": {
            "category": "LABEL_17",
            "color": "red",
        },
    },
    {
        "id": "item-003",
        "predicted_attributes": {"category": {"value": "dress", "score": 0.9}},
        "user_confirmed_attributes": {},
    },
    {
        "id": "item-004",
        "user_confirmed_attributes": {
            "category": "jeans",
            "color": "navy",
        },
    },
]

expected = {
    "wardrobe_items": [
        {
            "item_id": "item-001",
            "category": "t_shirt",
            "color": "light_blue",
        },
        {
            "item_id": "item-004",
            "category": "jeans",
            "color": "navy",
        },
    ]
}

actual = build_wardrobe_context(items)

assert actual == expected, f"Expected {expected}, got {actual}"
assert build_wardrobe_context([]) == {"wardrobe_items": []}

print("All Day 6 context checks passed.")