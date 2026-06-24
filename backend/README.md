# Backend

FastAPI service for public profile data.

## Endpoints

- `GET /health`
- `GET /profile/github`
- `GET /profile/linkedin`
- `GET /profile`
- `POST /booking/notify`

## Run

```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

The backend loads `backend/.env` automatically when present, so you can paste local secrets there.

## Notes

GitHub data is fetched from the public GitHub REST API.
Set `GITHUB_TOKEN` if you want higher rate limits and more reliable access.

LinkedIn is exposed through a configurable public profile URL because LinkedIn does not provide a broadly public unauthenticated profile API.
If you need richer LinkedIn data, you will need an approved OAuth/API path or a manual data source.

Cal.com can be added as another backend endpoint once you decide which Cal.com API resource you want to display, then store its key in `CALCOM_API_KEY` and its account identifier in `CALCOM_USERNAME` or a similar env var.

Booking email notifications use Web3Forms. Set `WEB3FORMS_API_KEY` and `BOOKING_NOTIFICATION_EMAIL` before enabling the schedule page booking flow.
If your Google Calendar ID is stored as an embed URL, the backend will normalize the `src` value automatically.

To enable calendar availability on the schedule page, add these to `backend/.env` and restart the backend:

- `GOOGLE_CALENDAR_ID`
- `GOOGLE_CALENDAR_API_KEY`
- `GOOGLE_CALENDAR_ACCESS_TOKEN` or `GOOGLE_OAUTH_ACCESS_TOKEN` if the calendar is private

If the calendar is private, a plain API key is usually not enough. Use an OAuth access token with read access to the calendar, or make the calendar publicly readable if that matches your privacy needs.
