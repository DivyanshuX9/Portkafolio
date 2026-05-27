import { Reveal } from "./Reveal";

type Entry = {
  date: string;
  title: string;
  location: string;
  body: string;
  tag: string;
  links: { label: string; href: string }[];
};

const entries: Entry[] = [
  {
    date: "May 2025 — Mar 2026",
    title: "RideHub",
    location: "Full-stack · SWE",
    tag: "SWE",
    body: "Built a unified ride aggregation platform with Next.js 15, FastAPI, and PostgreSQL, combining five transport services with real-road routing and booking history.",
    links: [
      { label: "GitHub", href: "https://github.com/DivyanshuX9" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/mr-divyanshu/" },
    ],
  },
  {
    date: "Aug 2025 — Oct 2025",
    title: "NABHA Health",
    location: "SWE + Applied AI · SIH 2025",
    tag: "AI",
    body: "Voice-based intake, RAG summaries with Gemini API, and appointment flow integrations for rural-first healthcare. Built for Smart India Hackathon 2025.",
    links: [
      { label: "GitHub", href: "https://github.com/DivyanshuX9" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/mr-divyanshu/" },
    ],
  },
  {
    date: "Mar 2025",
    title: "RBAC-DocEncryption",
    location: "Security Engineering",
    tag: "Security",
    body: "Blockchain-audited document security with AES-256-GCM field-level encryption, SHA-256 tamper checks, and role-based selective decryption.",
    links: [
      { label: "GitHub", href: "https://github.com/DivyanshuX9/RBAC-DocEncryption" },
    ],
  },
  {
    date: "May 2025 — Jun 2025",
    title: "Walmart Sales Prediction",
    location: "Data Science · Forecasting",
    tag: "DS",
    body: "Stacking regressor pipeline (XGBoost + Random Forest) with R² 0.965 and strong MAE reduction over linear baseline after feature engineering and EDA.",
    links: [
      { label: "GitHub", href: "https://github.com/DivyanshuX9/Walmart-Sales-Prediction" },
    ],
  },
  {
    date: "Dec 2024 — Feb 2025",
    title: "Traffic Sign Recognition",
    location: "Computer Vision · CNN",
    tag: "CV",
    body: "CNN for 43 traffic-sign classes on GTSRB data. Deployed low-latency inference with OpenCV for real-time video streams.",
    links: [
      { label: "GitHub", href: "https://github.com/DivyanshuX9/Traffic-Sign-Recognition" },
    ],
  },
  {
    date: "Ongoing",
    title: "Build logs & updates",
    location: "LinkedIn",
    tag: "Log",
    body: "Project demos, architecture notes, and internship-ready learnings from SWE and Data Science work.",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/mr-divyanshu/" },
    ],
  },
];

const tagColor: Record<string, string> = {
  SWE: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  AI: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  Security: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  DS: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  CV: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Log: "bg-surface text-muted-foreground border-border",
};

export function CurrentWorkTimeline() {
  return (
    <section
      id="timeline"
      className="border-t border-border bg-background py-20 md:py-24"
    >
      <div className="container-edge">
        <Reveal>
          <div className="flex items-baseline justify-between border-b border-border pb-6">
            <p className="eyebrow">[ Sec. 03 ] Timeline</p>
            <p className="hidden text-[11px] uppercase tracking-[0.2em] text-muted-foreground md:block">
              Resume-backed work
            </p>
          </div>
        </Reveal>

        {/* Mobile: stacked cards with clear separation */}
        <div className="mt-10 flex flex-col gap-0 md:hidden">
          {entries.map((entry, index) => (
            <Reveal key={entry.title} delay={index * 0.04}>
              <div className="relative">
                {/* Left accent bar */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-border" />
                <div className="absolute left-0 top-6 h-8 w-[3px] bg-ink-deep/60" />

                <div className="ml-5 border-b border-border py-6 last:border-b-0">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        {entry.date}
                      </p>
                      <h3 className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground">
                        {entry.title}
                      </h3>
                      <p className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        {entry.location}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] ${tagColor[entry.tag] ?? tagColor.Log}`}
                    >
                      {entry.tag}
                    </span>
                  </div>

                  {/* Body */}
                  <p className="mt-3 text-[14px] leading-relaxed text-foreground/75">
                    {entry.body}
                  </p>

                  {/* Links */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {entry.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-surface/50 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-foreground transition-colors hover:bg-surface"
                      >
                        {link.label}
                        <svg className="size-2.5 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M7 17L17 7M17 7H7M17 7v10" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Desktop: original two-column layout */}
        <ol className="mt-12 hidden space-y-0 md:block">
          {entries.map((entry, index) => (
            <li key={entry.title} className="list-none">
              <Reveal delay={index * 0.05}>
                <article className="grid grid-cols-[auto_1fr] gap-x-8 border-b border-border py-8 last:border-b-0">
                  {/* Left: connector */}
                  <div className="flex flex-col items-center pt-1">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">
                        {entry.tag}
                      </span>
                    </div>
                    {index < entries.length - 1 && (
                      <div className="mt-3 w-px flex-1 bg-border" style={{ minHeight: "2rem" }} />
                    )}
                  </div>

                  {/* Right: content */}
                  <div className="min-w-0 pb-2">
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                        {entry.date}
                      </p>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        {entry.location}
                      </p>
                    </div>
                    <h3 className="mt-2 font-display text-2xl font-medium tracking-tight text-foreground lg:text-3xl">
                      {entry.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-foreground/80">
                      {entry.body}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {entry.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/40 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-surface"
                        >
                          {link.label}
                          <svg className="size-2.5 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 17L17 7M17 7H7M17 7v10" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
