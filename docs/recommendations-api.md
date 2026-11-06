# Recommendations API

## Endpoint

`POST /api/v1/recommendations`

Requires a Supabase access token in the `Authorization: Bearer <token>` header.

## Request

Send JSON with `occasion`, `limit` (1–20), and optional `weather` and `recent_outfits`.

```json
{
  "occasion": "casual",
  "limit": 5,
  "weather": {
    "season": "summer"
  }
}
```

Do not send `user_preferences`. The backend loads preferences from `public.user_preferences` for the signed-in user.

## Preference behavior

The service maps saved `preferred_colors` and `preferred_styles` to the keys used by the current recommendation engine. `usual_occasions` and `disliked_colors` are saved and passed through, but the current engine does not yet use them for scoring.

## Successful response

HTTP `200`, returned in the standard `{ "data": ..., "error": null }` envelope.

`data.outfits` contains ranked outfits with item IDs, scores, score components, reasons, and matching wardrobe item details. `data.message` is `null` when outfits are returned.

If the wardrobe is empty or no complete outfit matches, `data.outfits` is empty and `data.message` explains why.

A complete outfit needs either a top and bottom, or a dress, plus shoes. A jacket is optional.

## Ownership and security

Wardrobe items and preferences are loaded for the authenticated user. Clients cannot choose another user's records by sending a `user_id` or preference object.

## Errors

- `401`: missing or invalid access token
- `400`: invalid recommendation input
- `422`: request body fails validation
- `502`: Supabase could not complete the request