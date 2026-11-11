"""
Packing service for SmartWardrobe.
Member 5 - Day 8

Loads the authenticated user's wardrobe and generates
trip packing suggestions.
"""

from ai.packing.engine import generate_packing_suggestions
from app.api.v1.routes.wardrobe import supabase_request


WARDROBE_FIELDS = (
    "id,name,category,color,season,occasion,image_path"
)


async def get_packing_suggestions(
    current_user: dict[str, str],
    trip_days: int,
    occasion: str | None = None,
    season: str | None = None,
):
    """
    Generate packing suggestions using only the current
    authenticated user's wardrobe.
    """

    user_id = current_user["user_id"]

    wardrobe = await supabase_request(
        "GET",
        "clothing_items",
        current_user,
        params={
            "select": WARDROBE_FIELDS,
            "user_id": f"eq.{user_id}",
            "order": "created_at.desc",
        },
    )

    return generate_packing_suggestions(
        wardrobe=wardrobe or [],
        trip_days=trip_days,
        occasion=occasion,
        season=season,
    )