
from fastapi import APIRouter, Depends

from app.core.auth import get_current_user
from app.schemas.chatbot import ChatbotRequest
from app.services.chatbot_service import get_chatbot_reply


router = APIRouter(
    prefix="/chatbot",
    tags=["chatbot"],
)


@router.post("/chat")
async def chat_with_styra(
    request: ChatbotRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Generate a fashion chatbot reply for the authenticated user.
    The backend retrieves the user's wardrobe; the client sends
    only the message.
    """

    result = await get_chatbot_reply(
        current_user=current_user,
        message=request.message,
    )

    return {
        "data": result,
        "error": None,
    }
