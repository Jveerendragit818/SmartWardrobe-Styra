TOPS = {"tshirt", "shirt"}
BOTTOMS = {"trousers", "jeans", "skirt"}
DRESSES = {"dress"}
SHOES = {"shoes"}
LAYERS = {"jacket"}

ALLOWED_CATEGORIES = TOPS | BOTTOMS | DRESSES | SHOES | LAYERS


def is_valid_combination(categories):
    """Require a valid base outfit and footwear."""

    categories = list(categories)
    category_set = set(categories)

    if len(categories) != len(category_set):
        return False

    if not category_set <= ALLOWED_CATEGORIES:
        return False

    if "shoes" not in category_set:
        return False

    if "dress" in category_set:
        return not bool(category_set & (TOPS | BOTTOMS))

    return (
        bool(category_set & TOPS)
        and bool(category_set & BOTTOMS)
    )
