# Image Recognition API

## Endpoint

`POST /api/v1/recognition/predict`

Requires a Supabase access token in the `Authorization: Bearer <token>` header.

## Request

Send `multipart/form-data` with one required `file` field. Supported types are JPEG, PNG, and WEBP. Maximum file size is 5 MB.

## Successful response

HTTP `200`, returned in the project's standard `{ "data": ..., "error": null }` envelope.

The `data` object contains the model name, predicted attributes, user-confirmed attributes, and `review_required: true`. The current model returns category candidates named `LABEL_#`; those labels are unmapped. Color and pattern are unsupported, and season and occasion are not predicted. Scores are model outputs, not guarantees.

## Errors

- `401`: missing or invalid access token
- `400`: empty or invalid image
- `413`: image exceeds 5 MB
- `415`: unsupported media type

## Persistence

Recognition only analyzes the image and returns suggestions. It does not upload the image to Supabase Storage or save clothing attributes. The user must review and confirm attributes before saving a wardrobe item.
