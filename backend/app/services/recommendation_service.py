
"""
SmartWardrobe Recommendation Service.

Connects the authenticated user's Supabase wardrobe
with the AI recommendation engine.
"""

from fastapi import HTTPException, status

from ai.recommendations.engine import recommend_outfits

from app.api.v1.routes.wardrobe import supabase_request


async def get_recommendations(
    current_user: dict,
    occasion: str = "college",
    limit: int = 5,
    weather: dict | None = None,
    user_preferences: dict | None = None,
    recent_outfits: list | None = None,
):
    """
    Fetch the authenticated user's wardrobe and
    generate personalized outfit recommendations.
    """

    # Fetch only the signed-in user's wardrobe.
    wardrobe = await supabase_request(
        "GET",
        "clothing_items",
        current_user,
        params={
            "select": "*",
            "user_id": f"eq.{current_user['user_id']}",
            "order": "created_at.desc",
        },
    )

    if not wardrobe:
        return []

    # Generate outfit recommendations.
    try:
        recommendations = recommend_outfits(
            wardrobe=wardrobe,
            occasion=occasion,
            limit=limit,
            weather=weather,
            user_preferences=user_preferences,
            recent_outfits=recent_outfits,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )

    return recommendations
