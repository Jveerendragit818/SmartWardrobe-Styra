# Recommendations API

## Endpoint

`POST /api/v1/recommendations`

Requires a Supabase access token in the `Authorization: Bearer <token>` header. The endpoint uses only the signed-in user's wardrobe items.

## Request

Send JSON with `occasion`, `limit` (1–20), and optional `weather`, `user_preferences`, and `recent_outfits`.

Example:

```json
{
  "occasion": "casual",
  "limit": 5,
  "weather": {
    "season": "summer"
  }
}

```

## Successful response

HTTP `200`. The standard response envelope contains `data` and `error.

`data.outfits` contains ranked outfits with item IDs, scores, reasons, and wardrobe item details. `data.message` is `null` when outfits are returned.

If the wardrobe is empty or no complete outfit matches, `data.outfits` is empty and `data.message` explains why.

A complete outfit needs either a top and bottom, or a dress, plus shoes. A jacket is optional.

## Errors

- `401`: missing or invalid access token
- `400`: invalid recommendation input
- `422`: request body fails validation
