
from ai.recommendations.engine import recommend_outfits
from ai.recommendations.sample_data import WARDROBE


def test_college_recommendations():
    outfits = recommend_outfits(
        WARDROBE,
        occasion="college",
        limit=5,
    )

    assert len(outfits) > 0

    for outfit in outfits:
        assert outfit["item_ids"]
        assert 0 <= outfit["score"] <= 1
        assert outfit["reasons"]

    print("PASS: Recommendations generated successfully.")

    for outfit in outfits:
        print(outfit)


if __name__ == "__main__":
    test_college_recommendations()
