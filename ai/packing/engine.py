
"""
SmartWardrobe Packing Assistant.
Member 5 - Day 8
"""

from math import ceil

from ai.recommendations.rules import (
    TOPS,
    BOTTOMS,
    DRESSES,
    SHOES,
    LAYERS,
)

VALID_SEASONS = {
    "summer", "winter", "monsoon", "spring", "all_season"
}


def _matches_context(item, occasion=None, season=None):
    item_occasions = item.get("occasion") or []
    item_season = str(item.get("season") or "").strip().lower()

    if isinstance(item_occasions, str):
        item_occasions = [item_occasions]

    if occasion and item_occasions:
        if occasion.lower() not in {
            str(value).lower() for value in item_occasions
        }:
            return False

    if season and item_season:
        if item_season not in {"all_season", season.lower()}:
            return False

    return True


def generate_packing_suggestions(
    wardrobe,
    trip_days,
    occasion=None,
    season=None,
):
    if isinstance(trip_days, bool) or not isinstance(trip_days, int):
        raise ValueError("trip_days must be a positive integer.")

    if not 1 <= trip_days <= 30:
        raise ValueError("trip_days must be between 1 and 30.")

    if season is not None:
        if not isinstance(season, str) or season.lower() not in VALID_SEASONS:
            raise ValueError("Unsupported season.")

    if occasion is not None:
        if not isinstance(occasion, str) or not occasion.strip():
            raise ValueError("occasion must be a non-empty string.")

    wardrobe = [
        item for item in wardrobe
        if isinstance(item, dict) and item.get("id") is not None
    ]

    suitable = [
        item for item in wardrobe
        if _matches_context(item, occasion, season)
    ]

    def category_items(categories):
        return [
            item for item in suitable
            if str(item.get("category") or "").lower() in categories
        ]

    tops = category_items(TOPS)
    bottoms = category_items(BOTTOMS)
    dresses = category_items(DRESSES)
    shoes = category_items(SHOES)
    layers = category_items(LAYERS)

    essential = []
    optional = []
    missing = []

    def add_items(items, quantity, category_name):
        selected = items[:quantity]
        essential.extend(selected)

        if len(selected) < quantity:
            missing.append({
                "category": category_name,
                "needed": quantity,
                "available": len(selected),
            })

    dress_count = min(len(dresses), trip_days)
    essential.extend(dresses[:dress_count])

    remaining_days = trip_days - dress_count

    if remaining_days:
        add_items(tops, remaining_days, "tops")
        add_items(bottoms, ceil(remaining_days / 2), "bottoms")

    add_items(shoes, 1, "shoes")

    optional.extend(layers)
    optional.extend(
        item for item in tops[remaining_days:]
        if item not in essential
    )
    optional.extend(
        item for item in bottoms[ceil(remaining_days / 2):]
        if item not in essential
    )
    optional.extend(
        item for item in dresses[dress_count:]
        if item not in essential
    )

    return {
        "trip_days": trip_days,
        "occasion": occasion,
        "season": season,
        "essential": essential,
        "optional": optional,
        "missing_categories": missing,
        "message": (
            "Packing suggestions generated."
            if essential
            else "No suitable clothing found in your wardrobe."
        ),
    }
