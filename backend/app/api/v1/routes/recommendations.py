from fastapi import APIRouter, Depends

from app.core.auth import get_current_user
from app.schemas.recommendation import RecommendationRequest
from app.services.recommendation_service import get_recommendations


router = APIRouter(
    prefix="/recommendations",
    tags=["recommendations"],
)


@router.post("")
async def generate_recommendations(
    request: RecommendationRequest,
    current_user: dict = Depends(get_current_user),
):
    """Generate recommendations for the authenticated user."""

    recommendations = await get_recommendations(
        current_user=current_user,
        occasion=request.occasion,
        limit=request.limit,
        weather=request.weather,
        recent_outfits=request.recent_outfits,
    )

    return {
        "data": recommendations,
        "error": None,
    }