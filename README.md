# X9 Portfolio

Personal portfolio site for Divyanshu Sharma. The project pairs a TanStack React frontend with a small FastAPI backend that powers profile data, calendar availability, and booking notifications.

## What this app does

- Presents the portfolio UI, case studies, experience, notes, and skills.
- Pulls GitHub profile and contribution data for the live profile section.
- Uses a lightweight Python API for public profile metadata and booking/calendar support.
- Supports a light and dark theme toggle with animated transitions.

## Project Structure

- `src/` - TanStack React frontend
- `backend/` - FastAPI backend for profile and booking utilities
- `src/assests/` - images, logos, and imported portfolio assets
- `src/components/site/` - section-level UI for the portfolio
- `src/routes/` - TanStack Router route definitions

## Frontend Setup

Install dependencies and run the app:

```bash
npm install
npm run dev
```

Run the frontend and backend together:

```bash
npm run dev:all
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Backend Setup

The backend lives in `backend/` and is a separate FastAPI app.

```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

The backend loads `backend/.env` automatically when present.

## Environment Variables

Frontend:

- `VITE_GITHUB_USERNAME`
- `VITE_GITHUB_API_BASE`
- `VITE_BACKEND_URL`
- `VITE_GOOGLE_CALENDAR_ID`
- `VITE_GOOGLE_CALENDAR_API_KEY`

Backend:

- `GITHUB_USERNAME`
- `GITHUB_TOKEN`
- `LINKEDIN_PROFILE_URL`
- `RESEND_API_KEY`
- `MAILER_FROM_EMAIL`
- `BOOKING_NOTIFICATION_EMAIL`
- `GOOGLE_CALENDAR_ID`
- `GOOGLE_CALENDAR_API_KEY`

## API Overview

The backend follows a simple split:

- `GET` endpoints return data.
- `POST` endpoints submit or trigger an action.

### Read-only `GET` endpoints

#### `GET /health`

Returns a basic health check.

Example:

```bash
curl http://localhost:8000/health
```

#### `GET /profile/github`

Returns GitHub profile details plus recent owned repositories.

What it includes:

- username, display name, bio, avatar, and profile URL
- follower and repository counts
- recent repositories with stars, forks, language, and update time

Example:

```bash
curl http://localhost:8000/profile/github
```

#### `GET /profile/linkedin`

Fetches metadata from the configured public LinkedIn profile URL.

What it includes:

- configured profile URL
- fetched page title and description when available
- resolved final URL after redirects

Example:

```bash
curl http://localhost:8000/profile/linkedin
```

#### `GET /profile`

Convenience endpoint that combines GitHub and LinkedIn profile data.

Example:

```bash
curl http://localhost:8000/profile
```

#### `GET /calendar/availability`

Checks available booking slots for a given day.

Query parameters:

- `date` in ISO format, for example `2026-06-01`
- `time_zone` optional, defaults to `UTC`

Example:

```bash
curl "http://localhost:8000/calendar/availability?date=2026-06-01&time_zone=Asia/Kolkata"
```

Response fields:

- `date`
- `time_zone`
- `available_slots`
- `busy_slots`
- `events_count`

### Action `POST` endpoint

#### `POST /booking/notify`

Sends a booking notification email through Resend.

Request body:

```json
{
  "name": "Guest",
  "email": "guest@example.com",
  "date": "2026-06-01",
  "time": "10:30",
  "topic": "Portfolio intro",
  "time_zone": "Asia/Kolkata",
  "meeting_url": "https://meet.google.com/xxx-xxxx-xxx"
}
```

Example:

```bash
curl -X POST http://localhost:8000/booking/notify \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Guest",
    "email":"guest@example.com",
    "date":"2026-06-01",
    "time":"10:30",
    "topic":"Portfolio intro",
    "time_zone":"Asia/Kolkata",
    "meeting_url":"https://meet.google.com/xxx-xxxx-xxx"
  }'
```

Validation notes:

- `email` is optional, but if supplied it must be valid.
- The backend returns a `503` if Resend is not configured.
- Booking data is sent as a notification message rather than being stored in a database.

## Notes

- GitHub contribution data is read from the public GitHub API or the configured proxy base.
- LinkedIn is handled through a configurable public profile URL because LinkedIn does not provide a simple public unauthenticated profile API.
- If you want richer booking workflows, the calendar and notification endpoints are the place to extend.

## Development Tips

- `npm run dev:all` is the easiest way to work on the full stack locally.
- Use `backend/.env` for Python-only secrets and `.env` for frontend runtime values.
- The portfolio is tuned for a bright editorial look with light surfaces and strong contrast.
