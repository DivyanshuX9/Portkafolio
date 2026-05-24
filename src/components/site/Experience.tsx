import { Reveal } from "./Reveal";

const roles = [
  { years: "2024 — Now", company: "Verol", title: "Founding engineer", blurb: "Building the analytics workspace from the first commit. Owning architecture, hiring engineering, shaping product direction." },
  { years: "2021 — 2024", company: "Northwind Labs", title: "Senior software engineer", blurb: "Led the rebuild of the payments console. Shipped real-time reconciliation and reduced support load by 41%." },
  { years: "2019 — 2021", company: "Hyperdraft", title: "Product engineer", blurb: "Joined as the third engineer. Helped take the editor from prototype to 80k weekly active writers." },
  { years: "2017 — 2019", company: "Independent", title: "Consulting engineer", blurb: "Worked with seed-stage teams on MVPs and zero-to-one product engineering across fintech and tooling." },
];

export function Experience() {
  return (
    <section id="experience" className="py-32 md:py-44">
      <div className="container-edge">
        <Reveal>
          <div className="flex items-baseline justify-between border-t border-ink-deep pt-6">
            <p className="eyebrow">[ Sec. 04 ] Experience</p>
            <p className="hidden text-[11px] uppercase tracking-[0.2em] opacity-60 md:block">
              Selected · 2017 — Present
            </p>
          </div>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <ul className="space-y-12">
              {roles.map((r, i) => (
                <Reveal as="li" key={r.company} delay={i * 0.04}>
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-xs opacity-40 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-display text-xl font-medium tracking-tight text-ink-deep">
                        {r.company}
                      </p>
                      <p className="mt-1 text-sm italic opacity-60">
                        {r.title} · {r.years}
                      </p>
                      <p className="mt-3 text-[14px] leading-relaxed opacity-80">
                        {r.blurb}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal className="md:col-start-7 md:col-span-6">
            <p className="eyebrow">Working belief</p>
            <p className="font-display mt-8 text-3xl font-light leading-[1.15] tracking-tight text-ink-deep md:text-5xl">
              Software should be as intentional as a well-bound book. Weight,
              rhythm, and clarity aren't just for print.
            </p>
            <p className="mt-12 max-w-md text-[15px] leading-relaxed opacity-70">
              I write code the way an editor cuts paragraphs — by removing
              what isn't earning its keep. Most teams I've joined ship more
              once we agree on what to delete.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
