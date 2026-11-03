import json
from pathlib import Path
from typing import Any

import torch
from PIL import Image
from transformers import AutoImageProcessor, AutoModelForImageClassification


MODEL_ID = "wargoninnovation/wargon-clothing-classifier"
SAMPLE_DIR = Path(__file__).resolve().parent / "samples"

# Load the model once so an API can reuse it for multiple images.
processor = AutoImageProcessor.from_pretrained(MODEL_ID)
model = AutoModelForImageClassification.from_pretrained(MODEL_ID)
model.eval()


def predict_clothing(
    image: Image.Image,
    image_path: str | None = None,
) -> dict[str, Any]:
    """Return clothing suggestions for an already-opened Pillow image."""

    if not isinstance(image, Image.Image):
        raise TypeError("image must be a Pillow Image")

    image_rgb = image.convert("RGB")
    inputs = processor(images=image_rgb, return_tensors="pt")

    with torch.inference_mode():
        logits = model(**inputs).logits[0]
        probabilities = torch.softmax(logits, dim=-1)

    top_count = min(3, probabilities.numel())
    top_scores, top_ids = torch.topk(probabilities, k=top_count)

    candidates = []
    for score, class_id in zip(top_scores.tolist(), top_ids.tolist()):
        label = model.config.id2label.get(class_id, f"LABEL_{class_id}")
        candidates.append({
            "label": label,
            "score": round(float(score), 3),
        })

    # The current model configuration returns LABEL_# names, not clothing names.
    predicted_attributes = {
        "category": {
            "value": None,
            "candidates": candidates,
            "status": "unmapped",
        },
        "color": {
            "value": None,
            "score": None,
            "status": "unsupported",
        },
        "pattern": {
            "value": None,
            "score": None,
            "status": "unsupported",
        },
        "season": {
            "value": None,
            "score": None,
            "status": "not_predicted",
        },
        "occasion": {
            "value": None,
            "score": None,
            "status": "not_predicted",
        },
    }

    result = {
        "model": MODEL_ID,
        "image_path": image_path,
        "predicted_attributes": predicted_attributes,
        "user_confirmed_attributes": {
            "category": None,
            "color": None,
            "pattern": None,
            "season": None,
            "occasion": None,
        },
        "review_required": True,
    }

    return result


def main() -> None:
    image_paths = sorted(
        path for path in SAMPLE_DIR.iterdir()
        if path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
    )

    if not image_paths:
        raise SystemExit("No JPG, JPEG, PNG, or WEBP images found in samples.")

    for image_path in image_paths:
        with Image.open(image_path) as source:
            result = predict_clothing(
                source,
                image_path=f"samples/{image_path.name}",
            )

        print(f"\nImage: {image_path.name}")
        print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()