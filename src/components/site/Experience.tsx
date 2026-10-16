import { Reveal } from "./Reveal";

type ExperienceItem = {
  title: string;
  meta: string;
  blurb: string;
  badge?: string;
  link?: { label: string; href: string };
};

type ExperienceSection = {
  title: string;
  subtitle: string;
  items: ExperienceItem[];
};

const experienceSections: ExperienceSection[] = [
  {
    title: "Certifications & Credentials",
    subtitle: "Verified Technical Standards",
    items: [
      {
        title: "IBM – Advanced Generative AI",
        meta: "IBM Career Education Program · Cognitive Class · July 2026",
        badge: "Credential ID: CEGENAI1IN",
        blurb:
          "Official certification powered by IBM Developer Skills Network and IBM Technology Expert Labs (Country Manager Jagadisha Bhat). Validates mastery in Large Language Model (LLM) fine-tuning, prompt engineering, Retrieval-Augmented Generation (RAG), and production agent architectures. Associated credential code: khfIPYurf6 (Prolearn / Adroit Technologies).",
        link: {
          label: "Verify Official Certificate ↗",
          href: "https://courses.ibmcep.cognitiveclass.ai/certificates/d3a570e88dc6474ba1f97f5321c5d887",
        },
      },
    ],
  },
  {
    title: "Honors & Competitions",
    subtitle: "National & Global Benchmarks",
    items: [
      {
        title: "Amazon ML Challenge 2026",
        meta: "Amazon · Sep 2026 · Team VIT",
        badge: "AIR 698 · Score 0.9839",
        blurb:
          "Ranked 698 nationwide with a composite benchmark score of 0.983906 competing against premier engineering institutions across India. Built resilient multi-modal feature engineering, stacking ensembles, and deep neural regressors for large-scale prediction tasks.",
        link: {
          label: "LinkedIn Profile",
          href: "https://www.linkedin.com/in/mr-divyanshu/",
        },
      },
      {
        title: "WorldQuant International Quant Championship (IQC) 2026",
        meta: "WorldQuant · National Finalist · Mumbai",
        badge: "AIR 6 · World 26",
        blurb:
          "Achieved All India Rank 6 and World Rank 26 out of 150,000+ teams globally representing VIT at the National Finals in Mumbai with Team Simpson's Paradox. Formulated statistical alphas, predictive signals, and mathematical models across global equity markets.",
        link: {
          label: "LinkedIn Post",
          href: "https://www.linkedin.com/in/mr-divyanshu/",
        },
      },
    ],
  },
  {
    title: "Patents & Research",
    subtitle: "Invention & Biomechanics R&D",
    items: [
      {
        title: "Smart Self-Healing Drone Propellers",
        meta: "Patent Filed · Application 23BDS1155 · Co-inventor: Saumyarup Guha",
        badge: "Patent Filed",
        blurb:
          "Autonomous self-healing drone propeller system integrating microencapsulated healing polymers, shape-memory alloys (SMA) for thermal deformation recovery, and embedded piezoelectric crack-detection sensors connected to an onboard microcontroller that activates in-flight healing without landing.",
      },
      {
        title: "AI Enabled Monocular Gait Analysis",
        meta: "Capstone Research · VIT Chennai · Co-author: Debeshi Sen",
        badge: "70.7% Balanced Acc",
        blurb:
          "Monocular clinical gait analysis pipeline for neurological disorders (Cerebral Palsy, Stroke, Myopathic, Normal). Integrates YOLOv8 + ByteTrack tracking, 147-D pelvic-scaled kinematic pose features, and 28-D RAFT dense optical flow into dilated Temporal Convolutional Networks (TCN) under strict video-grouped cross-validation. Supervised by Dr. Pavithra L K.",
      },
    ],
  },
  {
    title: "Leadership & Hackathons",
    subtitle: "Teams, Mentoring, and Execution",
    items: [
      {
        title: "Team Lead — VIT-ISH Hackathon 2025",
        meta: "NABHA Health · Smart India Hackathon qualifier",
        badge: "SIH Qualifier",
        blurb:
          "Led a six-person engineering team tackling SIH Problem Statement SIH25018. Architected voice-based medical triage, cellular-optimized health records, and offline-first sync. Selected as finalist and presented live under competition conditions at VIT-ISH 2025.",
        link: {
          label: "LinkedIn Post",
          href: "https://www.linkedin.com/posts/mr-divyanshu_hackathon-vitish25-teamwork-ugcPost-7386713810969088000-SfbF/",
        },
      },
    ],
  },
  {
    title: "Open Source",
    subtitle: "Shipping in Public",
    items: [
      {
        title: "Node.js Core — PR #63491",
        meta: "nodejs/node · Merged Contribution",
        badge: "Merged",
        blurb:
          "Contributed to Node.js core runtime repository. Resolved edge-case behavior in runtime internals; reviewed, approved, and merged into the main codebase by the Node.js core maintainers.",
        link: {
          label: "View on GitHub",
          href: "https://github.com/nodejs/node/pull/63491#issuecomment-4543021213",
        },
      },
    ],
  },
  {
    title: "Production Engineering",
    subtitle: "Products & Systems Built",
    items: [
      {
        title: "Full-Stack & Applied Machine Learning",
        meta: "2024 — Present · Independent & Capstone Systems",
        badge: "7 Systems",
        blurb:
          "Shipped end-to-end production systems across transport aggregation (RideHub), adaptive traffic infrastructure (Weather-Based Traffic Signal Model), blockchain security (RBAC-DocEncryption), and clinical biomechanics. Built with Next.js 15, FastAPI, PyTorch, and PostgreSQL.",
      },
    ],
  },
];

export function Experience() {
  return (
    <section id="experience" className="py-20 sm:py-28 md:py-36">
      <div className="container-edge">
        <Reveal>
          <div className="flex items-baseline justify-between border-t border-ink-deep pt-6">
            <p className="eyebrow">[ Sec. 04 ] Experience</p>
            <p className="hidden text-[11px] uppercase tracking-[0.2em] opacity-60 md:block">
              Certifications · Patents · Leadership
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:gap-8 sm:mt-16 md:grid-cols-2 lg:gap-10">
          {experienceSections.map((section, sectionIndex) => (
            <Reveal key={section.title} delay={sectionIndex * 0.04}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-surface/35 p-5 sm:p-7 md:p-8 backdrop-blur-xs shadow-xs transition-colors hover:border-foreground/20">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-medium">
                    {section.subtitle}
                  </p>
                </div>
                <p className="mt-1.5 font-display text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                  {section.title}
                </p>

                <ul className="mt-5 flex flex-col gap-4 sm:gap-5">
                  {section.items.map((item) => (
                    <li key={item.title} className="border-t border-border pt-4 sm:pt-5 first:border-t-0 first:pt-2">
                      <div className="flex flex-wrap items-baseline justify-between gap-1.5">
                        <p className="font-display text-base sm:text-lg font-medium tracking-tight text-foreground">
                          {item.title}
                        </p>
                        {item.badge && (
                          <span className="rounded-full border border-foreground/20 bg-background/80 px-2 py-0.5 text-[9px] sm:text-[10px] font-mono font-medium text-foreground">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {item.meta}
                      </p>
                      <p className="mt-2 text-xs sm:text-[14px] leading-relaxed text-muted-foreground">
                        {item.blurb}
                      </p>
                      {item.link && (
                        <a
                          href={item.link.href}
                          target={item.link.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.link.href.startsWith("http") ? "noreferrer" : undefined}
                          className="group mt-2.5 inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.18em] text-foreground transition-opacity hover:opacity-70 active:scale-95"
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
