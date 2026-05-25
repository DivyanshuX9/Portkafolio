import { Reveal } from "./Reveal";

const entries = [
  {
    date: "May 2025 - Mar 2026",
    title: "RideHub",
    location: "SWE · Full-stack build",
    body:
      "Built a unified ride aggregation platform with Next.js 15, FastAPI, and PostgreSQL, combining five transport services with real-road routing and booking history.",
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
    body:
      "Implemented voice-based intake, RAG summaries with Gemini API, and appointment flow integrations to improve triage and reduce booking friction for rural-first healthcare workflows.",
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
    body:
      "Designed a blockchain-audited document security system using AES-256-GCM field-level encryption, SHA-256 tamper checks, and role-based selective decryption.",
    initials: "RB",
    links: [{ label: "GitHub", href: "https://github.com/DivyanshuX9" }],
  },
  {
    date: "May 2025 - Jun 2025",
    title: "Walmart Sales Prediction",
    location: "Data Science · Forecasting",
    body:
      "Shipped a stacking regressor pipeline (XGBoost + Random Forest) with R-squared 0.965 and strong MAE reduction over linear baseline after feature engineering and EDA.",
    initials: "WM",
    links: [{ label: "GitHub", href: "https://github.com/DivyanshuX9" }],
  },
  {
    date: "Dec 2024 - Feb 2025",
    title: "Traffic Sign Recognition",
    location: "Data Science · Computer Vision",
    body:
      "Built a CNN for 43 traffic-sign classes using augmented GTSRB data and deployed low-latency inference with OpenCV for real-time video streams.",
    initials: "TS",
    links: [{ label: "GitHub", href: "https://github.com/DivyanshuX9" }],
  },
  {
    date: "Latest on LinkedIn",
    title: "Build logs and internship updates",
    location: "LinkedIn activity",
    body:
      "Posting project demos, architecture notes, and internship-ready learnings from SWE and Data Science work. Direct links are attached below.",
    initials: "LI",
    links: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/mr-divyanshu" }],
  },
];

export function CurrentWorkTimeline() {
  return (
    <section id="timeline" className="border-t border-ink-deep/15 py-20 md:py-24">
      <div className="container-edge">
        <Reveal>
          <div className="flex items-baseline justify-between border-t border-ink-deep pt-6">
            <p className="eyebrow">[ Sec. 03 ] Timeline</p>
            <p className="hidden text-[11px] uppercase tracking-[0.2em] opacity-60 md:block">
              Resume-backed work + LinkedIn highlights
            </p>
          </div>
        </Reveal>

        <ol className="mt-12 space-y-5">
          {entries.map((entry, index) => (
            <Reveal as="li" key={entry.title} delay={index * 0.05}>
              <article className="grid gap-6 rounded-[2rem] border border-ink-deep/12 bg-background/90 p-5 shadow-[0_22px_60px_-42px_rgba(0,0,0,0.28)] backdrop-blur-sm md:grid-cols-[auto,1fr] md:gap-8 md:p-6">
                <div className="flex items-start gap-4 md:flex-col md:items-center">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-ink-deep/15 bg-accent text-sm font-bold uppercase tracking-[0.2em] text-accent-foreground">
                    {entry.initials}
                  </div>
                  <div className="hidden h-full w-px bg-ink-deep/10 md:block" />
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] opacity-55">{entry.date}</p>
                  <h3 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink-deep md:text-4xl">
                    {entry.title}
                  </h3>
                  <p className="mt-2 text-sm uppercase tracking-[0.18em] opacity-60">
                    {entry.location}
                  </p>
                  <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-ink">
                    {entry.body}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {entry.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-full bg-ink-deep px-4 py-2 text-[12px] font-medium uppercase tracking-[0.18em] text-background transition-opacity hover:opacity-80"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
