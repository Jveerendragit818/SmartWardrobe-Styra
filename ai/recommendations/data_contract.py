
"""
SmartWardrobe Recommendation Data Contract.

Validates and prepares saved clothing items
before sending them to the recommendation engine.
"""

VALID_CATEGORIES = {
    "tshirt",
    "shirt",
    "trousers",
    "jeans",
    "skirt",
    "dress",
    "jacket",
    "shoes"
}

VALID_SEASONS = {
    "summer",
    "winter",
    "monsoon",
    "all_season"
}

VALID_ATTRIBUTE_SOURCES = {
    "ai_predicted",
    "user_confirmed",
    "user_corrected",
    "unknown"
}


def resolve_item(item):
    """
    Validate and prepare one wardrobe item.
    """

    resolved = item.copy()

    # Every item must have an ID.
    if not resolved.get("id"):
        return None

    # Validate clothing category.
    category = resolved.get("category")

    if category not in VALID_CATEGORIES:
        return None

    # Preserve missing attributes.
    for field in ("color", "season", "occasion", "style"):
        if field not in resolved:
            resolved[field] = None

    # Convert a single occasion into a list.
    if isinstance(resolved["occasion"], str):
        resolved["occasion"] = [resolved["occasion"]]

    # Validate attribute source information.
    sources = resolved.get("attribute_sources", {})

    resolved["attribute_sources"] = {
        key: value if value in VALID_ATTRIBUTE_SOURCES else "unknown"
        for key, value in sources.items()
    }

    return resolved


def prepare_wardrobe(wardrobe):
    """
    Validate and prepare all wardrobe items.
    """

    prepared = []

    for item in wardrobe:
        resolved = resolve_item(item)

        if resolved is not None:
            prepared.append(resolved)

    return prepared
