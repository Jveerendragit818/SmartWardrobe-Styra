
from fastapi import APIRouter

from app.api.v1.routes import (
    profiles,
    recognition,
    wardrobe,
    recommendations,
    preferences,
    chatbot,
)

api_router = APIRouter()

# Profile management
api_router.include_router(profiles.router)

# Wardrobe management
api_router.include_router(wardrobe.router)

# Clothing recognition
api_router.include_router(recognition.router)

# Outfit recommendations
api_router.include_router(recommendations.router)

# User preference management
api_router.include_router(preferences.router)

# AI fashion chatbot
api_router.include_router(chatbot.router)
