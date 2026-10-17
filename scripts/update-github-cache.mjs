import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Load GITHUB_TOKEN and GITHUB_USERNAME from backend/.env or process.env
let githubToken = process.env.GITHUB_TOKEN || "";
let githubUsername = process.env.GITHUB_USERNAME || "DivyanshuX9";

const envPath = path.join(rootDir, "backend", ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("GITHUB_TOKEN=") && !githubToken) {
      githubToken = trimmed.replace("GITHUB_TOKEN=", "").trim().replace(/['"]/g, "");
    }
    if (trimmed.startsWith("GITHUB_USERNAME=")) {
      githubUsername = trimmed.replace("GITHUB_USERNAME=", "").trim().replace(/['"]/g, "");
    }
  }
}

async function fetchGitHubData() {
  console.log(`[GitHub Cache] Fetching data for user "${githubUsername}"...`);
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "Divyanshu-Portfolio-Cache/1.0",
  };
  if (githubToken) {
    headers.Authorization = `Bearer ${githubToken}`;
    console.log("[GitHub Cache] Using authenticated GitHub token.");
  } else {
    console.warn("[GitHub Cache] No token found, using unauthenticated requests.");
  }

  try {
    // 1. Profile
    const profileRes = await fetch(`https://api.github.com/users/${githubUsername}`, { headers });
    let profile = null;
    if (profileRes.ok) {
      profile = await profileRes.json();
    } else {
      console.warn(`[GitHub Cache] Profile fetch status: ${profileRes.status}`);
    }

    // 2. Repositories
    const reposRes = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?per_page=100&type=owner&sort=updated`,
      { headers }
    );
    let repos = [];
    if (reposRes.ok) {
      repos = await reposRes.json();
    } else {
      console.warn(`[GitHub Cache] Repos fetch status: ${reposRes.status}`);
    }

    // 3. Contributions graph
    const contribRes = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${githubUsername}`
    );
    let contributions = null;
    if (contribRes.ok) {
      contributions = await contribRes.json();
    } else {
      console.warn(`[GitHub Cache] Contributions fetch status: ${contribRes.status}`);
    }

    const stars = Array.isArray(repos)
      ? repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0)
      : 0;

    const payload = {
      updatedAt: new Date().toISOString(),
      timestamp: Date.now(),
      username: githubUsername,
      profile: profile || {
        login: githubUsername,
        name: "Divyanshu Sharma",
        avatar_url: "https://avatars.githubusercontent.com/u/120287532?v=4",
        html_url: `https://github.com/${githubUsername}`,
        bio: "AI & Full-Stack Systems Engineer",
        location: "India",
        public_repos: Array.isArray(repos) ? repos.length : 20,
        followers: 12,
        following: 6,
        created_at: "2023-01-01T00:00:00Z",
      },
      stars,
      reposCount: Array.isArray(repos) ? repos.length : 20,
      contributions: contributions || {
        total: { "2024": 450, "2025": 620, "2026": 260 },
        contributions: [],
      },
    };

    const targetDirs = [
      path.join(rootDir, "src", "content"),
      path.join(rootDir, "public"),
    ];

    for (const dir of targetDirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const filePath = path.join(dir, "github-cache.json");
      fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf-8");
      console.log(`[GitHub Cache] Successfully written: ${filePath}`);
    }

    console.log(`[GitHub Cache] Snapshot saved! Stars: ${stars}, Repos: ${payload.reposCount}`);
  } catch (err) {
    console.error("[GitHub Cache] Error updating cache:", err);
  }
}

fetchGitHubData();

