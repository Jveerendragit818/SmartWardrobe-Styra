
"""
SmartWardrobe Recommendation Data Contract.

Normalizes confirmed clothing attributes from the vision
module and prepares saved wardrobe records for recommendations.

Only user-confirmed or user-corrected attributes are trusted
when explicit attribute source information is available.
"""

VALID_CATEGORIES = {
    "tshirt", "shirt", "trousers", "jeans",
    "skirt", "dress", "jacket", "shoes",
}

VALID_SEASONS = {
    "summer", "winter", "monsoon", "all_season",
}

VALID_ATTRIBUTE_SOURCES = {
    "ai_predicted",
    "user_confirmed",
    "user_corrected",
    "unknown",
}

CATEGORY_ALIASES = {
    "t-shirt": "tshirt",
    "t shirt": "tshirt",
    "t_shirt": "tshirt",
    "tee": "tshirt",
    "pants": "trousers",
    "pant": "trousers",
    "trouser": "trousers",
    "sneaker": "shoes",
    "sneakers": "shoes",
}

COLOR_ALIASES = {
    "navy blue": "navy",
    "light blue": "light_blue",
    "multi color": "multicolor",
    "multi colour": "multicolor",
    "multicolour": "multicolor",
}

SEASON_ALIASES = {
    "all season": "all_season",
    "all-season": "all_season",
}


def _normalize_text(value):
    """Convert a non-empty string to normalized lowercase text."""
    if not isinstance(value, str):
        return None

    cleaned = " ".join(
        value.strip().lower().replace("_", " ").split()
    )

    return cleaned or None


def normalize_category(category):
    """Normalize category names from vision and wardrobe records."""
    normalized = _normalize_text(category)

    if normalized is None:
        return None

    normalized = CATEGORY_ALIASES.get(normalized, normalized)

    if normalized not in VALID_CATEGORIES:
        return None

    return normalized


def normalize_color(color):
    """Normalize common color names without guessing unknown colors."""
    normalized = _normalize_text(color)

    if normalized is None:
        return None

    return COLOR_ALIASES.get(normalized, normalized)


def normalize_season(season):
    """Normalize supported season values."""
    normalized = _normalize_text(season)

    if normalized is None:
        return None

    normalized = SEASON_ALIASES.get(normalized, normalized)

    if normalized not in VALID_SEASONS:
        return None

    return normalized


def normalize_prediction_attribute(field, prediction):
    """
    Process one vision prediction.

    Predictions are suggestions only. They are not trusted until
    the user confirms them.

    Returns a normalized value and review status.
    """
    if field not in {"category", "color", "season"}:
        raise ValueError(f"Unsupported field: {field}")

    if not isinstance(prediction, dict):
        return {"value": None, "status": "missing"}

    if prediction.get("status") in {
        "unsupported", "not_predicted", "unmapped"
    }:
        return {"value": None, "status": prediction["status"]}

    value = prediction.get("value")

    if value is None:
        return {"value": None, "status": "needs_review"}

    # Never accept an AI prediction as confirmed automatically.
    return {"value": None, "status": "needs_review"}


def resolve_item(item):
    """Validate and prepare one saved clothing item."""
    if not isinstance(item, dict):
        return None

    resolved = item.copy()

    if not resolved.get("id"):
        return None

    category = normalize_category(resolved.get("category"))

    if category is None:
        return None

    resolved["category"] = category

    # Normalize color and season without inventing missing values.
    resolved["color"] = normalize_color(resolved.get("color"))
    resolved["season"] = normalize_season(resolved.get("season"))

    for field in ("pattern",):
        resolved[field] = _normalize_text(resolved.get(field))

    for field in ("occasion", "style"):
        value = resolved.get(field, [])

        if isinstance(value, str):
            value = [value]

        if not isinstance(value, list):
            value = []

        resolved[field] = [
            cleaned
            for entry in value
            if (cleaned := _normalize_text(entry)) is not None
        ]

    sources = resolved.get("attribute_sources") or {}

    if not isinstance(sources, dict):
        sources = {}

    resolved["attribute_sources"] = {
        key: (
            value
            if isinstance(value, str)
            and value in VALID_ATTRIBUTE_SOURCES
            else "unknown"
        )
        for key, value in sources.items()
    }

    return resolved


def prepare_wardrobe(wardrobe):
    """Validate and prepare all saved clothing items."""
    if not isinstance(wardrobe, list):
        return []

    prepared = []

    for item in wardrobe:
        resolved = resolve_item(item)

        if resolved is not None:
            prepared.append(resolved)

    return prepared
