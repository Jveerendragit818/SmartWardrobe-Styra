ALIASES = {
    "category": {
        "t shirt": "t_shirt",
        "tshirt": "t_shirt",
        "shirt": "shirt",
        "jean": "jeans",
        "jeans": "jeans",
        "dress": "dress",
        "jacket": "jacket",
    },
    "color": {
        "black": "black",
        "blue": "blue",
        "light blue": "light_blue",
        "green": "green",
        "navy": "navy",
        "navy blue": "navy",
        "red": "red",
        "multicolor": "multicolor",
        "multi color": "multicolor",
        "multicolour": "multicolor",
    },
    "season": {
        "summer": "summer",
        "winter": "winter",
        "all season": "all_season",# Keep the season values already in your file here.
    },
}
def normalize_attribute(field, value, *, user_confirmed):
    if field not in ALIASES:
        raise ValueError(f"Unsupported field: {field}")

    if not user_confirmed:
        return {"value": None, "status": "needs_review"}

    if not isinstance(value, str) or not value.strip():
        return {"value": None, "status": "missing"}

    cleaned = " ".join(
        value.strip()
        .lower()
        .replace("_", " ")
        .replace("-", " ")
        .split()
    )

    normalized = ALIASES[field].get(cleaned)

    if normalized is None:
        return {"value": None, "status": "unknown"}

    return {"value": normalized, "status": "normalized"}