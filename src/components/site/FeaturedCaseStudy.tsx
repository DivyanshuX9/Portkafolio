import cover from "@/assests/case-study.jpg";
import { Reveal } from "./Reveal";

const chapters = [
  { label: "Challenge", body: "Verol's product team was drowning in dashboards. Every team had built their own; nothing was trusted. Decisions stalled while people argued over which number was right." },
  { label: "Research", body: "Six weeks of interviews across 14 teams. The pattern was clear: people wanted answers, not charts. The unit of work was a question, not a metric." },
  { label: "Architecture", body: "A streaming query engine on ClickHouse, a document model that treats charts as first-class blocks, and an LLM layer that translates natural language into typed SQL." },
  { label: "Process", body: "Shipped weekly with five design partners. Every release went through a 30-minute critique. We killed three features that tested well but never got used." },
  { label: "Results", body: "Median time-to-answer dropped from 18 minutes to 40 seconds. Verol crossed 1,200 active teams within nine months and raised a Series A on the back of retention, not growth hacks." },
];

export function FeaturedCaseStudy() {
  return (
    <section id="case-study" className="relative mt-40 bg-ink-deep py-28 text-background md:py-40">
      <div className="container-edge">
        <Reveal>
          <div className="flex items-baseline justify-between border-t border-background/20 pt-6">
            <p className="text-[11px] uppercase tracking-[0.25em] opacity-60">
              [ Sec. 03 ] Featured Case Study
            </p>
            <p className="hidden text-[11px] uppercase tracking-[0.25em] opacity-60 md:block">
              Verol Analytics · 2024 — 2025
            </p>
          </div>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-24">
          <div className="md:col-span-7">
            <Reveal>
              <h2 className="font-display text-5xl font-bold leading-[0.9] tracking-tighter md:text-8xl">
                Atelier <br />
                <span className="opacity-50">Analytic.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-12 max-w-xl text-xl leading-[1.55] opacity-80">
                A study in restraint: how a three-person team replaced eleven
                dashboards with one writeable surface and earned the trust of
                operators who'd seen the promise broken before.
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-5">
            <Reveal>
              <div className="aspect-[3/4] overflow-hidden bg-ink">
                <img
                  src={cover}
                  alt="Quiet workspace with morning light"
                  loading="lazy"
                  width={1600}
                  height={1000}
                  className="size-full object-cover grayscale"
                />
              </div>
            </Reveal>
          </div>
        </div>

        {/* Chapters */}
        <ol className="mt-24 grid grid-cols-1 gap-x-12 gap-y-12 border-t border-background/20 pt-16 md:grid-cols-12">
          {chapters.map((c, i) => (
            <Reveal as="li" key={c.label} delay={i * 0.04} className="md:col-span-6 lg:col-span-4">
              <div className="flex items-baseline gap-4">
                <span className="font-display text-xs font-bold tracking-widest opacity-40 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-base font-medium uppercase tracking-[0.18em]">
                    {c.label}
                  </h3>
                  <p className="mt-4 text-[15px] leading-relaxed opacity-80">{c.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={0.1}>
          <a
            href="#"
            className="group mt-20 inline-flex items-center gap-4 font-display text-lg font-medium"
          >
            <span className="border-b border-background pb-1">View full study</span>
            <span aria-hidden className="transition-transform group-hover:translate-x-2">→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
