from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ClothingItemCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    category: str = Field(min_length=1, max_length=50)
    color: str | None = None
    pattern: str | None = None
    season: str | None = None
    occasion: list[str] = Field(default_factory=list)
    image_path: str | None = None


class ClothingItemUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    category: str | None = Field(default=None, min_length=1, max_length=50)
    color: str | None = None
    pattern: str | None = None
    season: str | None = None
    occasion: list[str] | None = None
    image_path: str | None = None


class ClothingItemResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    category: str
    color: str | None = None
    pattern: str | None = None
    season: str | None = None
    occasion: list[str]
    image_path: str | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
