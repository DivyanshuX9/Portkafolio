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
The schedule page now uses Cal.com for live booking, so you only need the Cal.com username for the public booking link.
If you still want to keep the optional booking notification email, continue using Web3Forms as before.
