from __future__ import annotations

import os
import re
from typing import Any

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

GITHUB_USERNAME = os.getenv("GITHUB_USERNAME", "DivyanshuX9")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
LINKEDIN_PROFILE_URL = os.getenv(
    "LINKEDIN_PROFILE_URL",
    "https://www.linkedin.com/in/mr-divyanshu",
)
GITHUB_API_BASE = "https://api.github.com"

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
