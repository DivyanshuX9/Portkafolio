import { Link, useLocation } from "@tanstack/react-router";
import { Fragment, type ReactNode } from "react";
import { useSeason, type Season } from "./season-context";

type NavItem = {
  href: string;
  label: string;
  external?: boolean;
  icon: ReactNode;
};

const Icon = {
  home: (
    <svg
      className="block size-full"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v10h14V10" />
    </svg>
  ),
  experience: (
    <svg
      className="block size-full"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </svg>
  ),
  project: (
    <svg
      className="block size-full"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="8 6 2 12 8 18" />
      <polyline points="16 6 22 12 16 18" />
    </svg>
  ),
  blog: (
    <svg
      className="block size-full"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
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
    <svg
      className="block size-full"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <circle cx="12" cy="15" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  ),
};

const socialNav: NavItem[] = [
  {
    href: "https://github.com/DivyanshuX9",
    label: "GitHub",
    icon: Icon.github,
    external: true,
  },
  {
    href: "https://www.linkedin.com/in/mr-divyanshu",
    label: "LinkedIn",
    icon: Icon.linkedin,
    external: true,
  },
  {
    href: "/schedule",
    label: "Schedule a meeting",
    icon: Icon.calendar,
    external: false,
  },
];

const seasonGlyph: Record<Season, ReactNode> = {
  light: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  ),
  dark: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  ),
};

const navLinkBase =
  "group inline-flex h-9 w-9 items-center justify-start overflow-hidden rounded-full px-1.5 font-display text-[11px] font-medium tracking-tight transition-[width,padding,transform,background-color,color,border-color,box-shadow,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[width] hover:-translate-y-0.5 hover:pr-3 md:h-10 md:w-10 md:justify-start md:px-1.5 md:hover:w-auto md:hover:pr-3";

const navLinkIdle =
  "bg-transparent text-ink-deep md:border md:border-transparent md:hover:border-border/60 md:hover:bg-surface/75 md:hover:shadow-sm";

const navLinkActive =
  "bg-ink-deep/12 text-ink-deep md:border md:border-ink-deep md:bg-ink-deep md:text-background md:shadow-sm";

const iconWrap =
  "size-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-px group-hover:scale-110 md:size-5";

const labelBase =
  "whitespace-nowrap opacity-0 -translate-x-0.5 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100";

const labelSpacing = "ml-2 md:ml-2.5";

function PageLink({
  to,
  label,
  icon,
}: {
  to: "/" | "/projects" | "/blog" | "/experience";
  label: string;
  icon: ReactNode;
}) {
  const { pathname } = useLocation();
  const active = pathname === to;
  const cls = `${navLinkBase} ${active ? navLinkActive : navLinkIdle}`;

  return (
    <Link to={to} className={cls} aria-current={active ? "page" : undefined}>
      <span className={iconWrap}>{icon}</span>
      <span className={`${labelBase} ${labelSpacing}`}>
        {label}
      </span>
    </Link>
  );
}

function SocialButton({ item }: { item: NavItem }) {
  const cls = `${navLinkBase} ${navLinkIdle} md:px-3`;

  const content = (
    <>
      <span className={iconWrap}>{item.icon}</span>
      <span className={`${labelBase} ${labelSpacing}`}>
        {item.label}
      </span>
    </>
  );

  if (!item.external) {
    return (
      <a href={item.href} aria-label={item.label} className={cls}>
        {content}
      </a>
    );
  }

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      aria-label={item.label}
      className={cls}
    >
      {content}
    </a>
  );
}

export function Nav() {
  const { season, setSeason } = useSeason();

  return (
    <header className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 pb-[env(safe-area-inset-bottom)] md:bottom-auto md:top-6 md:pb-0">
      <div className="nav-scroll pointer-events-auto mx-auto w-fit max-w-[calc(100vw-2rem)] touch-pan-x overflow-x-auto md:max-w-240">
        <div className="flex w-max flex-nowrap items-center justify-start gap-1 rounded-full bg-background/92 px-2.5 py-1.5 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.34)] backdrop-blur-3xl backdrop-saturate-150 md:justify-center md:gap-2 md:px-4 md:py-2.5">
          <nav className="flex items-center gap-1">
            <PageLink to="/" label="Home" icon={Icon.home} />
            <PageLink to="/projects" label="Projects" icon={Icon.project} />
            <PageLink to="/blog" label="Blog" icon={Icon.blog} />
            <PageLink
              to="/experience"
              label="Experience"
              icon={Icon.experience}
            />
          </nav>

          <span className="mx-0.5 h-5 w-px bg-ink-deep/12" aria-hidden />

          <div className="flex flex-nowrap items-center gap-1">
            {socialNav.map((item, index) => (
              <Fragment key={item.label}>
                {index > 0 && (
                  <span
                    className="mx-0.5 hidden h-5 w-px bg-ink-deep/12 md:block"
                    aria-hidden
                  />
                )}
                <SocialButton item={item} />
              </Fragment>
            ))}

            <span
              className="mx-1 hidden h-5 w-px bg-ink-deep/12 md:mx-2 md:block"
              aria-hidden
            />

            <button
              onClick={() => setSeason(season === "light" ? "dark" : "light")}
              aria-label="Toggle light and dark mode"
              className="group inline-flex h-9 w-9 items-center justify-center rounded-full bg-transparent px-0 text-ink-deep transition-[transform,background-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-ink-deep/8 hover:text-ink-deep md:h-10 md:w-10"
            >
              <span className={iconWrap}>{seasonGlyph[season]}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
