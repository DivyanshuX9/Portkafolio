import { Reveal } from "./Reveal";

const entries = [
  {
    date: "May 2025 - Mar 2026",
    title: "RideHub",
    location: "SWE · Full-stack build",
    body: "Built a unified ride aggregation platform with Next.js 15, FastAPI, and PostgreSQL, combining five transport services with real-road routing and booking history.",
    initials: "RH",
    links: [
      { label: "GitHub", href: "https://github.com/DivyanshuX9" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/mr-divyanshu" },
    ],
  },
  {
    date: "Aug 2025 - Oct 2025",
    title: "NABHA Health (SIH 2025)",
    location: "SWE + Applied AI",
    body: "Implemented voice-based intake, RAG summaries with Gemini API, and appointment flow integrations to improve triage and reduce booking friction for rural-first healthcare workflows.",
    initials: "NH",
    links: [
      { label: "GitHub", href: "https://github.com/DivyanshuX9" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/mr-divyanshu" },
    ],
  },
  {
    date: "Mar 2025",
    title: "RBAC-DocEncryption",
    location: "Security engineering",
    body: "Designed a blockchain-audited document security system using AES-256-GCM field-level encryption, SHA-256 tamper checks, and role-based selective decryption.",
    initials: "RB",
    links: [{ label: "GitHub", href: "https://github.com/DivyanshuX9" }],
  },
  {
    date: "May 2025 - Jun 2025",
    title: "Walmart Sales Prediction",
    location: "Data Science · Forecasting",
    body: "Shipped a stacking regressor pipeline (XGBoost + Random Forest) with R-squared 0.965 and strong MAE reduction over linear baseline after feature engineering and EDA.",
    initials: "WM",
    links: [{ label: "GitHub", href: "https://github.com/DivyanshuX9" }],
  },
  {
    date: "Dec 2024 - Feb 2025",
    title: "Traffic Sign Recognition",
    location: "Data Science · Computer Vision",
    body: "Built a CNN for 43 traffic-sign classes using augmented GTSRB data and deployed low-latency inference with OpenCV for real-time video streams.",
    initials: "TS",
    links: [{ label: "GitHub", href: "https://github.com/DivyanshuX9" }],
  },
  {
    date: "Latest on LinkedIn",
    title: "Build logs and internship updates",
    location: "LinkedIn activity",
    body: "Posting project demos, architecture notes, and internship-ready learnings from SWE and Data Science work. Direct links are attached below.",
    initials: "LI",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/mr-divyanshu" },
    ],
  },
];

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
              Resume-backed work + LinkedIn highlights
            </p>
          </div>
        </Reveal>

        <ol className="mt-12 space-y-8 sm:mt-16 sm:space-y-10">
          {entries.map((entry, index) => (
            <li key={entry.title} className="list-none">
              <Reveal delay={index * 0.05}>
                <article className="flex min-w-0 flex-col gap-4 sm:flex-row sm:gap-8">
                  <div className="flex flex-col items-center gap-4 shrink-0">
                    <div className="flex size-10 items-center justify-center rounded-full border border-border bg-surface text-xs font-bold uppercase tracking-[0.2em] text-foreground">
                      {entry.initials}
                    </div>
                    <div className="h-10 w-px bg-foreground/35 sm:h-24" />
                  </div>

                  <div className="min-w-0 pb-4">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      {entry.date}
                    </p>
                    <h3 className="mt-2 break-words font-display text-2xl font-medium tracking-tight text-foreground md:text-3xl">
                      {entry.title}
                    </h3>
                    <p className="mt-1 text-sm uppercase tracking-[0.18em] text-muted-foreground">
                      {entry.location}
                    </p>
                    <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-foreground">
                      {entry.body}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {entry.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center rounded-lg border border-border bg-surface/30 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-surface/50"
                        >
                          {link.label}
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
