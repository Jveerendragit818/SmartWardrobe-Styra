from fastapi import APIRouter
from app.api.v1.routes import profiles, recognition, wardrobe

api_router = APIRouter()
api_router.include_router(profiles.router)
api_router.include_router(wardrobe.router)
api_router.include_router(recognition.router)
