import p1 from "@/assests/project-1.jpg";
import p2 from "@/assests/project-2.jpg";
import p3 from "@/assests/project-3.jpg";
import { Reveal } from "./Reveal";

type Project = {
  num: string;
  year: string;
  role: string;
  name: string;
  tag: string;
  summary: string;
  stack: string[];
  metric: { value: string; label: string };
  image: string;
  side: "left" | "right";
  aspect: string;
  imageLightness: "light" | "dark";
};

const projects: Project[] = [
  {
    num: "01",
    year: "2024 — Now",
    role: "Founding engineer",
    name: "Verol Analytics",
    tag: "Product · AI workspace",
    summary:
      "An analytics surface for product teams that replaces dashboards with a writeable, queryable workspace. Built from a blank file to 1,200 active teams.",
    stack: ["Next.js", "ClickHouse", "tRPC", "OpenAI"],
    metric: { value: "−68%", label: "Median query latency" },
    image: p1,
    side: "left",
    aspect: "aspect-[4/5]",
    imageLightness: "light",
  },
  {
    num: "02",
    year: "2023",
    role: "Tech lead",
    name: "Quill Commands",
    tag: "Internal tooling · Engineering",
    summary:
      "A keyboard-first command surface unifying ten scattered tools into one canvas. Used 42 times a day, on average, by every engineer on the team.",
    stack: ["Electron", "Rust", "SQLite"],
    metric: { value: "94%", label: "Weekly adoption" },
    image: p2,
    side: "right",
    aspect: "aspect-video",
    imageLightness: "light",
  },
  {
    num: "03",
    year: "2022",
    role: "Senior engineer",
    name: "Northwind Pay",
    tag: "Fintech · Payments console",
    summary:
      "A payments console rebuilt from first principles — fast, calm, and honest about complexity. Reconciliation moved from nightly batch to real time.",
    stack: ["React", "Go", "Postgres"],
    metric: { value: "−41%", label: "Support tickets" },
    image: p3,
    side: "left",
    aspect: "aspect-[5/4]",
    imageLightness: "light",
  },
];

export function SelectedWork() {
  return (
    <section id="work" className="relative pt-32 pb-12 md:pt-48">
      <div className="container-edge">
        <Reveal>
          <div className="flex items-baseline justify-between border-t border-ink-deep pt-6">
            <p className="eyebrow">[ Sec. 02 ] Selected Work</p>
            <p className="hidden text-[11px] uppercase tracking-[0.2em] opacity-60 md:block">
              Three of fourteen · 2022 — 2025
            </p>
          </div>
        </Reveal>
      </div>

      <div className="mt-24 space-y-40 md:space-y-64">
        {projects.map((p) => (
          <ProjectBlock key={p.num} project={p} />
        ))}
      </div>
    </section>
  );
}

function ProjectBlock({ project }: { project: Project }) {
  const isLeft = project.side === "left";
  const textColor = project.imageLightness === "light" ? "text-ink-deep" : "text-foreground";
  const borderColor = project.imageLightness === "light" ? "border-ink-deep" : "border-foreground";
  const accentColor = project.imageLightness === "light" ? "text-ink-deep" : "text-foreground";
  
  return (
    <article className="container-edge relative">
      {/* Giant numeral */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -top-16 select-none font-display text-[14rem] font-bold leading-none text-surface md:-top-32 md:text-[18rem] ${
          isLeft ? "left-0 md:-left-4" : "right-0 md:-right-4"
        }`}
      >
        {project.num}
      </div>

      <div
        className={`relative flex flex-col ${
          isLeft ? "items-start" : "items-end"
        }`}
      >
        {/* Image plate */}
        <Reveal
          className={`relative z-10 w-full md:w-3/5 ${
            isLeft ? "md:-ml-4" : "md:-mr-4"
          }`}
        >
          <div className={`relative w-full overflow-hidden bg-surface ${project.aspect}`}>
            <img
              src={project.image}
              alt={`${project.name} interface`}
              loading="lazy"
              width={1600}
              height={1100}
              className="size-full object-cover grayscale transition-all duration-1400 ease-out hover:grayscale-0 hover:scale-[1.02]"
            />
            <span className="absolute left-4 top-4 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-background mix-blend-difference">
              FR_{project.num}
            </span>
          </div>
        </Reveal>

        {/* Caption — slipped over and into the opposite margin */}
        <Reveal
          delay={0.1}
          className={`relative z-20 -mt-12 max-w-xl md:-mt-28 ${
            isLeft ? "ml-auto lg:mr-24" : "mr-auto lg:ml-24"
          }`}
        >
          <div className="bg-background/0 px-6 py-6 md:px-0">
            <p className="eyebrow mb-4">
              {project.year} · {project.role}
            </p>
            <h3 className={`font-display text-4xl font-medium tracking-tight ${textColor} md:text-6xl lg:text-7xl`}>
              {project.name}
            </h3>
            <p className={`mt-4 inline-block border-b ${borderColor} pb-1 text-[11px] uppercase tracking-[0.2em] ${textColor}`}>
              {project.tag}
            </p>
            <p className={`mt-6 text-[17px] leading-relaxed ${accentColor}`}>
              {project.summary}
            </p>

            <div className={`mt-8 flex flex-wrap items-end justify-between gap-6 border-t ${borderColor}/20 pt-6`}>
              <div>
                <p className={`font-display text-4xl font-medium tracking-tight ${textColor} md:text-5xl`}>
                  {project.metric.value}
                </p>
                <p className={`mt-1 text-[10px] uppercase tracking-[0.2em] ${textColor} opacity-60`}>
                  {project.metric.label}
                </p>
              </div>
              <ul className={`flex flex-wrap gap-x-4 gap-y-1 text-[11px] uppercase tracking-[0.18em] ${textColor} opacity-70`}>
                {project.stack.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>

            <a
              href="/schedule"
              className={`group mt-8 inline-flex items-center gap-3 font-display text-base font-medium ${textColor}`}
            >
              <span className={`border-b ${borderColor} pb-0.5`}>Discuss this project</span>
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </Reveal>
      </div>
    </article>
  );
}
