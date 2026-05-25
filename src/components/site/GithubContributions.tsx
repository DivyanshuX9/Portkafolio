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
type ContributionDay = { date: string; count: number; level: number };
type ContributionResponse = {
  total: Record<string, number>;
  contributions: ContributionDay[];
};

const githubUsername = import.meta.env.VITE_GITHUB_USERNAME ?? "DivyanshuX9";
const githubApiBase =
  import.meta.env.VITE_GITHUB_API_BASE ?? "https://api.github.com";
const githubContributionsApiUrl = `https://github-contributions-api.jogruber.de/v4/${githubUsername}`;
const githubCache = new Map<string, { at: number; data: unknown }>();
const githubPending = new Map<string, Promise<unknown>>();
const githubCacheTtl = 10 * 60 * 1000;

const levelStyle = [
  "bg-[#ebedf0]",
  "bg-[#9be9a8]",
  "bg-[#40c463]",
  "bg-[#30a14e]",
  "bg-[#216e39]",
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

  const request = fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
  })
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
  const { data, isLoading, isError, dataUpdatedAt } = useQuery({
    queryKey: ["github-profile", githubUsername],
    queryFn: async () => {
      const [profile, repos] = await Promise.all([
        cachedJson<GitHubProfile>(`${githubApiBase}/users/${githubUsername}`),
        cachedJson<GitHubRepo[]>(
          `${githubApiBase}/users/${githubUsername}/repos?per_page=100&type=owner&sort=updated`,
        ),
      ]);

      const stars = repos.reduce(
        (acc, repo) => acc + (repo.stargazers_count || 0),
        0,
      );

      return { profile, stars };
    },
    refetchInterval: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
    retry: 0,
  });

  const { data: contributionData } = useQuery({
    queryKey: ["github-contributions", githubUsername],
    queryFn: async () =>
      cachedJson<ContributionResponse>(githubContributionsApiUrl),
    staleTime: 10 * 60 * 1000,
    retry: 0,
  });

  const profile = data?.profile;
  const updatedLabel = dataUpdatedAt
    ? formatDistanceToNow(dataUpdatedAt, { addSuffix: true })
    : "just now";
  const name = profile?.name ?? githubUsername;
  const bio = profile?.bio ?? "";
  const location = profile?.location ?? "";
  const repoLink = profile?.html_url ?? `https://github.com/${githubUsername}`;
  const website = profile?.blog && profile.blog !== "" ? profile.blog : null;
  const sinceYear = profile ? new Date(profile.created_at).getFullYear() : 0;
  const followers = profile?.followers ?? 0;
  const stars = data?.stars ?? 0;

  const graph = useMemo(() => {
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
  }, [contributionData]);

  const isReady = Boolean(data && contributionData);

  return (
    <section
      id="github"
      className="relative border-t border-border bg-background pt-20 pb-14 md:pt-24"
    >
      <div className="container-edge">
        <Reveal>
          <div className="flex items-baseline justify-between border-b border-border pb-6">
            <p className="eyebrow">[ Sec. 06 ] Live GitHub profile</p>
            <p className="hidden text-[11px] uppercase tracking-[0.2em] text-muted-foreground md:block">
              @{githubUsername} ·{" "}
              {isError ? "offline snapshot" : `updated ${updatedLabel}`}
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-12">
          <Reveal>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                {isReady ? (
                  <img
                    src={
                      profile?.avatar_url ??
                      `https://github.com/${githubUsername}.png`
                    }
                    alt={`${name} GitHub avatar`}
                    className="size-16 shrink-0 rounded-full border border-border object-cover shadow-sm"
                    loading="lazy"
                  />
                ) : (
                  <Skeleton className="size-16 rounded-full" />
                )}

                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    GitHub user
                  </p>
                  {isReady ? (
                    <>
                      <h3 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground">
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
                </div>
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

              <div className="grid gap-6 border-t border-border pt-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
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

                <div className="flex items-center gap-3 lg:justify-end">
                  {profileBadges.map((badge) => (
                    <img
                      key={badge.src}
                      src={badge.src}
                      alt={badge.alt}
                      className="size-14 rounded-full border border-border object-cover md:size-16"
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
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
                    className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-2 text-[12px] font-medium uppercase tracking-[0.18em] text-foreground transition-opacity hover:opacity-70"
                  >
                    Website
                  </a>
                )}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-5">
              <div className="flex items-baseline justify-between gap-4 border-b border-border pb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    Contributions
                  </p>
                  <div className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground">
                    {contributionData ? (
                      graph.lastYearTotal.toLocaleString()
                    ) : (
                      <Skeleton className="h-8 w-16 rounded-none" />
                    )}
                  </div>
                </div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  Last 365 days
                </p>
              </div>

              <div className="overflow-x-auto pb-4 -mb-4">
                <div className="min-w-max pr-4">
                  <div className="mb-3 flex gap-2">
                    <div className="w-7 shrink-0" />
                    <div className="flex gap-0.5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      {graph.monthLabels.map((month, index) => (
                        <div
                          key={index}
                          className="github-contribution-week h-5 shrink-0 flex items-end justify-start"
                        >
                          {month && (
                            <span className="whitespace-nowrap">{month}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  {contributionData ? (
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

                      <div className="flex gap-0.5">
                        {graph.weeks.map((week, weekIndex) => (
                          <div
                            key={weekIndex}
                            className="github-contribution-week flex shrink-0 flex-col gap-0.5"
                          >
                            {week.map((day) => (
                              <span
                                key={day.date.toISOString()}
                                title={`${day.date.toDateString()} · ${day.count} contributions`}
                                className={`size-2.5 rounded-[3px] md:size-3.5 ${levelStyle[day.level]} transition-transform duration-300 hover:scale-110`}
                              />
                            ))}
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
                            className="size-2.5 rounded-[3px] md:size-3.5"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between gap-4 text-[10px] tracking-[0.02em] text-muted-foreground">
                    <span>Learn how we count contributions</span>
                    <div className="flex items-center gap-2 uppercase tracking-[0.22em]">
                      <span>Less</span>
                      {levelStyle.map((className, index) => (
                        <span
                          key={index}
                          className={`size-2.5 rounded-[3px] md:size-3.5 ${className}`}
                        />
                      ))}
                      <span>More</span>
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
