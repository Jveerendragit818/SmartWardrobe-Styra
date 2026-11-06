
from fastapi import APIRouter

from app.api.v1.routes import (
    profiles,
    recognition,
    wardrobe,
    recommendations,
    chatbot,
)

api_router = APIRouter()

api_router.include_router(profiles.router)
api_router.include_router(wardrobe.router)
api_router.include_router(recognition.router)
api_router.include_router(recommendations.router)
api_router.include_router(chatbot.router)
