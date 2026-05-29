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

Run the frontend and backend together:

```bash
npm run dev:all
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

The backend is small enough that it can be deployed separately from the frontend. For this FastAPI app, Vercel is possible only if you adapt it to a serverless Python function setup; otherwise a Python-friendly host is usually the simpler choice.

Booking email setup:

- `RESEND_API_KEY`
- `MAILER_FROM_EMAIL`
- `BOOKING_NOTIFICATION_EMAIL`

Frontend booking setup:

- `VITE_BACKEND_URL` if the frontend is not talking to `http://localhost:8000`

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
