

# SmartWardrobe - Recommendation Engine Tests
from ai.recommendations.engine import preference_score
from ai.recommendations.engine import recommend_outfits
from ai.recommendations.sample_data import WARDROBE
from ai.recommendations.rules import is_valid_combination
from ai.recommendations.data_contract import (
    prepare_wardrobe,
    normalize_category,
    normalize_color,
    normalize_season,
    normalize_prediction_attribute,
)


# TEST 1: Recommendation generation
def test_college_recommendations():

    outfits = recommend_outfits(
        WARDROBE,
        occasion="college",
        limit=5
    )

    assert len(outfits) > 0, "No outfits generated!"

    for outfit in outfits:
        assert outfit["item_ids"]
        assert 0 <= outfit["score"] <= 1
        assert outfit["reasons"]

    print("PASS: Recommendations generated successfully.")

    for index, outfit in enumerate(outfits, start=1):
        print(f"\nOutfit {index}")
        print("Items:", outfit["item_ids"])
        print("Score:", outfit["score"])
        print("Reasons:", outfit["reasons"])


# TEST 2: Outfit compatibility
def test_compatibility_rules():

    # Valid combinations: footwear is required
    assert is_valid_combination(["tshirt", "jeans", "shoes"])
    assert is_valid_combination(["shirt", "trousers", "shoes"])
    assert is_valid_combination(["dress", "shoes"])
    assert is_valid_combination(["shirt", "skirt", "shoes"])

    # Optional outerwear
    assert is_valid_combination(
        ["tshirt", "jeans", "shoes", "jacket"]
    )

    assert is_valid_combination(
        ["dress", "shoes", "jacket"]
    )

    # Invalid combinations
    assert not is_valid_combination(["tshirt", "jeans"])
    assert not is_valid_combination(["dress"])
    assert not is_valid_combination(["tshirt"])
    assert not is_valid_combination(["jeans"])
    assert not is_valid_combination(["tshirt", "tshirt"])
    assert not is_valid_combination(["shoes", "jacket"])
    assert not is_valid_combination(
        ["dress", "shirt", "shoes"]
    )

    print("PASS: Compatibility rules tested successfully.")


# TEST 3: Data contract validation
def test_data_contract():

    prepared = prepare_wardrobe(WARDROBE)

    # All eight sample items should be valid
    assert len(prepared) == 8

    # Check user-corrected colour
    item = next(
        x for x in prepared
        if x["id"] == "item_008"
    )

    assert item["color"] == "beige"

    assert (
        item["attribute_sources"]["color"]
        == "user_corrected"
    )

    # Missing season should remain None
    assert item["season"] is None

    # Invalid category should be rejected
    invalid_item = {
        "id": "item_009",
        "category": None,
        "color": "black"
    }

    assert prepare_wardrobe([invalid_item]) == []

    print("PASS: Data contract tested successfully.")


# TEST 4: Missing attribute handling
def test_missing_attributes():

    item = {
        "id": "item_010",
        "category": "tshirt",
        "color": None
    }

    prepared = prepare_wardrobe([item])

    assert len(prepared) == 1

    assert prepared[0]["color"] is None
    assert prepared[0]["season"] is None

    print("PASS: Missing attributes handled successfully.")


# TEST 5: Recommendation limit
def test_recommendation_limit():

    outfits = recommend_outfits(
        WARDROBE,
        occasion="college",
        limit=3
    )

    assert len(outfits) <= 3

    print("PASS: Recommendation limit working.")


# TEST 6: Vision category normalization
def test_vision_category_normalization():

    assert normalize_category("t_shirt") == "tshirt"
    assert normalize_category("T-Shirt") == "tshirt"
    assert normalize_category("jeans") == "jeans"
    assert normalize_category("sneakers") == "shoes"

    # Unknown categories must not be guessed
    assert normalize_category("unknown clothing") is None

    print("PASS: Vision category normalization working.")


# TEST 7: Vision color normalization
def test_vision_color_normalization():

    assert normalize_color("Light Blue") == "light_blue"
    assert normalize_color("Navy Blue") == "navy"
    assert normalize_color("Multi Colour") == "multicolor"
    assert normalize_color(None) is None

    print("PASS: Vision color normalization working.")


# TEST 8: Vision season normalization
def test_vision_season_normalization():

    assert normalize_season("Summer") == "summer"
    assert normalize_season("All Season") == "all_season"
    assert normalize_season("Unknown Season") is None

    print("PASS: Vision season normalization working.")


# TEST 9: Unconfirmed AI predictions must not be trusted
def test_unconfirmed_prediction_requires_review():

    prediction = {
        "value": "blue",
        "score": 0.95,
        "status": "predicted"
    }

    result = normalize_prediction_attribute(
        "color",
        prediction
    )

    assert result["value"] is None
    assert result["status"] == "needs_review"

    print("PASS: Unconfirmed prediction requires user review.")


# TEST 10: Missing and unsupported predictions
def test_missing_and_unsupported_predictions():

    missing = normalize_prediction_attribute(
        "color",
        {"value": None, "status": "missing"}
    )

    unsupported = normalize_prediction_attribute(
        "color",
        {"value": None, "status": "unsupported"}
    )

    assert missing["value"] is None
    assert missing["status"] == "needs_review"

    assert unsupported["value"] is None
    assert unsupported["status"] == "unsupported"

    print("PASS: Missing and unsupported predictions handled.")


# TEST 11: Unknown prediction fields
def test_unknown_prediction_field():

    try:
        normalize_prediction_attribute(
            "occasion",
            {"value": "casual"}
        )
    except ValueError:
        pass
    else:
        raise AssertionError("Unsupported prediction field was accepted.")

    print("PASS: Unsupported prediction fields rejected.")


# RUN ALL TESTS
if __name__ == "__main__":

    print("====================================")
    print(" SMARTWARDROBE RECOMMENDATION TESTS")
    print("====================================")

    test_college_recommendations()
    test_compatibility_rules()
    test_data_contract()
    test_missing_attributes()
    test_recommendation_limit()
    test_vision_category_normalization()
    test_vision_color_normalization()
    test_vision_season_normalization()
    test_unconfirmed_prediction_requires_review()
    test_missing_and_unsupported_predictions()
    test_unknown_prediction_field()

    print("\n====================================")
    print(" ALL TESTS COMPLETED SUCCESSFULLY!")
    print("====================================")


# DAY 6: PERSONALIZATION TESTS

def test_preferred_colors():
    outfit = [{"color": "blue"}]
    preferences = {"preferred_colors": ["blue"]}

    assert preference_score(outfit, preferences) == 1.0


def test_preferred_styles():
    outfit = [{"color": "black", "style": ["casual"]}]
    preferences = {"preferred_styles": ["casual"]}

    assert preference_score(outfit, preferences) == 1.0


def test_disliked_colors():
    outfit = [{"color": "yellow"}]
    preferences = {"disliked_colors": ["yellow"]}

    assert preference_score(outfit, preferences) == 0.0


def test_usual_occasions():
    outfit = [{"color": "blue", "occasion": ["college"]}]
    preferences = {"usual_occasions": ["college"]}

    assert preference_score(outfit, preferences) == 1.0


def test_legacy_preferences():
    outfit = [{"color": "black", "style": ["formal"]}]
    preferences = {
        "colors": ["black"],
        "styles": ["formal"]
    }

    assert preference_score(outfit, preferences) == 1.0


# DAY 7: SAVED OUTFIT DATA INTEGRITY TESTS

def test_ai_predicted_color_is_not_trusted():
    item = {
        "id": "day7_001",
        "category": "shirt",
        "color": "blue",
        "attribute_sources": {
            "category": "user_confirmed",
            "color": "ai_predicted",
        },
    }

    prepared = prepare_wardrobe([item])

    assert len(prepared) == 1
    assert prepared[0]["color"] is None


def test_ai_predicted_category_is_rejected():
    item = {
        "id": "day7_002",
        "category": "shirt",
        "color": "blue",
        "attribute_sources": {
            "category": "ai_predicted",
            "color": "user_confirmed",
        },
    }

    assert prepare_wardrobe([item]) == []


def test_missing_image_does_not_reject_item():
    item = {
        "id": "day7_003",
        "category": "shirt",
        "color": "blue",
        "image_path": None,
        "attribute_sources": {
            "category": "user_confirmed",
            "color": "user_confirmed",
        },
    }

    prepared = prepare_wardrobe([item])

    assert len(prepared) == 1
    assert prepared[0]["id"] == "day7_003"
    assert prepared[0]["image_path"] is None


def test_missing_item_id_is_rejected():
    item = {
        "category": "shirt",
        "color": "blue",
    }

    assert prepare_wardrobe([item]) == []
