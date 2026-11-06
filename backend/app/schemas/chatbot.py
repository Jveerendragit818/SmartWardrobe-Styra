
from pydantic import BaseModel, Field


class ChatbotRequest(BaseModel):
    message: str = Field(
        min_length=1,
        max_length=1000,
        description="Fashion-related message from the user.",
    )
