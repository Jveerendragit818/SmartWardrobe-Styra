from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator

from ai.vision.normalization import normalize_attribute


CONFIRMED_FIELDS = {"category", "color"}


def normalize_confirmed_attributes(value: dict | None) -> dict[str, str]:
    """Keep only explicitly supplied, supported, normalized confirmations."""
    if value is None:
        return {}

    if not isinstance(value, dict):
        raise ValueError("confirmed_attributes must be an object.")

    normalized: dict[str, str] = {}

    for field, raw_value in value.items():
        # Season, occasion, and other fields are not part of this contract yet.
        if field not in CONFIRMED_FIELDS:
            continue

        result = normalize_attribute(
            field,
            raw_value,
            user_confirmed=True,
        )

        if result["status"] == "normalized" and result["value"]:
            normalized[field] = result["value"]

    return normalized


class ClothingItemCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    category: str = Field(min_length=1, max_length=50)
    color: str | None = None
    pattern: str | None = None
    season: str | None = None
    occasion: list[str] = Field(default_factory=list)
    image_path: str | None = None
    confirmed_attributes: dict[str, str] = Field(default_factory=dict)

    @field_validator("confirmed_attributes")
    @classmethod
    def validate_confirmed_attributes(cls, value: dict) -> dict[str, str]:
        return normalize_confirmed_attributes(value)


class ClothingItemUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    category: str | None = Field(default=None, min_length=1, max_length=50)
    color: str | None = None
    pattern: str | None = None
    season: str | None = None
    occasion: list[str] | None = None
    image_path: str | None = None
    confirmed_attributes: dict[str, str] | None = None

    @field_validator("confirmed_attributes")
    @classmethod
    def validate_confirmed_attributes(
        cls,
        value: dict | None,
    ) -> dict[str, str]:
        return normalize_confirmed_attributes(value)


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
    confirmed_attributes: dict[str, str] = Field(default_factory=dict)
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)