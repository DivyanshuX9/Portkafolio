import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";

export type StatBadge = {
  label: string;
  value: string;
  badgeType?: "projects" | "sih" | "stack" | "patent" | "node" | "iqc" | "articles" | "time" | "session" | "timezone" | "response";
};

function BadgeIcon({ type }: { type?: StatBadge["badgeType"] }) {
  switch (type) {
    case "projects":
      return (
        <svg className="size-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71 1.26-1.55 1.5-2.5L4.5 16.5z" />
          <path d="M12 15l-3-3m0 0l-5.5 5.5m5.5-5.5l9-9a2.12 2.12 0 013 3l-9 9z" />
        </svg>
      );
    case "sih":
    case "iqc":
      return (
        <svg className="size-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      );
    case "patent":
      return (
        <svg className="size-4 text-violet-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
        </svg>
      );
    case "node":
      return (
        <svg className="size-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 000 20M2 12h20" />
        </svg>
      );
    case "articles":
      return (
        <svg className="size-4 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 01-2.5-2.5z" />
          <path d="M6 6h10M6 10h10M6 14h6" />
        </svg>
      );
    case "session":
    case "time":
      return (
        <svg className="size-4 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      );
    case "timezone":
      return (
        <svg className="size-4 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
      );
    case "response":
      return (
        <svg className="size-4 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 13V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12c0 1.1.9 2 2 2h8" />
          <path d="M22 7l-10 7L2 7" />
          <path d="M16 19l2 2 4-4" />
        </svg>
      );
    default:
      return (
        <svg className="size-4 text-foreground/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
  }
}

type PageHeaderHeroProps = {
  sectionIndex?: string;
  eyebrow: string;
  title: string;
  description: string;
  breadcrumb: { label: string; href?: string }[];
  stats?: StatBadge[];
  children?: React.ReactNode;
};

export function PageHeaderHero({
  sectionIndex = "01",
  eyebrow,
  title,
  description,
  breadcrumb,
  stats,
  children,
}: PageHeaderHeroProps) {
  return (
    <section className="relative pt-24 pb-10 md:pt-28 md:pb-14">
      {/* Abstract geometric background ambient mesh */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-80 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-gradient-to-tr from-blue-500/10 via-violet-500/5 to-transparent blur-3xl dark:from-blue-500/15 dark:via-purple-500/10" />
        <div className="absolute top-0 right-10 size-48 rounded-full bg-cyan-500/10 blur-2xl dark:bg-cyan-500/15" />
      </div>

      <div className="container-edge relative z-10">
        <Reveal>
          {/* Breadcrumb & Live status bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4 backdrop-blur-xs">
            <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {breadcrumb.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {idx > 0 && <span className="opacity-40">/</span>}
                  {item.href ? (
                    <Link
                      to={item.href}
                      className="transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="font-semibold text-foreground">
                      {item.label}
                    </span>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-2 rounded-full border border-border/80 bg-surface/70 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-foreground shadow-2xs backdrop-blur-md">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>[{sectionIndex}] {eyebrow}</span>
            </div>
          </div>
        </Reveal>

        {/* Title and Description */}
        <Reveal delay={0.05}>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-8 lg:col-span-7">
              <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1]">
                {title}
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-foreground/80 md:text-base">
                {description}
              </p>
            </div>

            {/* Visual Stat Cards Grid */}
            {stats && stats.length > 0 && (
              <div className="md:col-span-4 lg:col-span-5 flex flex-col justify-end">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-2 gap-2.5">
                  {stats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-surface/40 p-3.5 shadow-2xs transition-all duration-300 hover:border-foreground/20 hover:bg-surface/80 hover:shadow-md"
                    >
                      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        {stat.label}
                      </span>
                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <span className="font-display text-base font-bold tracking-tight text-foreground">
                          {stat.value}
                        </span>
                        <div className="flex size-7 items-center justify-center rounded-lg border border-border bg-background/80 shadow-2xs transition-transform group-hover:scale-110">
                          <BadgeIcon type={stat.badgeType} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Reveal>

        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
