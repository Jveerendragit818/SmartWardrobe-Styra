"""
SmartWardrobe Recommendation Service.

Connects the authenticated user's Supabase wardrobe
with the rule-based recommendation engine.
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
    """Recommend explainable outfits from the signed-in user's items."""

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
        return {
            "outfits": [],
            "message": "Your wardrobe is empty. Add clothing items to get suggestions.",
        }

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
