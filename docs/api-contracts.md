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

## Day 8 API work

### Confirmed backend conventions
- Protected routes use the signed-in user's ID from `get_current_user` for ownership checks.
- Do not trust a user ID supplied in the request body.
- Successful responses use the envelope `{"data": ..., "error": null}`.

### Trip-planning API
- Not implemented yet.
- Confirm the trip request and response fields with Member 1 and the trip database tables with Member 5 before implementation.
- Do not save trip or packing-list data until the table and ownership contract is confirmed.

### Admin analytics API
- Not implemented yet.
- `get_current_user` verifies a signed-in user and provides the user's ID and access token; it does not provide an admin role.
- Confirm the server-verified admin authorization rule and analytics fields/response contract with the team before implementation.
- Do not authorize admin access using a client-supplied role.
