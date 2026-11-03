
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
    "novelty": 0.10
}


# ==========================================================
# 2. COLOR COMPATIBILITY
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
# 3. OCCASION SUITABILITY
# ==========================================================

def occasion_score(outfit, occasion):
    """Check how suitable an outfit is for an occasion."""

    if not occasion or not outfit:
        return 0.5

    matches = sum(
        occasion in (item.get("occasion") or [])
        for item in outfit
    )

    return matches / len(outfit)


# ==========================================================
# 4. WEATHER SUITABILITY
# ==========================================================

def weather_score(outfit, weather=None):
    """Calculate outfit suitability for weather conditions."""

    if not weather or not outfit:
        return 0.5

    current_season = weather.get("season")
    condition = weather.get("condition", "").lower()

    if not current_season:
        return 0.5

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

        # Rain suitability adjustment.
        if condition in {"rain", "rainy"}:
            if item["category"] == "shoes":
                if item.get("weather_suitable") is False:
                    item_score = min(item_score, 0.2)

        scores.append(item_score)

    return sum(scores) / len(scores)


# ==========================================================
# 5. USER STYLE PREFERENCES
# ==========================================================

def preference_score(outfit, user_preferences=None):
    """Calculate compatibility with user preferences."""

    if not user_preferences or not outfit:
        return 0.5

    preferred_styles = set(
        user_preferences.get("styles", [])
    )

    preferred_colors = {
        color.lower()
        for color in user_preferences.get("colors", [])
    }

    scores = []

    for item in outfit:

        item_styles = set(item.get("style") or [])
        item_color = item.get("color")

        matches = []

        if preferred_styles:
            matches.append(
                1.0 if item_styles & preferred_styles else 0.0
            )

        if preferred_colors:
            matches.append(
                1.0 if item_color and item_color.lower()
                in preferred_colors else 0.0
            )

        if matches:
            scores.append(sum(matches) / len(matches))
        else:
            scores.append(0.5)

    return sum(scores) / len(scores) if scores else 0.5


# ==========================================================
# 6. OUTFIT NOVELTY AND REPEAT AVOIDANCE
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
# 7. TOTAL OUTFIT SCORE
# ==========================================================

def calculate_outfit_score(
    outfit,
    occasion="college",
    weather=None,
    user_preferences=None,
    recent_outfits=None
):
    """Calculate weighted recommendation score."""

    scores = {
        "color": outfit_color_score(outfit),

        "occasion": occasion_score(
            outfit, occasion
        ),

        "weather": weather_score(
            outfit, weather
        ),

        "preference": preference_score(
            outfit, user_preferences
        ),

        "novelty": novelty_score(
            outfit, recent_outfits
        )
    }

    total = sum(
        scores[key] * WEIGHTS[key]
        for key in WEIGHTS
    )

    return round(total, 3), scores


# ==========================================================
# 8. OUTFIT GENERATION
# ==========================================================

def generate_outfit_candidates(wardrobe, occasion):
    """Generate valid combinations from available wardrobe items."""

    tops = [
        item for item in wardrobe
        if item["category"] in TOPS
    ]

    bottoms = [
        item for item in wardrobe
        if item["category"] in BOTTOMS
    ]

    dresses = [
        item for item in wardrobe
        if item["category"] in DRESSES
    ]

    shoes = [
        item for item in wardrobe
        if item["category"] in SHOES
        and occasion in (item.get("occasion") or [])
    ]

    jackets = [
        item for item in wardrobe
        if item["category"] in LAYERS
    ]

    candidates = []

    # Generate top and bottom combinations.
    for top, bottom in product(tops, bottoms):
        candidates.append([top, bottom])

    # Generate dress combinations.
    for dress in dresses:
        candidates.append([dress])

    results = []

    for base in candidates:

        shoe_options = shoes or [None]
        jacket_options = [None] + jackets

        for shoe in shoe_options:
            for jacket in jacket_options:

                outfit = base.copy()

                if shoe:
                    outfit.append(shoe)

                if jacket:
                    outfit.append(jacket)

                categories = [
                    item["category"] for item in outfit
                ]

                if is_valid_combination(categories):
                    results.append(outfit)

    return results


# ==========================================================
# 9. MAIN RECOMMENDATION ENGINE
# ==========================================================

def recommend_outfits(
    wardrobe,
    occasion="college",
    limit=5,
    weather=None,
    user_preferences=None,
    recent_outfits=None
):
    """
    Generate, score and rank personalized outfit recommendations.
    """

    # Validate wardrobe records.
    wardrobe = prepare_wardrobe(wardrobe)

    if not isinstance(limit, int) or limit < 0:
        raise ValueError("limit must be a non-negative integer")

    if not wardrobe:
        return []

    # Generate candidate outfits.
    candidates = generate_outfit_candidates(
        wardrobe,
        occasion
    )

    results = []

    for outfit in candidates:

        # Calculate five recommendation factors.
        total_score, scores = calculate_outfit_score(
            outfit=outfit,
            occasion=occasion,
            weather=weather,
            user_preferences=user_preferences,
            recent_outfits=recent_outfits
        )

        # Generate recommendation explanations.
        reasons = [
            f"Colour compatibility: {scores['color']:.2f}",
            f"Occasion suitability: {scores['occasion']:.2f}",
            f"Weather suitability: {scores['weather']:.2f}",
            f"Style preference: {scores['preference']:.2f}",
            f"Outfit novelty: {scores['novelty']:.2f}"
        ]

        results.append({
            "item_ids": [
                item["id"] for item in outfit
            ],

            "score": total_score,

            "component_scores": scores,

            "reasons": reasons
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

    # Rank highest-scoring outfits first.
    results.sort(
        key=lambda item: item["score"],
        reverse=True
    )

    return results[:limit]
