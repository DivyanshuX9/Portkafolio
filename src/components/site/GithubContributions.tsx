import pullSharkBadge from "@/assests/badges/pull-shark.png";
import quickdrawBadge from "@/assests/badges/quickdraw--light-medium-.png";
import yoloBadge from "@/assests/badges/yolo.png";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
    eachDayOfInterval,
    formatDistanceToNow,
    startOfDay,
    startOfWeek,
    subDays,
} from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import "./github-contributions.css";

type GitHubProfile = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  blog: string | null;
  html_url: string;
  public_repos: number;
  followers: number;
  created_at: string;
  updated_at: string;
};

type GitHubRepo = { stargazers_count: number };
type ContributionDay = { date: string; count: number; level: number };
type ContributionResponse = {
  total: Record<string, number>;
  contributions: ContributionDay[];
};

import githubCacheSnapshot from "@/content/github-cache.json";

const githubUsername = import.meta.env.VITE_GITHUB_USERNAME ?? "DivyanshuX9";
const githubApiBase =
  import.meta.env.VITE_GITHUB_API_BASE ?? "https://api.github.com";
const githubContributionsApiUrl = `https://github-contributions-api.jogruber.de/v4/${githubUsername}`;

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const memoryCache = new Map<string, { at: number; data: unknown }>();
const pendingRequests = new Map<string, Promise<unknown>>();

function getLocalCache<T>(key: string, maxAgeMs: number = ONE_DAY_MS): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.at === "number" && Date.now() - parsed.at < maxAgeMs) {
      return parsed.data as T;
    }
  } catch {}
  return null;
}

function setLocalCache<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify({ at: Date.now(), data }));
  } catch {}
}

async function cachedJson<T>(
  url: string,
  cacheKey: string,
  fallbackData?: T,
  ttl: number = ONE_DAY_MS,
): Promise<T> {
  // 1. Check in-memory cache
  const mem = memoryCache.get(cacheKey);
  if (mem && Date.now() - mem.at < ttl) {
    return mem.data as T;
  }

  // 2. Check localStorage cache
  const local = getLocalCache<T>(cacheKey, ttl);
  if (local) {
    memoryCache.set(cacheKey, { at: Date.now(), data: local });
    return local;
  }

  // 3. Deduplicate in-flight requests
  const pending = pendingRequests.get(cacheKey);
  if (pending) {
    return pending as Promise<T>;
  }

  const request = fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return (await response.json()) as T;
    })
    .then((data) => {
      memoryCache.set(cacheKey, { at: Date.now(), data });
      setLocalCache(cacheKey, data);
      pendingRequests.delete(cacheKey);
      return data;
    })
    .catch((error) => {
      pendingRequests.delete(cacheKey);
      // Fallback: check if stale cache exists in localStorage
      const stale = getLocalCache<T>(cacheKey, Infinity);
      if (stale) {
        return stale;
      }
      if (fallbackData !== undefined) {
        return fallbackData;
      }
      throw error;
    });

  pendingRequests.set(cacheKey, request);
  return request;
}

const levelStyle = [
  "bg-[#ebedf0]",
  "bg-[#9be9a8]",
  "bg-[#40c463]",
  "bg-[#30a14e]",
  "bg-[#216e39]",
];

function StatSkeleton() {
  return <Skeleton className="mt-2 h-8 w-14 rounded-none" />;
}

const dayAxisLabels: Array<string | null> = [
  null,
  "Mon",
  null,
  "Wed",
  null,
  "Fri",
  null,
];
const profileBadges = [
  { src: pullSharkBadge, alt: "GitHub Pull Shark achievement badge" },
  { src: quickdrawBadge, alt: "GitHub Quickdraw achievement badge" },
  { src: yoloBadge, alt: "GitHub YOLO achievement badge" },
];

export function GithubContributions() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const initialProfile = useMemo(() => {
    const local = getLocalCache<{ profile: GitHubProfile; stars: number }>(
      `gh_profile_${githubUsername}`,
      ONE_DAY_MS,
    );
    if (local) return local;
    return {
      profile: githubCacheSnapshot.profile as unknown as GitHubProfile,
      stars: githubCacheSnapshot.stars,
    };
  }, []);

  const initialContributions = useMemo(() => {
    const local = getLocalCache<ContributionResponse>(
      `gh_contrib_${githubUsername}`,
      ONE_DAY_MS,
    );
    if (local) return local;
    return githubCacheSnapshot.contributions as unknown as ContributionResponse;
  }, []);

  const { data, isLoading, isError, dataUpdatedAt } = useQuery({
    queryKey: ["github-profile", githubUsername],
    queryFn: async () => {
      const cached = getLocalCache<{ profile: GitHubProfile; stars: number }>(
        `gh_profile_${githubUsername}`,
        ONE_DAY_MS,
      );
      if (cached) return cached;

      try {
        const [profile, repos] = await Promise.all([
          cachedJson<GitHubProfile>(
            `${githubApiBase}/users/${githubUsername}`,
            `gh_raw_profile_${githubUsername}`,
            githubCacheSnapshot.profile as unknown as GitHubProfile,
          ),
          cachedJson<GitHubRepo[]>(
            `${githubApiBase}/users/${githubUsername}/repos?per_page=100&type=owner&sort=updated`,
            `gh_raw_repos_${githubUsername}`,
            [],
          ),
        ]);

        const stars = Array.isArray(repos)
          ? repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0)
          : githubCacheSnapshot.stars;

        const result = { profile, stars };
        setLocalCache(`gh_profile_${githubUsername}`, result);
        return result;
      } catch {
        return initialProfile;
      }
    },
    initialData: initialProfile,
    staleTime: ONE_DAY_MS,
    gcTime: ONE_DAY_MS,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 0,
  });

  const { data: contributionData } = useQuery({
    queryKey: ["github-contributions", githubUsername],
    queryFn: async () => {
      const cached = getLocalCache<ContributionResponse>(
        `gh_contrib_${githubUsername}`,
        ONE_DAY_MS,
      );
      if (cached) return cached;

      try {
        const res = await cachedJson<ContributionResponse>(
          githubContributionsApiUrl,
          `gh_contrib_${githubUsername}`,
          githubCacheSnapshot.contributions as unknown as ContributionResponse,
        );
        setLocalCache(`gh_contrib_${githubUsername}`, res);
        return res;
      } catch {
        return initialContributions;
      }
    },
    initialData: initialContributions,
    staleTime: ONE_DAY_MS,
    gcTime: ONE_DAY_MS,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 0,
  });

  const profile = data?.profile;
  const updatedLabel =
    dataUpdatedAt && dataUpdatedAt > 0
      ? formatDistanceToNow(dataUpdatedAt, { addSuffix: true })
      : "today";
  const name = profile?.name ?? githubUsername;
  const bio = profile?.bio ?? "";
  const location = profile?.location ?? "";
  const repoLink = profile?.html_url ?? `https://github.com/${githubUsername}`;
  const website = profile?.blog && profile.blog !== "" ? profile.blog : null;
  const sinceYear = profile ? new Date(profile.created_at).getFullYear() : 0;
  const followers = profile?.followers ?? 0;
  const stars = data?.stars ?? 0;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const graph = useMemo(() => {
    if (!mounted) {
      return {
        weeks: [],
        monthLabels: [],
        lastYearTotal: 0,
        activeDays: 0,
        peakDay: null,
        totalDays: 0,
      };
    }
    const endDate = startOfDay(new Date());
    const startDate = startOfWeek(subDays(endDate, 364), { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const entries = new Map(
      contributionData?.contributions.map((day) => [day.date, day]) ?? [],
    );

    const weeks: Array<Array<{ date: Date; count: number; level: number }>> =
      [];

    for (let index = 0; index < days.length; index += 7) {
      const week = days.slice(index, index + 7).map((date) => {
        const key = date.toISOString().slice(0, 10);
        const entry = entries.get(key);
        return {
          date,
          count: entry?.count ?? 0,
          level: entry?.level ?? 0,
        };
      });
      weeks.push(week);
    }

    const monthLabels: (string | null)[] = Array.from(
      { length: weeks.length },
      () => null,
    );
    weeks.forEach((week, weekIndex) => {
      const monthStartDay = week.find((d) => d.date.getDate() === 1);
      if (monthStartDay) {
        monthLabels[weekIndex] = monthStartDay.date.toLocaleString("en-US", {
          month: "short",
        });
      }
    });

    const lastYearTotal = days.reduce((sum, date) => {
      const entry = entries.get(date.toISOString().slice(0, 10));
      return sum + (entry?.count ?? 0);
    }, 0);

    const activeDays =
      contributionData?.contributions.filter((day) => day.count > 0).length ??
      0;
    const peakDay =
      contributionData?.contributions.reduce<ContributionDay | null>(
        (best, day) => {
          if (!best || day.count > best.count) return day;
          return best;
        },
        null,
      );

    return {
      weeks,
      monthLabels,
      lastYearTotal,
      activeDays,
      peakDay,
      totalDays: contributionData?.contributions.length ?? 0,
    };
  }, [contributionData, mounted]);

  const isReady = Boolean(data && contributionData);

  const scrollGraph = (direction: -1 | 1) => {
    const node = scrollRef.current;
    if (!node) return;

    node.scrollBy({
      left: direction * Math.max(node.clientWidth * 0.75, 280),
      behavior: "smooth",
    });
  };

  return (
    <section
      id="github"
      className="relative border-t border-border bg-background pt-16 pb-10 sm:pt-20 sm:pb-14 md:pt-24"
    >
      <div className="container-edge">
        <Reveal>
          <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 sm:pb-6">
            <p className="eyebrow">[ Sec. 06 ] Live GitHub profile</p>
            <p className="hidden text-[11px] uppercase tracking-[0.2em] text-muted-foreground md:block">
              @{githubUsername} ·{" "}
              {isError ? "offline snapshot" : `updated ${updatedLabel}`}
            </p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-8 sm:mt-12 sm:gap-12">
          <Reveal>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                {isReady ? (
                  <button
                    onClick={() => window.open(repoLink, "_blank")}
                    onDoubleClick={() => window.open(repoLink, "_blank")}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={
                        profile?.avatar_url ??
                        `https://github.com/${githubUsername}.png`
                      }
                      alt={`${name} GitHub avatar`}
                      className="size-16 shrink-0 rounded-full border border-border object-cover shadow-sm"
                      loading="lazy"
                    />
                  </button>
                ) : (
                  <Skeleton className="size-16 rounded-full" />
                )}

                <button
                  onClick={() => window.open(repoLink, "_blank")}
                  onDoubleClick={() => window.open(repoLink, "_blank")}
                  className="min-w-0 text-left cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    GitHub user
                  </p>
                  {isReady ? (
                    <>
                      <h3 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                        {name}
                      </h3>
                      <p className="mt-1 text-[12px] uppercase tracking-[0.2em] text-muted-foreground">
                        @{profile?.login ?? githubUsername}
                      </p>
                    </>
                  ) : (
                    <>
                      <Skeleton className="mt-2 h-8 w-40 rounded-none" />
                      <Skeleton className="mt-2 h-3 w-24 rounded-none" />
                    </>
                  )}
                </button>
              </div>

              {isReady ? (
                bio && (
                  <p className="max-w-md text-[15px] leading-relaxed text-foreground">
                    {bio}
                  </p>
                )
              ) : (
                <Skeleton className="h-16 w-full max-w-md rounded-2xl" />
              )}

              <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em]">
                {isReady ? (
                  <>
                    {location && (
                      <span className="rounded-full border border-ink-deep bg-ink-deep px-3 py-1 text-background">
                        {location}
                      </span>
                    )}
                    <span className="rounded-full border border-border bg-surface px-3 py-1 text-foreground">
                      Joined {sinceYear || "—"}
                    </span>
                    <span className="rounded-full border border-border bg-surface px-3 py-1 text-foreground">
                      Synced {updatedLabel}
                    </span>
                  </>
                ) : (
                  <>
                    <Skeleton className="h-7 w-24 rounded-full" />
                    <Skeleton className="h-7 w-20 rounded-full" />
                    <Skeleton className="h-7 w-24 rounded-full" />
                  </>
                )}
              </div>

              <div className="grid gap-4 border-t border-border pt-4 sm:gap-6 sm:pt-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      Public repos
                    </dt>
                    <dd className="mt-2 font-display text-3xl font-semibold tabular-nums text-foreground">
                      {isLoading ? (
                        <StatSkeleton />
                      ) : (
                        (profile?.public_repos ?? "—")
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      Followers
                    </dt>
                    <dd className="mt-2 font-display text-3xl font-semibold tabular-nums text-foreground">
                      {isLoading ? <StatSkeleton /> : followers}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      Stars
                    </dt>
                    <dd className="mt-2 font-display text-3xl font-semibold tabular-nums text-foreground">
                      {isLoading ? <StatSkeleton /> : stars}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      Active days
                    </dt>
                    <dd className="mt-2 font-display text-3xl font-semibold tabular-nums text-foreground">
                      {contributionData ? graph.activeDays : <StatSkeleton />}
                    </dd>
                  </div>
                </dl>

                <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                  {profileBadges.map((badge) => (
                    <a
                      key={badge.src}
                      href={repoLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={badge.src}
                        alt={badge.alt}
                        className="size-12 rounded-full border border-border object-cover md:size-16"
                        loading="lazy"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="min-w-0">
            <div className="space-y-5 min-w-0">
              <div className="flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    Contributions
                  </p>
                  <div className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {contributionData ? (
                      graph.lastYearTotal.toLocaleString("en-US")
                    ) : (
                      <Skeleton className="h-8 w-16 rounded-none" />
                    )}
                  </div>
                </div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  Last 365 days
                </p>
              </div>

              <div className="max-w-full min-w-0">
                <div className="mb-2 flex items-center justify-between gap-3 md:hidden">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Swipe or tap arrows
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => scrollGraph(-1)}
                      className="rounded-full border border-border bg-surface px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-ink-deep hover:text-background"
                      aria-label="Scroll contribution graph left"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollGraph(1)}
                      className="rounded-full border border-border bg-surface px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-ink-deep hover:text-background"
                      aria-label="Scroll contribution graph right"
                    >
                      →
                    </button>
                  </div>
                </div>
                <div
                  ref={scrollRef}
                  className="github-contributions-scroll pb-3"
                >
                  <div className="github-contributions-graph">
                    <div className="mb-3 flex gap-2">
                      <div className="w-7 shrink-0" />
                      <div className="flex gap-0.5 text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        {graph.monthLabels.map((month, index) => (
                          <div
                            key={index}
                            className="github-contribution-week flex h-5 items-end justify-start lg:shrink-0"
                          >
                            {month && (
                              <span className="whitespace-nowrap text-[8px] sm:text-[10px]">
                                {month}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    {contributionData ? (
                      <div className="flex items-start gap-2">
                        <div className="w-7 shrink-0">
                          <div className="flex flex-col gap-0.5 text-[9px] sm:text-[10px] leading-none text-muted-foreground">
                            {dayAxisLabels.map((label, index) => (
                              <span
                                key={index}
                                className="h-2 sm:h-2.5 md:h-3.5"
                              >
                                {label}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-0.5 flex-nowrap">
                          {graph.weeks.map((week, weekIndex) => (
                            <div
                              key={weekIndex}
                              className="github-contribution-week flex flex-col gap-0.5 lg:shrink-0"
                            >
                              {week.map((day) => {
                                const iso = day.date.toISOString().slice(0, 10);
                                const searchUrl = `https://github.com/search?q=author%3A${encodeURIComponent(githubUsername)}+committer-date%3A${encodeURIComponent(iso)}&type=commits`;
                                return (
                                  <a
                                    key={iso}
                                    href={searchUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    title={`${day.date.toDateString()} · ${day.count} contributions`}
                                    className={`inline-block ${day.count > 0 ? "cursor-pointer" : "cursor-default"}`}
                                  >
                                    <span
                                      className={`block size-4 sm:size-4 md:size-3.5 lg:size-3.5 rounded-xs sm:rounded-[3px] border border-border ${levelStyle[day.level]} transition-transform duration-300 hover:scale-110 active:scale-110`}
                                    />
                                  </a>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <div className="w-7 shrink-0">
                          <div className="flex flex-col gap-0.5 text-[10px] leading-none text-muted-foreground">
                            {dayAxisLabels.map((label, index) => (
                              <span key={index} className="h-2.5 md:h-3.5">
                                {label}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-8 gap-0.5">
                          {Array.from({ length: 64 }).map((_, index) => (
                            <Skeleton
                              key={index}
                              className="size-4 sm:size-4 rounded-xs md:size-3.5"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[10px] tracking-[0.02em] text-muted-foreground">
                      <span className="whitespace-normal max-w-[26ch] sm:max-w-none">
                        Learn how we count contributions
                      </span>
                      <div className="flex items-center gap-2 uppercase tracking-[0.22em]">
                        <span>Less</span>
                        {levelStyle.map((cls, index) => (
                          <span
                            key={index}
                            className={`inline-block size-4 sm:size-4 md:size-3.5 rounded-[3px] border border-border ${cls}`}
                          />
                        ))}
                        <span>More</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid gap-6 border-t border-border pt-5 md:grid-cols-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Peak day
                  </p>
                  <div className="mt-2 font-display text-3xl font-semibold text-foreground">
                    {contributionData ? (
                      (graph.peakDay?.count ?? 0)
                    ) : (
                      <StatSkeleton />
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Tracked days
                  </p>
                  <div className="mt-2 font-display text-3xl font-semibold text-foreground">
                    {contributionData ? graph.totalDays : <StatSkeleton />}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
