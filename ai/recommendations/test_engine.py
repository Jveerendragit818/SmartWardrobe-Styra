
# SmartWardrobe - Recommendation Engine Tests

from ai.recommendations.engine import recommend_outfits
from ai.recommendations.sample_data import WARDROBE
from ai.recommendations.rules import is_valid_combination
from ai.recommendations.data_contract import prepare_wardrobe


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

    # Valid combinations
    assert is_valid_combination(["tshirt", "jeans"])
    assert is_valid_combination(["shirt", "trousers"])
    assert is_valid_combination(["dress"])
    assert is_valid_combination(["shirt", "skirt"])

    # Invalid combinations
    assert not is_valid_combination(["tshirt"])
    assert not is_valid_combination(["jeans"])
    assert not is_valid_combination(["tshirt", "tshirt"])
    assert not is_valid_combination(["shoes", "jacket"])

    print("\nPASS: Compatibility rules tested successfully.")


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

    print("\n====================================")
    print(" ALL TESTS COMPLETED SUCCESSFULLY!")
    print("====================================")
