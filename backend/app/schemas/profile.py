from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ProfileUpdate(BaseModel):
    display_name: str | None = None


class ProfileResponse(BaseModel):
    user_id: UUID
    display_name: str | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
