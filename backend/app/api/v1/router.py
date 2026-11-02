from fastapi import APIRouter
from app.api.v1.routes import profiles

api_router = APIRouter()
api_router.include_router(profiles.router)
