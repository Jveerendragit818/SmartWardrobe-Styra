from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.v1.routes.wardrobe import supabase_request
from app.core.auth import get_current_user
from app.schemas.profile import ProfileUpdate


router = APIRouter(prefix="/profile", tags=["profiles"])

PROFILE_FIELDS = "user_id,display_name,created_at,updated_at"


@router.get("")
async def read_profile(
    current_user: dict[str, str] = Depends(get_current_user),
):
    user_id = current_user["user_id"]

    rows = await supabase_request(
        "GET",
        "profiles",
        current_user,
        params={
            "select": PROFILE_FIELDS,
            "user_id": f"eq.{user_id}",
        },
    )

    if not rows:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found.",
        )

    return {"data": rows[0], "error": None}


@router.patch("")
async def update_profile(
    request: ProfileUpdate,
    current_user: dict[str, str] = Depends(get_current_user),
):
    payload = request.model_dump(exclude_unset=True)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provide a profile field to update.",
        )

    payload["updated_at"] = datetime.now(timezone.utc).isoformat()
    user_id = current_user["user_id"]

    rows = await supabase_request(
        "PATCH",
        "profiles",
        current_user,
        params={
            "user_id": f"eq.{user_id}",
            "select": PROFILE_FIELDS,
        },
        payload=payload,
        prefer="return=representation",
    )

    if not rows:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found.",
        )

    return {"data": rows[0], "error": None}