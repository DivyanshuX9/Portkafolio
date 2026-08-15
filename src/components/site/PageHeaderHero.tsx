import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";

type StatBadge = {
  label: string;
  value: string;
  icon?: string;
};

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
      {/* Subtle top ambient glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-ink-deep/[0.04] via-transparent to-transparent dark:from-white/[0.03]"
        aria-hidden
      />

      <div className="container-edge relative z-10">
        <Reveal>
          {/* Breadcrumb & Live status bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
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

            <div className="flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-foreground backdrop-blur-sm">
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

            {/* Quick Stat Highlights */}
            {stats && stats.length > 0 && (
              <div className="md:col-span-4 lg:col-span-5 flex flex-col justify-end">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-2 gap-2.5">
                  {stats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col justify-between rounded-xl border border-border/80 bg-surface/40 p-3 shadow-xs transition-colors hover:bg-surface/70"
                    >
                      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        {stat.label}
                      </span>
                      <span className="mt-1 font-display text-lg font-bold tracking-tight text-foreground flex items-center gap-1.5">
                        {stat.icon && <span>{stat.icon}</span>}
                        {stat.value}
                      </span>
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
