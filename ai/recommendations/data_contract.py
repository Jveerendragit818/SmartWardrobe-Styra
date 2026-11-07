
"""
SmartWardrobe Recommendation Data Contract.

Normalizes clothing attributes and ensures explicitly AI-predicted
attributes are not treated as user-confirmed data.
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

TRUSTED_ATTRIBUTE_SOURCES = {
    "user_confirmed",
    "user_corrected",
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
    """Normalize supported clothing category names."""
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
    """Process one vision prediction. Predictions require user review."""
    if field not in {"category", "color", "season"}:
        raise ValueError(f"Unsupported field: {field}")

    if not isinstance(prediction, dict):
        return {"value": None, "status": "missing"}

    if prediction.get("status") in {
        "unsupported", "not_predicted", "unmapped"
    }:
        return {"value": None, "status": prediction["status"]}

    if prediction.get("value") is None:
        return {"value": None, "status": "needs_review"}

    return {"value": None, "status": "needs_review"}


def _is_trusted(field, sources):
    """Check whether an explicitly sourced attribute is user-confirmed."""
    if sources is None:
        return True

    source = sources.get(field, "unknown")

    return source in TRUSTED_ATTRIBUTE_SOURCES


def resolve_item(item):
    """Validate and prepare one saved clothing item."""
    if not isinstance(item, dict):
        return None

    resolved = item.copy()

    if not resolved.get("id"):
        return None

    raw_sources = resolved.get("attribute_sources")

    # Preserve compatibility with legacy records that have no source data.
    has_source_metadata = isinstance(raw_sources, dict)

    sources = raw_sources if has_source_metadata else None

    if sources is not None:
        resolved["attribute_sources"] = {
            key: (
                value
                if isinstance(value, str)
                and value in VALID_ATTRIBUTE_SOURCES
                else "unknown"
            )
            for key, value in sources.items()
        }

    # Category is essential for outfit compatibility.
    if has_source_metadata and not _is_trusted("category", sources):
        return None

    category = normalize_category(resolved.get("category"))

    if category is None:
        return None

    resolved["category"] = category

    # Explicitly predicted or unknown attributes are not trusted.
    if has_source_metadata and not _is_trusted("color", sources):
        resolved["color"] = None
    else:
        resolved["color"] = normalize_color(resolved.get("color"))

    if has_source_metadata and not _is_trusted("season", sources):
        resolved["season"] = None
    else:
        resolved["season"] = normalize_season(resolved.get("season"))

    resolved["pattern"] = _normalize_text(
        resolved.get("pattern")
    )

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
