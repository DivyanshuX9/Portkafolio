import { Reveal } from "./Reveal";

import dataScientistResume from "../../assests/Divyanshu_DS_2026.pdf";
import sweResume from "../../assests/Divyanshu_SWE_RESUME.pdf";

const resumeLinks = [
  {
    label: "Download DS Resume",
    href: dataScientistResume,
    note: "Data science focused version",
    downloadName: "Divyanshu_Sharma_Data_Scientist_Resume.pdf",
  },
  {
    label: "Download SWE Resume",
    href: sweResume,
    note: "Software engineering version",
    downloadName: "Divyanshu_Sharma_SWE_Resume.pdf",
  },
];

const socials = [
  { label: "Email", href: "mailto:divyanshu88999@gmail.com" },
  { label: "GitHub", href: "https://github.com/DivyanshuX9" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/mr-divyanshu" },
  { label: "Schedule a meeting", href: "/schedule" },
  { label: "Projects", href: "/projects" },
];

export function Contact() {
  return (
    <section id="contact" className="border-t border-surface pt-16 pb-8">
      <div className="container-edge">
        <Reveal>
          <p className="eyebrow mb-12">[ Sec. 07 ] Get in touch</p>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="font-display max-w-[18ch] text-4xl font-medium leading-none tracking-tight text-ink-deep md:text-7xl">
            Let's build something{" "}
            <span className="italic font-light opacity-70">meaningful.</span>
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <a
            href="mailto:divyanshu88999@gmail.com"
            className="group mt-12 inline-block max-w-full break-words font-display text-[clamp(2rem,7vw,6.5rem)] font-bold leading-[0.95] tracking-tighter text-ink-deep transition-opacity hover:opacity-60"
          >
            divyanshu88999@gmail.com
            <span
              aria-hidden
              className="ml-3 inline-block translate-y-[-0.15em] text-3xl opacity-60 transition-transform group-hover:translate-x-2 md:text-5xl"
            >
              ↗
            </span>
          </a>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-10 grid gap-3 md:max-w-3xl md:grid-cols-2">
            <a
              href="/schedule"
              className="group flex flex-col justify-between rounded-2xl border border-ink-deep/20 bg-ink-deep p-5 text-background shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg md:col-span-2"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] opacity-85">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Meeting Scheduler
                </span>
                <span className="rounded-full border border-background/20 bg-background/10 px-2.5 py-0.5 text-[10px] font-mono font-medium">
                  Instant Cal.com Sync
                </span>
              </div>
              <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="font-display text-2xl font-bold tracking-tight">
                    Book a 1-on-1 Technical Session
                  </p>
                  <p className="mt-1.5 max-w-xl text-xs leading-relaxed opacity-80">
                    Interactive calendar picker, timezone conversion, meeting passes, and direct project discovery.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink-deep transition-transform group-hover:translate-x-1">
                  Schedule now →
                </span>
              </div>
            </a>

            {resumeLinks.map((resume) => (
              <a
                key={resume.label}
                href={resume.href}
                download={resume.downloadName}
                className="group rounded-2xl border border-border bg-surface/40 p-4 transition-colors hover:bg-surface"
              >
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Resume
                </p>
                <p className="mt-2 font-display text-xl font-medium tracking-tight text-ink-deep">
                  {resume.label}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {resume.note}
                </p>
                <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-ink-deep transition-transform group-hover:translate-x-1">
                  Download now →
                </p>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-16 flex flex-wrap items-end justify-between gap-8 border-t border-ink-deep/15 pt-8">
            <ul className="flex flex-wrap gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.22em]">
              {socials.map((s) => (
                <li key={s.label}>
                  {s.href.startsWith("/") ? (
                    <a
                      href={s.href}
                      className="transition-opacity hover:opacity-50"
                    >
                      {s.label}
                    </a>
                  ) : (
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="transition-opacity hover:opacity-50"
                    >
                      {s.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <p className="text-[11px] uppercase tracking-[0.22em] opacity-60">
              Based in India · Reply within 48h
            </p>
          </div>
        </Reveal>

        <div className="mt-16 flex flex-col items-start justify-between gap-3 text-[10px] uppercase tracking-[0.25em] opacity-40 md:flex-row md:items-end">
          <span>© 2026 Divyanshu Sharma · Built with intent</span>
          <span className="tabular-nums">Index 01 · V.01 · May 2026</span>
        </div>
      </div>
    </section>
  );
}
