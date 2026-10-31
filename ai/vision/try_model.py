from pathlib import Path

import torch
from PIL import Image
from transformers import AutoImageProcessor, AutoModelForImageClassification

MODEL_ID = "wargoninnovation/wargon-clothing-classifier"
SAMPLE_DIR = Path("samples")

processor = AutoImageProcessor.from_pretrained(MODEL_ID)
model = AutoModelForImageClassification.from_pretrained(MODEL_ID)
print("Model label mapping:", model.config.id2label)  # :codex-annotation{index="1"}
model.eval()

image_paths = [
    path for path in SAMPLE_DIR.iterdir()
    if path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
]

if not image_paths:
    raise SystemExit(
        "No sample images found. Put JPG, PNG, or WEBP photos in ai/vision/samples."
    )

for image_path in image_paths:
    with Image.open(image_path) as source:
        image = source.convert("RGB")

    inputs = processor(images=image, return_tensors="pt")

    with torch.no_grad():
        logits = model(**inputs).logits[0]
        probabilities = torch.softmax(logits, dim=-1)

    top_scores, top_ids = torch.topk(probabilities, k=3)

    print(f"\nImage: {image_path.name}")
    for score, class_id in zip(top_scores.tolist(), top_ids.tolist()):
        label = model.config.id2label[class_id]
        print(f"  {label}: {score:.3f}")