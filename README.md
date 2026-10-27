# SmartWardrobe

AI-powered digital wardrobe and fashion recommendation platform.

Users add clothes they own and receive outfit suggestions based on occasion, weather, personal preferences, and wear history. Clothing images are analyzed with computer vision, and users can review and correct the suggested attributes.

## Technology stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Python, FastAPI
- Database, authentication, and image storage: Supabase
- AI: pretrained clothing recognition and a rule-based recommendation engine
- Collaboration: Git and GitHub

## Project structure

- `frontend/` — web application
- `backend/` — API and business logic
- `ai/vision/` — clothing image analysis
- `ai/recommendations/` — outfit recommendation logic
- `ai/chatbot/` — wardrobe-aware fashion assistant
- `database/schema/` — database design
- `database/migrations/` — database changes
- `docs/` — project and setup documentation

## Security

Do not commit passwords, API keys, tokens, or database credentials. Keep local secrets in `.env`; use `.env.example` to document required variable names.
