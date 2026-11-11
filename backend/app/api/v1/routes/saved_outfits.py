
from uuid import UUID

from fastapi import APIRouter, Depends, status

from app.core.auth import get_current_user
from app.schemas.saved_outfit import SavedOutfitCreate
from app.services.saved_outfit_service import (
    create_saved_outfit,
    list_saved_outfits,
    delete_saved_outfit,
)


router = APIRouter(
    prefix="/saved-outfits",
    tags=["saved outfits"],
)


@router.post("", status_code=status.HTTP_201_CREATED)
async def save_outfit(
    request: SavedOutfitCreate,
    current_user: dict = Depends(get_current_user),
):
    outfit = await create_saved_outfit(
        current_user=current_user,
        title=request.title,
        item_ids=request.item_ids,
    )

    return {"data": outfit, "error": None}


@router.get("")
async def get_saved_outfits(
    current_user: dict = Depends(get_current_user),
):
    outfits = await list_saved_outfits(current_user)

    return {"data": outfits, "error": None}


@router.delete("/{outfit_id}")
async def remove_saved_outfit(
    outfit_id: UUID,
    current_user: dict = Depends(get_current_user),
):
    result = await delete_saved_outfit(
        current_user=current_user,
        outfit_id=str(outfit_id),
    )

    return {"data": result, "error": None}
