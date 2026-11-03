import httpx
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.auth import get_current_user
from app.core.config import SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL
from app.schemas.clothing import ClothingItemCreate


router = APIRouter(prefix="/wardrobe", tags=["wardrobe"])


async def supabase_request(
    method: str,
    endpoint: str,
    current_user: dict[str, str],
    *,
    params: dict[str, str] | None = None,
    payload: dict | None = None,
    prefer: str | None = None,
):
    headers = {
        "apikey": SUPABASE_PUBLISHABLE_KEY,
        "Authorization": f"Bearer {current_user['access_token']}",
    }
    if prefer:
        headers["Prefer"] = prefer

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.request(
                method,
                f"{SUPABASE_URL}/rest/v1/{endpoint}",
                headers=headers,
                params=params,
                json=payload,
            )
    except httpx.RequestError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Could not reach Supabase.",
        )

    if response.status_code >= 400:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Supabase could not complete the wardrobe request.",
        )

    return response.json() if response.content else None


@router.get("")
async def list_wardrobe(
    current_user: dict[str, str] = Depends(get_current_user),
):
    rows = await supabase_request(
        "GET",
        "clothing_items",
        current_user,
        params={
            "select": "*",
            "user_id": f"eq.{current_user['user_id']}",
            "order": "created_at.desc",
        },
    )
    return {"data": rows, "error": None}


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_wardrobe_item(
    item: ClothingItemCreate,
    current_user: dict[str, str] = Depends(get_current_user),
):
    payload = item.model_dump(exclude_none=True)
    image_path = payload.get("image_path")

    if image_path and not image_path.startswith(f"{current_user['user_id']}/"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Image path must be inside the signed-in user's folder.",
        )

    payload["user_id"] = current_user["user_id"]

    rows = await supabase_request(
        "POST",
        "clothing_items",
        current_user,
        params={"select": "*"},
        payload=payload,
        prefer="return=representation",
    )
    return {"data": rows[0] if rows else None, "error": None}

from datetime import datetime, timezone
from uuid import UUID

from app.schemas.clothing import ClothingItemUpdate


@router.patch("/{item_id}")
async def update_wardrobe_item(
    item_id: UUID,
    item: ClothingItemUpdate,
    current_user: dict[str, str] = Depends(get_current_user),
):
    payload = item.model_dump(exclude_unset=True)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provide at least one field to update.",
        )

    if any(payload.get(field) is None for field in ("name", "category") if field in payload):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Name and category cannot be empty.",
        )

    image_path = payload.get("image_path")
    if image_path and not image_path.startswith(f"{current_user['user_id']}/"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Image path must be inside the signed-in user's folder.",
        )

    payload["updated_at"] = datetime.now(timezone.utc).isoformat()

    rows = await supabase_request(
        "PATCH",
        "clothing_items",
        current_user,
        params={
            "id": f"eq.{item_id}",
            "user_id": f"eq.{current_user['user_id']}",
            "select": "*",
        },
        payload=payload,
        prefer="return=representation",
    )

    if not rows:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wardrobe item not found.",
        )

    return {"data": rows[0], "error": None}


@router.delete("/{item_id}")
async def delete_wardrobe_item(
    item_id: UUID,
    current_user: dict[str, str] = Depends(get_current_user),
):
    rows = await supabase_request(
        "DELETE",
        "clothing_items",
        current_user,
        params={
            "id": f"eq.{item_id}",
            "user_id": f"eq.{current_user['user_id']}",
            "select": "id",
        },
        prefer="return=representation",
    )

    if not rows:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wardrobe item not found.",
        )

    return {"data": {"deleted": True, "id": str(item_id)}, "error": None}

from urllib.parse import quote
from uuid import uuid4

from fastapi import File, UploadFile


ALLOWED_IMAGE_TYPES = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
}
MAX_IMAGE_BYTES = 5 * 1024 * 1024


@router.post("/images", status_code=status.HTTP_201_CREATED)
async def upload_wardrobe_image(
    file: UploadFile = File(...),
    current_user: dict[str, str] = Depends(get_current_user),
):
    content_type = (file.content_type or "").lower()
    extension = ALLOWED_IMAGE_TYPES.get(content_type)

    if not extension:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Upload a JPEG, PNG, or WebP image.",
        )

    contents = await file.read(MAX_IMAGE_BYTES + 1)
    if not contents:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded image is empty.",
        )
    if len(contents) > MAX_IMAGE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="The image must be 5 MB or smaller.",
        )

    image_id = uuid4()
    image_path = (
        f"{current_user['user_id']}/{image_id}/image.{extension}"
    )
    encoded_path = quote(image_path, safe="/")

    headers = {
        "apikey": SUPABASE_PUBLISHABLE_KEY,
        "Authorization": f"Bearer {current_user['access_token']}",
        "Content-Type": content_type,
        "x-upsert": "false",
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{SUPABASE_URL}/storage/v1/object/"
                f"wardrobe-images/{encoded_path}",
                headers=headers,
                content=contents,
            )
    except httpx.RequestError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Could not reach Supabase Storage.",
        )

    if response.status_code >= 400:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Supabase Storage rejected the upload.",
        )

    return {
        "data": {
            "image_path": image_path,
            "bucket": "wardrobe-images",
        },
        "error": None,
    }
