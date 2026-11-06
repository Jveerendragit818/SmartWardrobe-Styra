"""
SmartWardrobe Recommendation Service.

Connects the authenticated user's Supabase wardrobe
and saved preferences with the rule-based recommendation engine.
"""

from fastapi import HTTPException, status

from ai.recommendations.engine import recommend_outfits
from app.api.v1.routes.wardrobe import supabase_request


async def get_recommendations(
    current_user: dict,
    occasion: str = "college",
    limit: int = 5,
    weather: dict | None = None,
    recent_outfits: list | None = None,
):
    """Recommend explainable outfits from the signed-in user's items."""

    user_id = current_user["user_id"]

    wardrobe = await supabase_request(
        "GET",
        "clothing_items",
        current_user,
        params={
            "select": "*",
            "user_id": f"eq.{user_id}",
            "order": "created_at.desc",
        },
    )

    if not wardrobe:
        return {
            "outfits": [],
            "message": "Your wardrobe is empty. Add clothing items to get suggestions.",
        }

    saved_preferences_rows = await supabase_request(
        "GET",
        "user_preferences",
        current_user,
        params={
            "select": (
                "preferred_colors,preferred_styles,"
                "usual_occasions,disliked_colors"
            ),
            "user_id": f"eq.{user_id}",
        },
    )
    saved_preferences = (
        saved_preferences_rows[0] if saved_preferences_rows else {}
    )

    engine_preferences = {
        "colors": saved_preferences.get("preferred_colors") or [],
        "styles": saved_preferences.get("preferred_styles") or [],
        "usual_occasions": saved_preferences.get("usual_occasions") or [],
        "disliked_colors": saved_preferences.get("disliked_colors") or [],
    }

    try:
        recommendations = recommend_outfits(
            wardrobe=wardrobe,
            occasion=occasion,
            limit=limit,
            weather=weather,
            user_preferences=engine_preferences,
            recent_outfits=recent_outfits,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )

    if not recommendations:
        return {
            "outfits": [],
            "message": (
                f"No complete outfit matches '{occasion}'. Add a top and bottom "
                "or a dress, plus shoes tagged for that occasion."
            ),
        }

    items_by_id = {
        str(item["id"]): item
        for item in wardrobe
        if item.get("id") is not None
    }

    outfits = []
    for recommendation in recommendations:
        outfit_items = []

        for item_id in recommendation.get("item_ids", []):
            item = items_by_id.get(str(item_id))
            if item is not None:
                outfit_items.append({
                    "id": str(item["id"]),
                    "name": item.get("name"),
                    "category": item.get("category"),
                    "color": item.get("color"),
                    "season": item.get("season"),
                    "occasion": item.get("occasion") or [],
                    "image_path": item.get("image_path"),
                })

        reasons = recommendation.get("reasons") or []
        outfits.append({
            **recommendation,
            "items": outfit_items,
            "reason": "; ".join(reasons[:3]),
        })

    return {"outfits": outfits, "message": None}