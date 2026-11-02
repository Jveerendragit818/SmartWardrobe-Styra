# API Contract

## Base paths
- Health check: `GET /health`
- Application routes: `/api/v1`

## Planned profile routes
- `GET /api/v1/profile` - Get the signed-in user's profile.
- `PATCH /api/v1/profile` - Update the signed-in user's profile.

## Planned wardrobe routes
- `GET /api/v1/wardrobe` - List the signed-in user's clothing items.
- `POST /api/v1/wardrobe` - Add a clothing item.

Protected routes require `Authorization: Bearer <Supabase access token>`.
