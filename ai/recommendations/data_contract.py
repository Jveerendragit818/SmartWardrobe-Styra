
"""
SmartWardrobe Recommendation Data Contract.

Normalizes and prepares Supabase wardrobe records
before sending them to the recommendation engine.
"""

# ==========================================================
# 1. VALID VALUES
# ==========================================================

VALID_CATEGORIES = {
    "tshirt",
    "shirt",
    "trousers",
    "jeans",
    "skirt",
    "dress",
    "jacket",
    "shoes",
}

VALID_SEASONS = {
    "summer",
    "winter",
    "monsoon",
    "all_season",
}

VALID_ATTRIBUTE_SOURCES = {
    "ai_predicted",
    "user_confirmed",
    "user_corrected",
    "unknown",
}


# ==========================================================
# 2. CATEGORY ALIASES
# ==========================================================

CATEGORY_ALIASES = {
    "t-shirt": "tshirt",
    "t shirt": "tshirt",
    "tee": "tshirt",
    "pants": "trousers",
    "trouser": "trousers",
    "sneaker": "shoes",
    "sneakers": "shoes",
}


# ==========================================================
# 3. CATEGORY NORMALIZATION
# ==========================================================

def normalize_category(category):
    """Normalize clothing category names."""

    if not isinstance(category, str):
        return None

    normalized = category.strip().lower()

    normalized = CATEGORY_ALIASES.get(
        normalized,
        normalized
    )

    if normalized not in VALID_CATEGORIES:
        return None

    return normalized


# ==========================================================
# 4. RESOLVE ONE WARDROBE ITEM
# ==========================================================

def resolve_item(item):
    """Validate and prepare one saved clothing item."""

    # Ensure the input is a dictionary.
    if not isinstance(item, dict):
        return None

    resolved = item.copy()

    # Every item must have an ID.
    if not resolved.get("id"):
        return None

    # Normalize category.
    category = normalize_category(
        resolved.get("category")
    )

    if category is None:
        return None

    resolved["category"] = category

    # ======================================================
    # Normalize optional text attributes.
    # ======================================================

    for field in ("color", "pattern", "season"):

        value = resolved.get(field)

        if isinstance(value, str):
            resolved[field] = value.strip().lower() or None
        else:
            resolved[field] = None

    # ======================================================
    # Preserve missing attributes safely.
    # ======================================================

    resolved.setdefault("color", None)
    resolved.setdefault("pattern", None)
    resolved.setdefault("season", None)
    resolved.setdefault("occasion", [])
    resolved.setdefault("style", [])

    # ======================================================
    # Validate season.
    # ======================================================

    if resolved["season"] not in (None, *VALID_SEASONS):
        resolved["season"] = None

    # ======================================================
    # Normalize occasion.
    # ======================================================

    if isinstance(resolved["occasion"], str):
        resolved["occasion"] = [resolved["occasion"]]

    if not isinstance(resolved["occasion"], list):
        resolved["occasion"] = []

    resolved["occasion"] = [
        value.strip().lower()
        for value in resolved["occasion"]
        if isinstance(value, str) and value.strip()
    ]

    # ======================================================
    # Normalize style.
    # ======================================================

    if isinstance(resolved["style"], str):
        resolved["style"] = [resolved["style"]]

    if not isinstance(resolved["style"], list):
        resolved["style"] = []

    resolved["style"] = [
        value.strip().lower()
        for value in resolved["style"]
        if isinstance(value, str) and value.strip()
    ]

    # ======================================================
    # Preserve attribute source metadata.
    # ======================================================

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


# ==========================================================
# 5. PREPARE COMPLETE WARDROBE
# ==========================================================

def prepare_wardrobe(wardrobe):
    """Validate and prepare all saved wardrobe items."""

    if not isinstance(wardrobe, list):
        return []

    prepared = []

    for item in wardrobe:

        resolved = resolve_item(item)

        if resolved is not None:
            prepared.append(resolved)

    return prepared
