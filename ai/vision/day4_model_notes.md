# Day 4 Model Notes

- Model: wargoninnovation/wargon-clothing-classifier
- Source: https://huggingface.co/wargoninnovation/wargon-clothing-classifier
- License listed on the model card: Apache 2.0
- Inference function: predict_clothing in inference.py
- Sample images tested: JPG/JPEG, PNG, and WEBP images in samples/
- Category limitation: the model returns LABEL_# values, so category names are unmapped.
- Unsupported attributes: color and pattern.
- Not predicted by this model: season and occasion.
- Review: predictions need user confirmation before saving.
- Scores: model scores, not guarantees of correctness.