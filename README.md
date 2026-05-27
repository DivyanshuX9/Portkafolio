# Portkafolio

Portfolio site for Divyanshu Sharma with a React/TanStack frontend and a small FastAPI backend for profile data.

## What is here

- `src/` - TanStack React frontend for the portfolio
- `backend/` - FastAPI profile service for GitHub and LinkedIn metadata
- `src/assests/` - uploaded resume assets used for content reference

## Frontend

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

## Backend

```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

## Environment

Frontend env examples are in `.env.example`.

Backend env examples are in `backend/.env.example`.

Useful backend variables:

- `GITHUB_USERNAME`
- `GITHUB_TOKEN`
- `LINKEDIN_PROFILE_URL`

## Notes

LinkedIn does not provide a broadly public unauthenticated profile API, so the backend uses a configurable public profile URL fallback.

The site is tuned for a bright white light theme with scoped white surfaces on richer content cards.
