from io import BytesIO

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError

from ai.vision.inference import predict_clothing
from app.core.auth import get_current_user


router = APIRouter(prefix="/recognition", tags=["recognition"])

MAX_IMAGE_BYTES = 5 * 1024 * 1024
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}


@router.post("/predict")
async def predict_image(
    file: UploadFile = File(...),
    _current_user: dict[str, str] = Depends(get_current_user),
):
    content_type = (file.content_type or "").lower()
    if content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=415,
            detail="Upload a JPEG, PNG, or WEBP image.",
        )

    image_bytes = await file.read(MAX_IMAGE_BYTES + 1)
    await file.close()

    if not image_bytes:
        raise HTTPException(status_code=400, detail="The uploaded image is empty.")

    if len(image_bytes) > MAX_IMAGE_BYTES:
        raise HTTPException(
            status_code=413,
            detail="The image must be 5 MB or smaller.",
        )

    try:
        with Image.open(BytesIO(image_bytes)) as image:
            image.load()
            prediction = predict_clothing(image)
    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError):
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is not a valid supported image.",
        )

    return {"data": prediction, "error": None}
