
TOPS = {"tshirt", "shirt"}
BOTTOMS = {"trousers", "jeans", "skirt"}
DRESSES = {"dress"}
SHOES = {"shoes"}
LAYERS = {"jacket"}

ALLOWED_CATEGORIES = TOPS | BOTTOMS | DRESSES | SHOES | LAYERS


def is_valid_combination(categories):
    """Check whether an outfit has a valid basic structure."""

    categories = list(categories)
    category_set = set(categories)

    if len(categories) != len(category_set):
        return False

    if not category_set <= ALLOWED_CATEGORIES:
        return False

    # A dress is a complete base outfit.
    if "dress" in category_set:
        return not bool(category_set & (TOPS | BOTTOMS))

    # Other outfits need a top and a bottom.
    return (
        bool(category_set & TOPS)
        and bool(category_set & BOTTOMS)
    )
