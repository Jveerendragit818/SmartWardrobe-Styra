from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.v1.routes.wardrobe import supabase_request
from app.core.auth import get_current_user
from app.schemas.preferences import PreferencesUpdate


router = APIRouter(prefix="/preferences", tags=["preferences"])


@router.get("")
async def read_preferences(
    current_user: dict[str, str] = Depends(get_current_user),
):
    user_id = current_user["user_id"]

    rows = await supabase_request(
        "GET",
        "user_preferences",
        current_user,
        params={
            "select": "*",
            "user_id": f"eq.{user_id}",
        },
    )

    preferences = rows[0] if rows else {
        "user_id": user_id,
        "preferred_colors": [],
        "preferred_styles": [],
        "usual_occasions": [],
        "disliked_colors": [],
        "created_at": None,
        "updated_at": None,
    }

    return {"data": preferences, "error": None}


@router.put("")
async def save_preferences(
    request: PreferencesUpdate,
    current_user: dict[str, str] = Depends(get_current_user),
):
    payload = request.model_dump()
    payload["user_id"] = current_user["user_id"]
    payload["updated_at"] = datetime.now(timezone.utc).isoformat()

    rows = await supabase_request(
        "POST",
        "user_preferences",
        current_user,
        params={"on_conflict": "user_id"},
        payload=payload,
        prefer="resolution=merge-duplicates,return=representation",
    )

    if not rows:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Preferences could not be saved.",
        )

    return {"data": rows[0], "error": None}