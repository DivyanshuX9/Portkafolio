from __future__ import annotations

import os
import re
import base64
from dataclasses import dataclass
from datetime import date as date_cls, datetime, time as time_cls, timedelta, timezone
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs, quote, unquote, urlparse
from zoneinfo import ZoneInfo

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


def _load_local_env_file() -> None:
    env_path = Path(__file__).with_name(".env")
    if not env_path.exists():
        return

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


def _get_env(*keys: str, default: str | None = None) -> str | None:
    for key in keys:
        value = os.getenv(key)
        if value:
            return value
    return default


def _is_valid_email(value: str) -> bool:
    return bool(re.fullmatch(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", value))


def _parse_event_time(value: str, fallback_tz: timezone | ZoneInfo) -> datetime:
    normalized = value.replace("Z", "+00:00")
    parsed = datetime.fromisoformat(normalized)
    if parsed.tzinfo is None:
        return parsed.replace(tzinfo=fallback_tz)
    return parsed.astimezone(fallback_tz)


def _slot_range_for_day(day: date_cls, slot: str, tzinfo: timezone | ZoneInfo) -> tuple[datetime, datetime]:
    hours, minutes = map(int, slot.split(":"))
    start = datetime.combine(day, time_cls(hours, minutes), tzinfo=tzinfo)
    end = start + timedelta(minutes=30)
    return start, end


def _normalize_google_calendar_id(value: str | None) -> str | None:
    if not value:
        return None

    trimmed = value.strip()
    if not trimmed:
        return None

    if trimmed.startswith("http://") or trimmed.startswith("https://"):
        parsed = urlparse(trimmed)
        query = parse_qs(parsed.query)
        src = query.get("src", [None])[0]
        if src:
            return unquote(src)

        cid = query.get("cid", [None])[0]
        if cid:
            normalized_cid = unquote(cid)
            padding = "=" * (-len(normalized_cid) % 4)
            try:
                decoded = base64.urlsafe_b64decode(f"{normalized_cid}{padding}")
                decoded_text = decoded.decode("utf-8").strip()
                if decoded_text:
                    return decoded_text
            except Exception:
                return normalized_cid

    return trimmed


_load_local_env_file()

GITHUB_USERNAME = os.getenv("GITHUB_USERNAME", "DivyanshuX9")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
LINKEDIN_PROFILE_URL = os.getenv(
    "LINKEDIN_PROFILE_URL",
    "https://www.linkedin.com/in/mr-divyanshu",
)
BOOKING_NOTIFICATION_EMAIL = os.getenv(
    "BOOKING_NOTIFICATION_EMAIL",
    "symdromearmy@gmail.com",
)
WEB3FORMS_API_KEY = _get_env("WEB3FORMS_API_KEY", "web3forms_api_key")
GOOGLE_CALENDAR_ID = _normalize_google_calendar_id(
    _get_env(
        "GOOGLE_CALENDAR_ID",
        "VITE_GOOGLE_CALENDAR_ID",
        "google_calendar_id",
        "googlecalenderid",
        "googlecalanderid",
    ),
)
GOOGLE_CALENDAR_API_KEY = _get_env(
    "GOOGLE_CALENDAR_API_KEY",
    "VITE_GOOGLE_CALENDAR_API_KEY",
    "google_calendar_api_key",
    "googlecalanderapi",
)
GOOGLE_CALENDAR_ACCESS_TOKEN = _get_env(
    "GOOGLE_CALENDAR_ACCESS_TOKEN",
    "GOOGLE_OAUTH_ACCESS_TOKEN",
    "google_calendar_access_token",
)
GITHUB_API_BASE = "https://api.github.com"
TIME_SLOTS = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"]


class BookingNotificationPayload(BaseModel):
    name: str = "Guest"
    email: str | None = None
    date: str
    time: str
    section: str
    topic: str
    subject: str
    body: str
    time_zone: str | None = None
    meeting_url: str


class CalendarAvailabilityPayload(BaseModel):
    date: str
    time_zone: str | None = None


@dataclass(frozen=True)
class SlotAvailability:
    busy_slots: list[str]
    available_slots: list[str]
    events_count: int


def _availability_for_events(
    selected_day: date_cls,
    tzinfo: timezone | ZoneInfo,
    events: list[dict[str, Any]],
) -> SlotAvailability:
    busy_slots: list[str] = []

    for slot in TIME_SLOTS:
        slot_start, slot_end = _slot_range_for_day(selected_day, slot, tzinfo)

        for event in events:
            start_info = event.get("start", {})
            end_info = event.get("end", {})

            if "date" in start_info:
                busy_slots.append(slot)
                break

            event_start_raw = start_info.get("dateTime")
            event_end_raw = end_info.get("dateTime")
            if not event_start_raw or not event_end_raw:
                continue

            event_start = _parse_event_time(event_start_raw, tzinfo)
            event_end = _parse_event_time(event_end_raw, tzinfo)

            if event_start < slot_end and event_end > slot_start:
                busy_slots.append(slot)
                break

    available_slots = [slot for slot in TIME_SLOTS if slot not in busy_slots]
    return SlotAvailability(
        busy_slots=busy_slots,
        available_slots=available_slots,
        events_count=len(events),
    )


async def _fetch_google_calendar_events(
    selected_day: date_cls,
    tzinfo: timezone | ZoneInfo,
) -> list[dict[str, Any]]:
    if not GOOGLE_CALENDAR_ID:
        raise HTTPException(
            status_code=503,
            detail="Google Calendar ID is not configured.",
        )

    calendar_url = (
        f"https://www.googleapis.com/calendar/v3/calendars/"
        f"{quote(GOOGLE_CALENDAR_ID, safe='')}/events"
    )

    day_start = datetime.combine(selected_day, time_cls.min, tzinfo=tzinfo)
    day_end = day_start + timedelta(days=1)

    params = {
        "timeMin": day_start.isoformat(),
        "timeMax": day_end.isoformat(),
        "singleEvents": "true",
        "orderBy": "startTime",
        "maxResults": "250",
    }

    headers: dict[str, str] = {"Accept": "application/json"}
    if GOOGLE_CALENDAR_ACCESS_TOKEN:
        headers["Authorization"] = f"Bearer {GOOGLE_CALENDAR_ACCESS_TOKEN}"
    elif GOOGLE_CALENDAR_API_KEY:
        params["key"] = GOOGLE_CALENDAR_API_KEY
    else:
        raise HTTPException(
            status_code=503,
            detail="Google Calendar API key or access token is not configured.",
        )

    async with httpx.AsyncClient(timeout=15.0, headers=headers) as client:
        response = await client.get(calendar_url, params=params)

    if response.status_code in {401, 403}:
        raise HTTPException(
            status_code=503,
            detail=(
                "Google Calendar access was rejected. For private calendars, set "
                "GOOGLE_CALENDAR_ACCESS_TOKEN with OAuth access. For public calendars, "
                "confirm the API key and calendar permissions."
            ),
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="Unable to fetch Google Calendar availability.",
        )

    return response.json().get("items", [])

app = FastAPI(title="Divyanshu Profile API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/profile/github")
async def github_profile() -> dict[str, Any]:
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "DivyanshuProfileAPI/1.0",
    }
    if GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"

    async with httpx.AsyncClient(timeout=15.0, headers=headers) as client:
        profile_response = await client.get(f"{GITHUB_API_BASE}/users/{GITHUB_USERNAME}")
        if profile_response.status_code != 200:
            raise HTTPException(
                status_code=profile_response.status_code,
                detail="Unable to fetch GitHub profile.",
            )

        repos_response = await client.get(
            f"{GITHUB_API_BASE}/users/{GITHUB_USERNAME}/repos",
            params={"sort": "updated", "per_page": 6, "type": "owner"},
        )
        if repos_response.status_code != 200:
            raise HTTPException(
                status_code=repos_response.status_code,
                detail="Unable to fetch GitHub repositories.",
            )

    profile = profile_response.json()
    repos = repos_response.json()

    return {
        "username": GITHUB_USERNAME,
        "name": profile.get("name"),
        "bio": profile.get("bio"),
        "location": profile.get("location"),
        "avatar_url": profile.get("avatar_url"),
        "html_url": profile.get("html_url"),
        "blog": profile.get("blog"),
        "followers": profile.get("followers"),
        "following": profile.get("following"),
        "public_repos": profile.get("public_repos"),
        "updated_at": profile.get("updated_at"),
        "repos": [
            {
                "name": repo.get("name"),
                "description": repo.get("description"),
                "html_url": repo.get("html_url"),
                "language": repo.get("language"),
                "stargazers_count": repo.get("stargazers_count"),
                "forks_count": repo.get("forks_count"),
                "updated_at": repo.get("updated_at"),
            }
            for repo in repos
        ],
    }


@app.get("/profile/linkedin")
async def linkedin_profile() -> dict[str, Any]:
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    }

    result: dict[str, Any] = {
        "profile_url": LINKEDIN_PROFILE_URL,
        "source": "public-profile-url",
    }

    try:
        async with httpx.AsyncClient(timeout=15.0, headers=headers, follow_redirects=True) as client:
            response = await client.get(LINKEDIN_PROFILE_URL)
        result["status_code"] = response.status_code
        result["title"] = _extract_meta(response.text, "title")
        result["description"] = _extract_meta(response.text, "description")
        result["html_url"] = str(response.url)
    except httpx.HTTPError as exc:
        result["error"] = f"LinkedIn fetch unavailable: {exc.__class__.__name__}"

    return result


@app.get("/profile")
async def profile_summary() -> dict[str, Any]:
    github = await github_profile()
    linkedin = await linkedin_profile()
    return {"github": github, "linkedin": linkedin}


@app.get("/calendar/availability")
async def calendar_availability(date: str, time_zone: str | None = None) -> dict[str, Any]:
    try:
        selected_day = datetime.fromisoformat(date).date()
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid date format.") from exc

    tz_name = time_zone or "UTC"
    try:
        tzinfo: timezone | ZoneInfo = ZoneInfo(tz_name)
    except Exception:
        tzinfo = timezone.utc
        tz_name = "UTC"

    events = await _fetch_google_calendar_events(selected_day, tzinfo)
    availability = _availability_for_events(selected_day, tzinfo, events)

    return {
        "date": date,
        "time_zone": tz_name,
        "available_slots": availability.available_slots,
        "busy_slots": availability.busy_slots,
        "events_count": availability.events_count,
    }


@app.post("/booking/notify")
async def booking_notify(payload: BookingNotificationPayload) -> dict[str, Any]:
    if not WEB3FORMS_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Booking mailer is not configured.",
        )

    if payload.email and not _is_valid_email(payload.email.strip()):
        raise HTTPException(status_code=400, detail="Invalid email address.")

    if payload.section.strip() == "":
        raise HTTPException(status_code=400, detail="Section is required.")
    if payload.subject.strip() == "":
        raise HTTPException(status_code=400, detail="Subject is required.")
    if payload.body.strip() == "":
        raise HTTPException(status_code=400, detail="Message body is required.")

    try:
        selected_day = datetime.fromisoformat(payload.date).date()
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid date format.") from exc

    if GOOGLE_CALENDAR_ID and GOOGLE_CALENDAR_API_KEY:
        availability = await _fetch_availability(selected_day, payload.time_zone)
        if payload.time not in availability.available_slots:
            raise HTTPException(status_code=409, detail="Selected slot is no longer available.")

    recipient_name = payload.name.strip() or "Guest"
    topic = payload.topic.strip() or "Meeting request"
    reply_to = payload.email.strip() if payload.email else None

    text_body = "\n".join(
        [
            "A meeting was scheduled from the portfolio site.",
            f"Name: {recipient_name}",
            f"Email: {reply_to or 'Not provided'}",
            f"Section: {payload.section.strip()}",
            f"Date: {payload.date}",
            f"Time: {payload.time}",
            f"Timezone: {payload.time_zone or 'Not provided'}",
            f"Topic: {topic}",
            f"Subject: {payload.subject.strip()}",
            f"Message: {payload.body.strip()}",
            f"Meeting link: {payload.meeting_url}",
        ],
    )

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.post(
            "https://api.web3forms.com/submit",
            headers={
                "Content-Type": "application/json",
            },
            json={
                "access_key": WEB3FORMS_API_KEY,
                "subject": f"New meeting request: {payload.subject.strip()}",
                "from_name": recipient_name,
                "name": recipient_name,
                "email": reply_to or BOOKING_NOTIFICATION_EMAIL,
                "replyto": reply_to or BOOKING_NOTIFICATION_EMAIL,
                "message": text_body,
                "section": payload.section.strip(),
                "topic": topic,
                "meeting_url": payload.meeting_url,
                "mail_subject": payload.subject.strip(),
                "mail_body": payload.body.strip(),
            },
        )

    if response.status_code not in {200, 202}:
        raise HTTPException(
            status_code=502,
            detail="Unable to send booking notification.",
        )

    data = response.json()
    if not data.get("success", True):
        raise HTTPException(status_code=502, detail=data.get("message") or "Unable to send booking notification.")

    return {"status": "sent", "message": data.get("message", "Notification delivered.")}


async def _fetch_availability(
    selected_day: date_cls,
    time_zone: str | None,
) -> SlotAvailability:
    tz_name = time_zone or "UTC"
    try:
        tzinfo: timezone | ZoneInfo = ZoneInfo(tz_name)
    except Exception:
        tzinfo = timezone.utc
        tz_name = "UTC"
    events = await _fetch_google_calendar_events(selected_day, tzinfo)
    busy_slots: list[str] = []

    for slot in TIME_SLOTS:
        slot_start, slot_end = _slot_range_for_day(selected_day, slot, tzinfo)

        for event in events:
            start_info = event.get("start", {})
            end_info = event.get("end", {})

            if "date" in start_info:
                busy_slots.append(slot)
                break

            event_start_raw = start_info.get("dateTime")
            event_end_raw = end_info.get("dateTime")
            if not event_start_raw or not event_end_raw:
                continue

            event_start = _parse_event_time(event_start_raw, tzinfo)
            event_end = _parse_event_time(event_end_raw, tzinfo)

            if event_start < slot_end and event_end > slot_start:
                busy_slots.append(slot)
                break

    available_slots = [slot for slot in TIME_SLOTS if slot not in busy_slots]

    return SlotAvailability(
        busy_slots=busy_slots,
        available_slots=available_slots,
        events_count=len(events),
    )


def _extract_meta(html: str, key: str) -> str | None:
    if key == "title":
        match = re.search(r"<title>(.*?)</title>", html, re.IGNORECASE | re.DOTALL)
        if match:
            return re.sub(r"\s+", " ", match.group(1)).strip()
        return None

    match = re.search(
        r'<meta[^>]+(?:name|property)=["\'](?:og:)?description["\'][^>]+content=["\'](.*?)["\']',
        html,
        re.IGNORECASE | re.DOTALL,
    )
    if match:
        return re.sub(r"\s+", " ", match.group(1)).strip()
    return None
