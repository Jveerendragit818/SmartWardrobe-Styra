
from pydantic import BaseModel, Field


class RecommendationRequest(BaseModel):
    occasion: str = Field(default="college", min_length=1)
    limit: int = Field(default=5, ge=1, le=20)
    weather: dict | None = None
    user_preferences: dict | None = None
    recent_outfits: list[list[str]] | None = None
