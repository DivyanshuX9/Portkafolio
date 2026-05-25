import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { eachDayOfInterval, formatDistanceToNow, startOfDay, startOfWeek, subDays } from "date-fns";
import { useMemo } from "react";
import { Reveal } from "./Reveal";

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
type GitHubEvent = { type: string; payload?: { size?: number } };
type ContributionDay = { date: string; count: number; level: number };
type ContributionResponse = { total: Record<string, number>; contributions: ContributionDay[] };

const githubUsername = import.meta.env.VITE_GITHUB_USERNAME ?? "DivyanshuX9";
const githubApiBase = import.meta.env.VITE_GITHUB_API_BASE ?? "https://api.github.com";
const githubContributionsApiUrl = `https://github-contributions-api.jogruber.de/v4/${githubUsername}`;
const githubCache = new Map<string, { at: number; data: unknown }>();
const githubPending = new Map<string, Promise<unknown>>();
const githubCacheTtl = 10 * 60 * 1000;

const levelStyle = [
  "bg-[#efefef]",
  "bg-[#9a9a9a]",
  "bg-[#6a6a6a]",
  "bg-[#404040]",
  "bg-[#000000]",
];

async function cachedJson<T>(url: string, ttl = githubCacheTtl): Promise<T> {
  const cached = githubCache.get(url);
  if (cached && Date.now() - cached.at < ttl) {
    return cached.data as T;
  }

  const pending = githubPending.get(url);
  if (pending) {
    return pending as Promise<T>;
  }

  const request = fetch(url, { headers: { Accept: "application/vnd.github+json" } })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Request failed with ${response.status}`);
      }
      return response.json() as Promise<T>;
    })
    .then((data) => {
      githubCache.set(url, { at: Date.now(), data });
      githubPending.delete(url);
      return data;
    })
    .catch((error) => {
      githubPending.delete(url);
      throw error;
    });

  githubPending.set(url, request);
  return request;
}

function StatSkeleton() {
  return <Skeleton className="mt-2 h-8 w-14 rounded-none" />;
}

export function GithubContributions() {
  const { data, isLoading, isError, dataUpdatedAt } = useQuery({
    queryKey: ["github-profile", githubUsername],
    queryFn: async () => {
      const [profile, repos, events] = await Promise.all([
        cachedJson<GitHubProfile>(`${githubApiBase}/users/${githubUsername}`),
        cachedJson<GitHubRepo[]>(`${githubApiBase}/users/${githubUsername}/repos?per_page=100&type=owner&sort=updated`),
        cachedJson<GitHubEvent[]>(`${githubApiBase}/users/${githubUsername}/events/public?per_page=100`),
      ]);

      const stars = repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
      const commits = events
        .filter((event) => event.type === "PushEvent")
        .reduce((acc, event) => acc + (event.payload?.size ?? 0), 0);

      return { profile, stars, commits };
    },
    refetchInterval: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
    retry: 0,
  });

  const { data: contributionData } = useQuery({
    queryKey: ["github-contributions", githubUsername],
    queryFn: async () => cachedJson<ContributionResponse>(githubContributionsApiUrl),
    staleTime: 10 * 60 * 1000,
    retry: 0,
  });

  const profile = data?.profile;
  const updatedLabel = dataUpdatedAt ? formatDistanceToNow(dataUpdatedAt, { addSuffix: true }) : "just now";
  const name = profile?.name ?? githubUsername;
  const bio = profile?.bio ?? "";
  const location = profile?.location ?? "";
  const repoLink = profile?.html_url ?? `https://github.com/${githubUsername}`;
  const website = profile?.blog && profile.blog !== "" ? profile.blog : null;
  const sinceYear = profile ? new Date(profile.created_at).getFullYear() : 0;
  const followers = profile?.followers ?? 0;
  const commits = data?.commits ?? 0;
  const stars = data?.stars ?? 0;

  const graph = useMemo(() => {
    const endDate = startOfDay(new Date());
    const startDate = startOfWeek(subDays(endDate, 364), { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const entries = new Map(contributionData?.contributions.map((day) => [day.date, day]) ?? []);

    const weeks: Array<Array<{ date: Date; count: number; level: number }>> = [];
    for (let index = 0; index < days.length; index += 7) {
      weeks.push(
        days.slice(index, index + 7).map((date) => {
          const key = date.toISOString().slice(0, 10);
          const entry = entries.get(key);
          return {
            date,
            count: entry?.count ?? 0,
            level: entry?.level ?? 0,
          };
        }),
      );
    }

    const lastYearTotal = days.reduce((sum, date) => {
      const entry = entries.get(date.toISOString().slice(0, 10));
      return sum + (entry?.count ?? 0);
    }, 0);

    const activeDays = contributionData?.contributions.filter((day) => day.count > 0).length ?? 0;
    const peakDay = contributionData?.contributions.reduce<ContributionDay | null>((best, day) => {
      if (!best || day.count > best.count) return day;
      return best;
    }, null);

    return { weeks, lastYearTotal, activeDays, peakDay, totalDays: contributionData?.contributions.length ?? 0 };
  }, [contributionData]);

  const isReady = Boolean(data && contributionData);

  return (
    <section id="github" className="relative border-t border-ink-deep/15 pt-20 pb-14 md:pt-24">
      <div className="container-edge">
        <Reveal>
          <div className="flex items-baseline justify-between border-b border-ink-deep/15 pb-6">
            <p className="eyebrow">[ Sec. 06 ] Live GitHub profile</p>
            <p className="hidden text-[11px] uppercase tracking-[0.2em] opacity-60 md:block">
              @{githubUsername} · {isError ? "offline snapshot" : `updated ${updatedLabel}`}
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-12 items-start gap-y-8 md:gap-x-10">
          <Reveal className="col-span-12 md:col-span-4">
            <div className="rounded-4xl border border-ink-deep/10 bg-background/95 p-5 shadow-[0_24px_70px_-48px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-6 white-surface">
              <div className="flex items-start gap-4">
                {isReady ? (
                  <img
                    src={profile?.avatar_url ?? `https://github.com/${githubUsername}.png`}
                    alt={`${name} GitHub avatar`}
                    className="size-16 shrink-0 rounded-full border border-ink-deep/10 object-cover"
                    loading="lazy"
                  />
                ) : (
                  <Skeleton className="size-16 rounded-full" />
                )}

                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.22em] opacity-55">GitHub user</p>
                  {isReady ? (
                    <>
                      <h3 className="mt-1 font-display text-3xl font-medium tracking-tight text-ink-deep">{name}</h3>
                      <p className="mt-1 text-[12px] uppercase tracking-[0.2em] opacity-55">@{profile?.login ?? githubUsername}</p>
                    </>
                  ) : (
                    <>
                      <Skeleton className="mt-2 h-8 w-40 rounded-none" />
                      <Skeleton className="mt-2 h-3 w-24 rounded-none" />
                    </>
                  )}
                </div>
              </div>

              {isReady ? (
                bio && <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink">{bio}</p>
              ) : (
                <Skeleton className="mt-5 h-16 w-full max-w-md rounded-2xl" />
              )}

              <div className="mt-6 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em]">
                {isReady ? (
                  <>
                    {location && <span className="rounded-full border border-ink-deep/10 bg-ink-deep/4 px-3 py-1">{location}</span>}
                    <span className="rounded-full border border-ink-deep/10 bg-ink-deep/4 px-3 py-1">Joined {sinceYear || "—"}</span>
                    <span className="rounded-full border border-ink-deep/10 bg-ink-deep/4 px-3 py-1">Synced {updatedLabel}</span>
                  </>
                ) : (
                  <>
                    <Skeleton className="h-7 w-24 rounded-full" />
                    <Skeleton className="h-7 w-20 rounded-full" />
                    <Skeleton className="h-7 w-24 rounded-full" />
                  </>
                )}
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-ink-deep/10 bg-background/70 p-4">
                  <dt className="text-[10px] uppercase tracking-[0.22em] opacity-60">Public repos</dt>
                  <dd className="mt-2 font-display text-3xl font-medium tabular-nums text-ink-deep">
                    {isLoading ? <StatSkeleton /> : profile?.public_repos ?? "—"}
                  </dd>
                </div>
                <div className="rounded-2xl border border-ink-deep/10 bg-background/70 p-4">
                  <dt className="text-[10px] uppercase tracking-[0.22em] opacity-60">Followers</dt>
                  <dd className="mt-2 font-display text-3xl font-medium tabular-nums text-ink-deep">
                    {isLoading ? <StatSkeleton /> : followers}
                  </dd>
                </div>
                <div className="rounded-2xl border border-ink-deep/10 bg-background/70 p-4">
                  <dt className="text-[10px] uppercase tracking-[0.22em] opacity-60">Recent commits</dt>
                  <dd className="mt-2 font-display text-3xl font-medium tabular-nums text-ink-deep">
                    {isLoading ? <StatSkeleton /> : commits}
                  </dd>
                </div>
                <div className="rounded-2xl border border-ink-deep/10 bg-background/70 p-4">
                  <dt className="text-[10px] uppercase tracking-[0.22em] opacity-60">Stars</dt>
                  <dd className="mt-2 font-display text-3xl font-medium tabular-nums text-ink-deep">
                    {isLoading ? <StatSkeleton /> : stars}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={repoLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full border border-ink-deep/15 bg-ink-deep px-4 py-2 text-[12px] font-medium uppercase tracking-[0.18em] text-background transition-opacity hover:opacity-85"
                >
                  Open profile
                </a>
                {website && (
                  <a
                    href={website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-full border border-ink-deep/15 px-4 py-2 text-[12px] font-medium uppercase tracking-[0.18em] text-ink-deep transition-opacity hover:opacity-70"
                  >
                    Website
                  </a>
                )}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="col-span-12 md:col-span-8">
            <div className="rounded-4xl border border-ink-deep/10 bg-background/95 p-4 shadow-[0_24px_70px_-48px_rgba(0,0,0,0.25)] backdrop-blur-sm md:p-5 white-surface">
              <div className="rounded-3xl border border-ink-deep/10 bg-background/60 p-4 md:p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] opacity-55">Contributions</p>
                    <p className="mt-1 font-display text-2xl font-medium tracking-tight text-ink-deep">
                      {contributionData ? graph.lastYearTotal.toLocaleString() : <Skeleton className="h-8 w-16 rounded-none" />}
                    </p>
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.2em] opacity-55">Last 365 days</p>
                </div>

                <div className="mt-5 overflow-x-auto pb-2">
                  <div className="min-w-170">
                    {contributionData ? (
                      <div className="flex gap-0.75">
                        {graph.weeks.map((week, weekIndex) => (
                          <div key={weekIndex} className="flex flex-col gap-0.75">
                            {week.map((day) => (
                              <span
                                key={day.date.toISOString()}
                                title={`${day.date.toDateString()} · ${day.count} contributions`}
                                className={`size-2.75 rounded-xs ${levelStyle[day.level]} transition-opacity hover:opacity-70`}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-8 gap-2">
                        {Array.from({ length: 64 }).map((_, index) => (
                          <Skeleton key={index} className="size-2.75 rounded-xs" />
                        ))}
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-end gap-2 text-[10px] uppercase tracking-[0.22em] opacity-60">
                      <span>Less</span>
                      {levelStyle.map((className, index) => (
                        <span key={index} className={`size-[11px] rounded-[2px] ${className}`} />
                      ))}
                      <span>More</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 border-t border-ink-deep/10 pt-4 md:grid-cols-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] opacity-60">Active days</p>
                  <p className="mt-2 font-display text-3xl font-medium text-ink-deep">
                    {contributionData ? graph.activeDays : <StatSkeleton />}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] opacity-60">Peak day</p>
                  <p className="mt-2 font-display text-3xl font-medium text-ink-deep">
                    {contributionData ? (graph.peakDay?.count ?? 0) : <StatSkeleton />}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] opacity-60">Tracked days</p>
                  <p className="mt-2 font-display text-3xl font-medium text-ink-deep">
                    {contributionData ? graph.totalDays : <StatSkeleton />}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}