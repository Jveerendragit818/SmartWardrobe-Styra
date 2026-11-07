# ==========================================================
# SMARTWARDROBE - ADVANCED RECOMMENDATION ENGINE
# Member 4 - Recommendation and Generative AI
# ==========================================================

from itertools import product

from ai.recommendations.rules import (
    TOPS,
    BOTTOMS,
    DRESSES,
    SHOES,
    LAYERS,
    is_valid_combination,
)

from ai.recommendations.data_contract import prepare_wardrobe


# ==========================================================
# 1. CONFIGURATION AND SCORING WEIGHTS
# ==========================================================

NEUTRAL_COLORS = {
    "black", "white", "grey", "gray",
    "beige", "navy", "brown"
}

WEIGHTS = {
    "color": 0.30,
    "occasion": 0.25,
    "weather": 0.20,
    "preference": 0.15,
    "novelty": 0.10,
}


# ==========================================================
# 2. OCCASION FILTERING
# ==========================================================

def is_suitable_for_occasion(item, occasion):
    """Allow matching items or items with unknown occasions."""

    occasions = item.get("occasion") or []

    if not occasion or not occasions:
        return True

    return occasion.lower() in {
        value.lower() for value in occasions
    }


# ==========================================================
# 3. COLOR COMPATIBILITY
# ==========================================================
def color_score(color1, color2):
    """Calculate compatibility between two clothing colours."""

    if not color1 or not color2:
        return 0.5

    color1 = color1.lower()
    color2 = color2.lower()

    if color1 == color2:
        return 0.7

    if color1 in NEUTRAL_COLORS or color2 in NEUTRAL_COLORS:
        return 1.0

    complementary_pairs = {
        frozenset(("blue", "orange")),
        frozenset(("red", "green")),
        frozenset(("yellow", "purple")),
    }

    if frozenset((color1, color2)) in complementary_pairs:
        return 0.9

    return 0.6


def outfit_color_score(outfit):
    """Calculate average colour compatibility of an outfit."""

    colors = [
        item.get("color")
        for item in outfit
        if item.get("color")
    ]

    scores = [
        color_score(colors[i], colors[j])
        for i in range(len(colors))
        for j in range(i + 1, len(colors))
    ]

    return sum(scores) / len(scores) if scores else 0.5
# ==========================================================
# 4. OCCASION SUITABILITY
# ==========================================================

def occasion_score(outfit, occasion):
    """Calculate how suitable an outfit is for an occasion."""

    if not occasion or not outfit:
        return 0.5

    matches = sum(
        occasion.lower() in {
            value.lower()
            for value in (item.get("occasion") or [])
        }
        for item in outfit
    )

    return matches / len(outfit)


# ==========================================================
# 5. WEATHER SUITABILITY
# ==========================================================

def weather_score(outfit, weather=None):
    """Calculate outfit suitability for weather conditions."""

    if not weather or not outfit:
        return 0.5

    current_season = weather.get("season")
    condition = (weather.get("condition") or "").lower()

    if not current_season:
        return 0.5

    current_season = current_season.lower()
    scores = []

    for item in outfit:
        item_season = item.get("season")

        if not item_season:
            item_score = 0.5

        elif item_season == "all_season":
            item_score = 1.0

        elif item_season == current_season:
            item_score = 1.0

        else:
            item_score = 0.3

        if condition in {"rain", "rainy"}:
            if (
                item["category"] == "shoes"
                and item.get("weather_suitable") is False
            ):
                item_score = min(item_score, 0.2)

        scores.append(item_score)

    return sum(scores) / len(scores)

# ==========================================================
# 6. USER STYLE PREFERENCES
# ==========================================================

def preference_score(outfit, user_preferences=None):
    """Score an outfit using saved colors, styles and occasion preferences.

    Supports the Day 6 preference schema and the legacy styles/colors keys.
    Missing preference data is treated neutrally rather than guessed.
    """
    if not user_preferences or not outfit:
        return 0.5

    def values_as_set(values):
        if isinstance(values, str):
            values = [values]
        if not isinstance(values, (list, tuple, set)):
            return set()
        return {
            str(value).strip().lower()
            for value in values
            if value is not None and str(value).strip()
        }

    preferred_styles = values_as_set(
        user_preferences.get("preferred_styles")
        or user_preferences.get("styles")
    )
    preferred_colors = values_as_set(
        user_preferences.get("preferred_colors")
        or user_preferences.get("colors")
    )
    disliked_colors = values_as_set(
        user_preferences.get("disliked_colors")
    )
    usual_occasions = values_as_set(
        user_preferences.get("usual_occasions")
    )

    item_scores = []
    for item in outfit:
        checks = []
        item_styles = values_as_set(item.get("style"))
        item_occasions = values_as_set(item.get("occasion"))
        item_color = str(item.get("color") or "").strip().lower()

        if preferred_styles:
            checks.append(1.0 if item_styles & preferred_styles else 0.0)

        if preferred_colors:
            checks.append(1.0 if item_color in preferred_colors else 0.0)

        if disliked_colors:
            # A disliked color receives no credit and is penalized.
            checks.append(0.0 if item_color in disliked_colors else 1.0)

        if usual_occasions and item_occasions:
            checks.append(
                1.0 if item_occasions & usual_occasions else 0.0
            )
         # Items without matching preference attributes remain neutral.
        item_scores.append(
            sum(checks) / len(checks) if checks else 0.5
        )

    return max(0.0, min(1.0, sum(item_scores) / len(item_scores)))
# ==========================================================
# 7. OUTFIT NOVELTY
# ==========================================================

def novelty_score(outfit, recent_outfits=None):
    """Reduce scores for recently worn outfit combinations."""

    if not recent_outfits:
        return 0.5

    current_ids = {
        item["id"] for item in outfit
    }
    if not current_ids:
        return 0.5

    similarities = []

    for previous in recent_outfits:
        previous_ids = set(previous)

        if not previous_ids:
            continue

        union = current_ids | previous_ids
        intersection = current_ids & previous_ids

        similarity = len(intersection) / len(union)
        similarities.append(similarity)

    if not similarities:
        return 0.5

    return 1.0 - max(similarities)


# ==========================================================
# 8. TOTAL OUTFIT SCORE
# ==========================================================

def calculate_outfit_score(
    outfit,
    occasion="college",
    weather=None,
    user_preferences=None,
    recent_outfits=None,
):
    """Calculate weighted recommendation score."""

    scores = {
        "color": outfit_color_score(outfit),
        "occasion": occasion_score(outfit, occasion),
        "weather": weather_score(outfit, weather),
        "preference": preference_score(outfit, user_preferences),
        "novelty": novelty_score(outfit, recent_outfits),
    }
    total = sum(
        scores[key] * WEIGHTS[key]
        for key in WEIGHTS
    )

    return round(total, 3), scores


# ==========================================================
# 9. USER-FRIENDLY EXPLANATIONS
# ==========================================================

def generate_reasons(scores, occasion):
    """Generate understandable explanations for recommendations."""

    reasons = []

    if scores["color"] >= 0.8:
        reasons.append(
            "The clothing colors complement each other."
        )
    elif scores["color"] >= 0.6:
        reasons.append(
            "The clothing colors have reasonable compatibility."
        )
    else:
        reasons.append(
            "Some clothing colors have limited compatibility."
        )
    if scores["occasion"] >= 0.8:
        reasons.append(
            f"Suitable for your {occasion} occasion."
        )
    elif scores["occasion"] >= 0.5:
        reasons.append(
            "Some items match your selected occasion."
        )
    else:
        reasons.append(
            "Occasion compatibility is limited."
        )

    if scores["weather"] >= 0.8:
        reasons.append(
            "The selected clothing matches the current season."
        )
    elif scores["weather"] < 0.5:
        reasons.append(
            "Some items may not match the current season."
        )
    else:
        reasons.append(
            "Weather compatibility is not fully established."
        )

    if scores["preference"] > 0.5:
        reasons.append(
            "Matches your saved style or color preferences."
        )
    elif scores["preference"] == 0.5:
        reasons.append(
            "Personal preference information is not available."
        )

    if scores["novelty"] > 0.5:
        reasons.append(
            "This combination differs from recently worn outfits."
        )

    return reasons
# ==========================================================
# 10. OUTFIT GENERATION
# ==========================================================

def generate_outfit_candidates(wardrobe, occasion):
    """
    Generate valid outfits using saved wardrobe items.

    Structure 1: Top + Bottom + Shoes
    Structure 2: Dress + Shoes

    Jacket is optional.
    """

    suitable_items = [
        item for item in wardrobe
        if is_suitable_for_occasion(item, occasion)
    ]

    tops = [
        item for item in suitable_items
        if item["category"] in TOPS
    ]

    bottoms = [
        item for item in suitable_items
        if item["category"] in BOTTOMS
    ]

    dresses = [
        item for item in suitable_items
        if item["category"] in DRESSES
    ]

    shoes = [
        item for item in suitable_items
        if item["category"] in SHOES
    ]
    jackets = [
        item for item in suitable_items
        if item["category"] in LAYERS
    ]

    if not shoes:
        return []

    results = []

    # Top + Bottom + Shoes
    for top, bottom in product(tops, bottoms):

        for shoe in shoes:
            for jacket in [None] + jackets:

                outfit = [top, bottom, shoe]

                if jacket is not None:
                    outfit.append(jacket)

                categories = [
                    item["category"] for item in outfit
                ]

                if is_valid_combination(categories):
                    results.append(outfit)

    # Dress + Shoes
    for dress in dresses:

        for shoe in shoes:
            for jacket in [None] + jackets:

                outfit = [dress, shoe]

                if jacket is not None:
                    outfit.append(jacket)

                categories = [
                    item["category"] for item in outfit
                ]

                if is_valid_combination(categories):
                    results.append(outfit)

    # Dress + Shoes
    for dress in dresses:

        for shoe in shoes:
            for jacket in [None] + jackets:

                outfit = [dress, shoe]

                if jacket is not None:
                    outfit.append(jacket)

                categories = [
                    item["category"] for item in outfit
                ]

                if is_valid_combination(categories):
                    results.append(outfit)

    return results


# ==========================================================
# 11. MAIN RECOMMENDATION ENGINE
# ==========================================================

def recommend_outfits(
    wardrobe,
    occasion="college",
    limit=5,
    weather=None,
    user_preferences=None,
    recent_outfits=None,
):
    """Generate, score and rank personalized outfit recommendations."""
    if isinstance(limit, bool) or not isinstance(limit, int) or limit < 0:
        raise ValueError("limit must be a non-negative integer")

    if limit == 0:
        return []

    if not isinstance(occasion, str) or not occasion.strip():
        raise ValueError("occasion must be a non-empty string")

    wardrobe = prepare_wardrobe(wardrobe)

    if not wardrobe:
        return []

    candidates = generate_outfit_candidates(
        wardrobe,
        occasion.lower(),
    )

    results = []
    for outfit in candidates:

        total_score, scores = calculate_outfit_score(
            outfit=outfit,
            occasion=occasion,
            weather=weather,
            user_preferences=user_preferences,
            recent_outfits=recent_outfits,
        )

        reasons = generate_reasons(scores, occasion)

        results.append({
            "item_ids": [
                item["id"] for item in outfit
            ],
            "score": total_score,
            "component_scores": scores,
            "reasons": reasons,
        })
    
    # Remove duplicate combinations.
    unique_results = {}

    for result in results:

        key = tuple(sorted(result["item_ids"]))

        if (
            key not in unique_results
            or result["score"] > unique_results[key]["score"]
        ):
            unique_results[key] = result

    results = list(unique_results.values())

    # Highest score first.
    results.sort(
        key=lambda item: item["score"],
        reverse=True,
    )

    return results[:limit]

