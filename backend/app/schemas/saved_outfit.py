from uuid import UUID

from pydantic import BaseModel, Field, field_validator


class SavedOutfitCreate(BaseModel):
    title: str | None = Field(default=None, max_length=100)
    item_ids: list[UUID] = Field(min_length=1, max_length=20)

    @field_validator("title")
    @classmethod
    def clean_title(cls, value):
        if value is not None:
            value = value.strip()
            return value or None
        return value

    @field_validator("item_ids")
    @classmethod
    def unique_item_ids(cls, value):
        if len(value) != len(set(value)):
            raise ValueError("Duplicate clothing item IDs are not allowed.")
        return value
