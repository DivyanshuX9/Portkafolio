import { Reveal } from "./Reveal";

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
            Let's build something <span className="italic font-light opacity-70">meaningful.</span>
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <a
            href="mailto:divyanshu88999@gmail.com"
            className="group mt-12 inline-block max-w-full wrap-break-word font-display text-[clamp(2rem,7vw,6.5rem)] font-bold leading-[0.95] tracking-tighter text-ink-deep transition-opacity hover:opacity-60"
          >
            divyanshu88999@gmail.com
            <span aria-hidden className="ml-3 inline-block translate-y-[-0.15em] text-3xl opacity-60 transition-transform group-hover:translate-x-2 md:text-5xl">↗</span>
          </a>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-16 flex flex-wrap items-end justify-between gap-8 border-t border-ink-deep/15 pt-8">
            <ul className="flex flex-wrap gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.22em]">
              {socials.map((s) => (
                <li key={s.label}>
                  {s.href.startsWith("/") ? (
                    <a href={s.href} className="transition-opacity hover:opacity-50">
                      {s.label}
                    </a>
                  ) : (
                    <a href={s.href} target="_blank" rel="noreferrer" className="transition-opacity hover:opacity-50">
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
