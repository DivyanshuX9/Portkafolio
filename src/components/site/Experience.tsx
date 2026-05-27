import { Reveal } from "./Reveal";

type ExperienceItem = {
  title: string;
  meta: string;
  blurb: string;
  link?: { label: string; href: string };
};

type ExperienceSection = {
  title: string;
  subtitle: string;
  items: ExperienceItem[];
};

const experienceSections: ExperienceSection[] = [
  {
    title: "Patents",
    subtitle: "Research & applied invention",
    items: [
      {
        title: "Smart Self-Healing Drone Propellers",
        meta: "Filed · Team 2 · 23BDS1155 · Co-inventor: Saumyarup Guha",
        blurb:
          "Patent for a self-healing drone propeller system combining self-healing polymers (microcapsule crack repair), shape memory alloys (deformation recovery via heat), and on-blade damage sensors feeding a microcontroller that autonomously decides when and how to trigger healing — mid-flight, without landing. Reduces maintenance cost, eliminates manual repair for minor damage, and extends propeller operational life.",
      },
    ],
  },
  {
    title: "Leadership",
    subtitle: "Teams, mentoring, and shipping clarity",
    items: [
      {
        title: "Team Lead — VIT-ISH Hackathon 2025",
        meta: "NABHA Health · Smart India Hackathon qualifier",
        blurb:
          "Led a six-person team through the full arc of SIH 2025 Problem Statement SIH25018 — from problem framing and architecture decisions to a live demo under competition conditions. Owned scope, split work across voice AI, wristband simulation, and multi-role interfaces, and kept the team aligned when the brief changed mid-build. The team qualified and presented at VIT-ISH 2025.",
        link: {
          label: "LinkedIn post",
          href: "https://www.linkedin.com/posts/mr-divyanshu_hackathon-vitish25-teamwork-ugcPost-7386713810969088000-SfbF/",
        },
      },
    ],
  },
  {
    title: "Open Source",
    subtitle: "Shipping in public",
    items: [
      {
        title: "Node.js Core — PR #63491",
        meta: "nodejs/node · Merged contribution",
        blurb:
          "Contributed to the Node.js core repository. The PR addresses an edge case in the runtime and was reviewed and merged by the Node.js core team. Working on a codebase used by millions of developers in production is a different kind of accountability — every line has to justify itself.",
        link: {
          label: "View on GitHub",
          href: "https://github.com/nodejs/node/pull/63491#issuecomment-4543021213",
        },
      },
    ],
  },
  {
    title: "Work Experience",
    subtitle: "Projects & product engineering",
    items: [
      {
        title: "Full-stack & AI Engineering",
        meta: "2024 — Present · Independent projects",
        blurb:
          "Built and shipped end-to-end systems across transport aggregation (RideHub), rural healthcare AI (NABHA), document security (RBAC-DocEncryption), and ML forecasting (Walmart Sales). Each project ran from blank file to working product — API design, data modelling, frontend, and deployment.",
      },
    ],
  },
];

export function Experience() {
  return (
    <section id="experience" className="py-32 md:py-44">
      <div className="container-edge">
        <Reveal>
          <div className="flex items-baseline justify-between border-t border-ink-deep pt-6">
            <p className="eyebrow">[ Sec. 04 ] Experience</p>
            <p className="hidden text-[11px] uppercase tracking-[0.2em] opacity-60 md:block">
              Selected highlights
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-10 md:mt-20 md:grid-cols-2">
          {experienceSections.map((section, sectionIndex) => (
            <Reveal key={section.title} delay={sectionIndex * 0.05}>
              <div className="flex h-full flex-col rounded-none border border-border bg-surface/35 p-6 md:p-8">
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  {section.subtitle}
                </p>
                <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">
                  {section.title}
                </p>

                <ul className="mt-6 flex flex-col gap-5">
                  {section.items.map((item) => (
                    <li key={item.title} className="border-t border-border pt-5">
                      <p className="font-display text-lg font-medium tracking-tight text-foreground">
                        {item.title}
                      </p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                        {item.meta}
                      </p>
                      <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                        {item.blurb}
                      </p>
                      {item.link && (
                        <a
                          href={item.link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="group mt-3 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-foreground transition-opacity hover:opacity-70"
                        >
                          {item.link.label}
                          <svg
                            className="size-2.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M7 17L17 7M17 7H7M17 7v10" />
                          </svg>
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
