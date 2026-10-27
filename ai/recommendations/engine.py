
from itertools import product

from ai.recommendations.rules import (
    TOPS,
    BOTTOMS,
    DRESSES,
    SHOES,
    is_valid_combination,
)


NEUTRAL_COLORS = {
    "black", "white", "grey", "gray", "beige", "navy"
}


def color_score(color1, color2):
    """Return a simple compatibility score between 0 and 1."""

    if not color1 or not color2:
        return 0.5

    color1 = color1.lower()
    color2 = color2.lower()

    if color1 == color2:
        return 0.7

    if color1 in NEUTRAL_COLORS or color2 in NEUTRAL_COLORS:
        return 1.0

    return 0.6


def recommend_outfits(wardrobe, occasion="college", limit=5):
    """Generate and rank outfit suggestions from wardrobe items."""

    tops = [x for x in wardrobe if x["category"] in TOPS]
    bottoms = [x for x in wardrobe if x["category"] in BOTTOMS]
    dresses = [x for x in wardrobe if x["category"] in DRESSES]
    shoes = [
        x for x in wardrobe
        if x["category"] in SHOES
        and occasion in x.get("occasion", [])
    ]

    candidates = []

    for top, bottom in product(tops, bottoms):
        candidates.append([top, bottom])

    for dress in dresses:
        candidates.append([dress])

    results = []

    for base in candidates:
        if not is_valid_combination(
            [item["category"] for item in base]
        ):
            continue

        base_items = base

        # Check whether the base outfit suits the occasion.
        occasion_match = sum(
            occasion in item.get("occasion", [])
            for item in base_items
        ) / len(base_items)

        # Evaluate colour compatibility across the base items.
        pair_scores = [
            color_score(base_items[i].get("color"),
                        base_items[j].get("color"))
            for i in range(len(base_items))
            for j in range(i + 1, len(base_items))
        ]

        colours = (
            sum(pair_scores) / len(pair_scores)
            if pair_scores else 0.5
        )

        # Include compatible footwear when available.
        shoe_options = shoes or [None]

        for shoe in shoe_options:
            outfit = base_items + ([shoe] if shoe else [])

            final_occasion = sum(
                occasion in item.get("occasion", [])
                for item in outfit
            ) / len(outfit)

            final_colors = [
                item.get("color") for item in outfit
            ]

            all_pairs = [
                color_score(final_colors[i], final_colors[j])
                for i in range(len(final_colors))
                for j in range(i + 1, len(final_colors))
            ]

            final_color_score = (
                sum(all_pairs) / len(all_pairs)
                if all_pairs else colours
            )

            score = (
                0.65 * final_occasion
                + 0.35 * final_color_score
            )

            results.append({
                "item_ids": [item["id"] for item in outfit],
                "score": round(score, 3),
                "reasons": [
                    f"Evaluated for {occasion}",
                    "Colour compatibility considered",
                ],
            })

    # Sort from highest to lowest score.
    results.sort(key=lambda item: item["score"], reverse=True)

    return results[:limit]
