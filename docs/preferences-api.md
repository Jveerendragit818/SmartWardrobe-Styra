# Preferences API

All endpoints require a Supabase access token in the `Authorization: Bearer <token>` header. The server uses the signed-in user's ID; clients must not provide `user_id`.

## GET /api/v1/preferences

Returns the signed-in user's saved preferences.

If no row exists yet, returns empty lists. `created_at` and `updated_at` are `null` until preferences are saved.

## PUT /api/v1/preferences

Creates or replaces the signed-in user's preference lists. Send all four lists:

```json
{
  "preferred_colors": ["blue", "black"],
  "preferred_styles": ["casual"],
  "usual_occasions": ["college"],
  "disliked_colors": ["orange"]
}
```

Values are trimmed and lowercased. Each list may contain up to 20 strings, each up to 40 characters. Unexpected fields and invalid values return `422`.

## Response

Responses use the project's `{ "data": ..., "error": null }` envelope. The data includes the signed-in user's ID, preference lists, and timestamps.

## Ownership and security

The server sets `user_id` from the authenticated session. Row Level Security limits access to the signed-in user's row in `public.user_preferences`.

## Errors

- `401`: missing or invalid access token
- `422`: invalid request body
- `502`: Supabase could not complete the request