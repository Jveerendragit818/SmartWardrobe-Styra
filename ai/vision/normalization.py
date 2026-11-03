ALIASES = {
    "category": {
        "t shirt": "t_shirt",
        "jeans": "jeans",
        "jean": "jeans",
        "jacket": "jacket"
    },
    "color": {
        "blue": "blue",
        "black": "black",
        "green": "green"
    },
    "season": {
        "summer": "summer",
        "winter": "winter",
        "all season": "all_season"
    }
}


def normalize_attribute(field, value, *, user_confirmed):
    """Normalize an agreed field; never approve an unconfirmed AI guess."""

    if field not in ALIASES:
        raise ValueError(f"Unsupported field: {field}")

    if not user_confirmed:
        return {"value": None, "status": "needs_review"}

    if not isinstance(value, str) or not value.strip():
        return {"value": None, "status": "missing"}

    cleaned = " ".join(
        value.strip().lower().replace("_", " ").replace("-", " ").split()
    )
    normalized = ALIASES[field].get(cleaned)

    if normalized is None:
        return {"value": None, "status": "unknown"}

    return {"value": normalized, "status": "normalized"}