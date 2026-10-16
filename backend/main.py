from __future__ import annotations

import os
import re
from pathlib import Path
from typing import Any

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
CALCOM_API_KEY = _get_env("CALCOM_API_KEY", "calcom_apikey")
if CALCOM_API_KEY and "=" in CALCOM_API_KEY:
    CALCOM_API_KEY = CALCOM_API_KEY.rsplit("=", 1)[-1]
CALCOM_USERNAME = _get_env("CALCOM_USERNAME", "VITE_CALCOM_USERNAME", default="divyanshu-sharmax9")
GITHUB_API_BASE = "https://api.github.com"


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

    try:
        async with httpx.AsyncClient(timeout=10.0, headers=headers) as client:
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
    except HTTPException:
        raise
    except Exception as exc:
        return {
            "username": GITHUB_USERNAME,
            "name": "Divyanshu Sharma",
            "bio": "AI & Systems Engineer",
            "location": "India",
            "avatar_url": "https://avatars.githubusercontent.com/u/120287532?v=4",
            "html_url": f"https://github.com/{GITHUB_USERNAME}",
            "blog": "",
            "followers": 10,
            "following": 5,
            "public_repos": 20,
            "updated_at": None,
            "repos": [],
            "error": f"Upstream connection: {exc.__class__.__name__}",
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
        async with httpx.AsyncClient(timeout=10.0, headers=headers, follow_redirects=True) as client:
            response = await client.get(LINKEDIN_PROFILE_URL)
        result["status_code"] = response.status_code
        result["title"] = _extract_meta(response.text, "title")
        result["description"] = _extract_meta(response.text, "description")
        result["html_url"] = str(response.url)
    except Exception as exc:
        result["error"] = f"LinkedIn fetch unavailable: {exc.__class__.__name__}"

    return result


@app.get("/profile")
async def profile_summary() -> dict[str, Any]:
    github = await github_profile()
    linkedin = await linkedin_profile()
    return {"github": github, "linkedin": linkedin}


@app.get("/calcom/status")
async def calcom_status() -> dict[str, Any]:
    if not CALCOM_USERNAME:
        raise HTTPException(status_code=503, detail="Cal.com username is not configured.")

    result: dict[str, Any] = {
        "username": CALCOM_USERNAME,
        "booking_url": f"https://cal.com/{CALCOM_USERNAME}",
        "api_configured": bool(CALCOM_API_KEY),
    }

    if not CALCOM_API_KEY:
        return result

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                "https://api.cal.com/v2/me",
                headers={
                    "Authorization": f"Bearer {CALCOM_API_KEY}",
                    "cal-api-version": "2024-08-13",
                },
            )
        result["api_status_code"] = response.status_code
        result["api_reachable"] = response.status_code < 500
        result["api_authenticated"] = response.status_code == 200
    except Exception as exc:
        result["api_status_code"] = None
        result["api_reachable"] = False
        result["api_authenticated"] = False
        result["error"] = f"Cal.com check unreachable: {exc.__class__.__name__}"

    return result


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

    try:
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
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Network error delivering notification: {exc.__class__.__name__}",
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
