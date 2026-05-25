import { Link, useLocation } from "@tanstack/react-router";
import { Fragment, type ReactNode } from "react";
import { useSeason, type Season } from "./SeasonContext";

type NavItem = {
  href: string;
  label: string;
  external?: boolean;
  icon: ReactNode;
};

const Icon = {
  home: (
    <svg className="block size-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v10h14V10" />
    </svg>
  ),
  experience: (
    <svg className="block size-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </svg>
  ),
  project: (
    <svg className="block size-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8 6 2 12 8 18" />
      <polyline points="16 6 22 12 16 18" />
    </svg>
  ),
  blog: (
    <svg className="block size-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z" />
      <path d="M5 17a3 3 0 0 0 3 3" />
      <path d="M9 8h7M9 12h7" />
    </svg>
  ),
  github: (
    <svg className="block size-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.57.1.78-.25.78-.55v-2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.66.79.55A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z" />
    </svg>
  ),
  linkedin: (
    <svg className="block size-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.55c0-1.32-.02-3.02-1.85-3.02-1.85 0-2.13 1.43-2.13 2.92V21H10z" />
    </svg>
  ),
  calendar: (
    <svg className="block size-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <circle cx="12" cy="15" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  ),
};

const socialNav: NavItem[] = [
  { href: "https://github.com/DivyanshuX9", label: "GitHub", icon: Icon.github, external: true },
  { href: "https://www.linkedin.com/in/mr-divyanshu", label: "LinkedIn", icon: Icon.linkedin, external: true },
  { href: "/schedule", label: "Schedule a meeting", icon: Icon.calendar, external: false },
];

const seasonGlyph: Record<Season, ReactNode> = {
  sunny: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>
  ),
  rain: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7 14a5 5 0 1 1 1.5-9.78A6 6 0 0 1 19 9a4 4 0 0 1 0 8H7a3 3 0 0 1 0-6" /><path d="M9 19l-1 2M13 19l-1 2M17 19l-1 2" /></svg>
  ),
  night: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
  ),
  autumn: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21V9" /><path d="M12 9c-3 0-6-2-6-5 4 0 6 2 6 5z" /><path d="M12 11c3 0 6-2 6-5-4 0-6 2-6 5z" /><path d="M12 14c-3 0-5-1.5-5-4 3 0 5 1.5 5 4z" /></svg>
  ),
};

function navWidthClass(label: string) {
  return {
    Home: "hover:w-20",
    Projects: "hover:w-24",
    Blog: "hover:w-20",
    Experience: "hover:w-28",
    GitHub: "hover:w-24",
    LinkedIn: "hover:w-24",
    "Schedule a meeting": "hover:w-32",
  }[label] ?? "hover:w-24";
}

function SocialButton({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const sharedClassName =
    `group inline-flex h-9 w-9 items-center justify-start overflow-hidden rounded-full border border-transparent bg-transparent pl-2 text-ink-deep transition-[width,background-color,color,border-color,box-shadow] duration-300 ease-out ${navWidthClass(
      item.label,
    )} hover:bg-ink-deep/8 hover:text-ink-deep`;

  const content = (
    <span className="flex min-w-0 items-center gap-1.25">
      <span className="size-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-px group-hover:scale-110">{item.icon}</span>
      <span className="whitespace-nowrap font-display text-[10px] font-medium tracking-tight opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-hover:delay-75">
        {item.label}
      </span>
    </span>
  );

  if (!item.external) {
    return (
      <a href={item.href} onClick={onClick} aria-label={item.label} className={sharedClassName}>
        {content}
      </a>
    );
  }

  return (
    <a href={item.href} target="_blank" rel="noreferrer" onClick={onClick} aria-label={item.label} className={sharedClassName}>
      {content}
    </a>
  );
}

function PageLink({ to, label, icon }: { to: "/" | "/projects" | "/blog" | "/experience"; label: string; icon: ReactNode }) {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link
      to={to}
      className={`group inline-flex h-9 w-9 items-center justify-start overflow-hidden rounded-full px-2 font-display text-[10px] font-medium tracking-tight transition-[width,background-color,color,border-color,box-shadow] duration-300 ease-out ${navWidthClass(label)} hover:bg-ink-deep/8 hover:text-ink-deep ${active ? "bg-ink-deep/12 text-ink-deep" : "bg-transparent text-ink-deep"}`}
    >
      <span className="flex min-w-0 items-center gap-1.25">
        <span className="size-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-px group-hover:scale-110">{icon}</span>
        <span className="whitespace-nowrap opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          {label}
        </span>
      </span>
    </Link>
  );
}

export function Nav() {
  const { season, setSeason } = useSeason();

  return (
    <header className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 pb-[env(safe-area-inset-bottom)] md:bottom-auto md:top-6 md:pb-0">
      <div className="pointer-events-auto w-auto max-w-195">
        <div className="flex flex-nowrap items-center justify-center gap-1.25 overflow-visible rounded-full bg-background/88 px-1.5 py-1 shadow-[0_22px_54px_-28px_rgba(0,0,0,0.32)] backdrop-blur-2xl backdrop-saturate-150 md:px-2.5 md:py-1.5">
          <nav className="flex items-center gap-1">
            <PageLink to="/" label="Home" icon={Icon.home} />
            <PageLink to="/projects" label="Projects" icon={Icon.project} />
            <PageLink to="/blog" label="Blog" icon={Icon.blog} />
            <PageLink to="/experience" label="Experience" icon={Icon.experience} />
          </nav>

          <span className="mx-0.5 h-5 w-px bg-ink-deep/12" aria-hidden />

          <div className="flex flex-nowrap items-center gap-0.5">
            {socialNav.map((item, index) => (
              <Fragment key={item.label}>
                {index > 0 && <span className="mx-0.5 h-5 w-px bg-ink-deep/12" aria-hidden />}
                <SocialButton item={item} />
              </Fragment>
            ))}

            <span className="mx-0.5 h-5 w-px bg-ink-deep/12" aria-hidden />

            <button
              onClick={() => setSeason(season === "sunny" ? "night" : "sunny")}
              aria-label="Toggle light and dark mode"
              className="group flex size-9 items-center justify-center rounded-full bg-transparent text-ink-deep transition-colors hover:bg-ink-deep/8 hover:text-ink-deep"
            >
              <span className="size-4 transition-transform duration-300 group-hover:-translate-y-px group-hover:scale-110">
                {seasonGlyph[season]}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}