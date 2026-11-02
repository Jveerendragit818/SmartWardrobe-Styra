# Authentication and Ownership

- Supabase Auth handles email and password sign-in.
- The frontend sends the signed-in user's Supabase access token to FastAPI using the Authorization Bearer header.
- FastAPI must verify the token before serving protected routes.
- Get the user ID from the verified token's `sub` claim. Never trust a user ID supplied freely in a request.
- Verify Supabase JWTs with the project's JWKS when using asymmetric signing keys. For legacy symmetric tokens, use Supabase Auth's server-side user verification rather than exposing the signing secret.
- Row Level Security is enabled on `profiles` and `clothing_items`; policies restrict rows to the authenticated user's ID.
- If the backend uses a Supabase secret/service-role key, it bypasses RLS. Keep it server-side and enforce ownership checks in FastAPI.
- Never commit database passwords, Supabase secret keys, or access tokens.
