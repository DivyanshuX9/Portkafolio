import { Reveal } from "./Reveal";

type Project = {
  num: string;
  year: string;
  tag: string;
  name: string;
  summary: string;
  stack: string[];
  metric: { value: string; label: string };
  github: string;
  side: "left" | "right";
};

const sweProjects: Project[] = [
  {
    num: "01",
    year: "2024 — 2025",
    tag: "Full-stack · Ride aggregation",
    name: "RideHub",
    summary:
      "Unified ride aggregation platform combining five transport services — buses, cabs, metro, autos, and mixed routes — with real-road routing, booking history, and a FastAPI + PostgreSQL backend. Built to solve the transport unification problem in Indian cities.",
    stack: ["Next.js 15", "FastAPI", "PostgreSQL", "React Native"],
    metric: { value: "5×", label: "Transport services unified" },
    github: "https://github.com/DivyanshuX9",
    side: "left",
  },
  {
    num: "02",
    year: "2025",
    tag: "Security · Blockchain audit",
    name: "RBAC-DocEncryption",
    summary:
      "Blockchain-audited document security system with AES-256-GCM field-level encryption, SHA-256 tamper detection, and role-based selective decryption. Designed for enterprise document workflows requiring immutable audit trails.",
    stack: ["Python", "AES-256-GCM", "SHA-256", "Blockchain"],
    metric: { value: "256-bit", label: "Field-level encryption" },
    github: "https://github.com/DivyanshuX9/RBAC-DocEncryption",
    side: "right",
  },
  {
    num: "03",
    year: "2025",
    tag: "Healthcare · SIH 2025",
    name: "NABHA Health",
    summary:
      "Telemedicine platform for rural India built for Smart India Hackathon 2025. Voice-based AI intake via Twilio + Bolna, adaptive wristband health monitoring, separate doctor and pharmacy interfaces, and offline-first design for low-connectivity areas.",
    stack: ["React", "FastAPI", "Twilio", "Bolna AI", "Gemini API"],
    metric: { value: "173", label: "Villages served (target)" },
    github: "https://github.com/DivyanshuX9",
    side: "left",
  },
];

const aiProjects: Project[] = [
  {
    num: "04",
    year: "2025",
    tag: "Data Science · Forecasting",
    name: "Walmart Sales Prediction",
    summary:
      "Stacking regressor pipeline combining XGBoost and Random Forest with feature engineering and EDA. Achieved R² of 0.965 and strong MAE reduction over a linear baseline across seasonal segments.",
    stack: ["Python", "XGBoost", "Random Forest", "Scikit-learn", "Pandas"],
    metric: { value: "0.965", label: "R² score" },
    github: "https://github.com/DivyanshuX9/Walmart-Sales-Prediction",
    side: "right",
  },
  {
    num: "05",
    year: "2024 — 2025",
    tag: "Computer Vision · CNN",
    name: "Traffic Sign Recognition",
    summary:
      "CNN trained on 43 traffic-sign classes using augmented GTSRB data. Deployed low-latency inference with OpenCV for real-time video streams, with identical preprocessing enforced between training and inference to eliminate the dominant error source.",
    stack: ["Python", "TensorFlow", "OpenCV", "GTSRB", "NumPy"],
    metric: { value: "43", label: "Sign classes" },
    github: "https://github.com/DivyanshuX9/Traffic-Sign-Recognition",
    side: "left",
  },
  {
    num: "06",
    year: "2025",
    tag: "AI · Voice + RAG",
    name: "NABHA Voice Intake",
    summary:
      "Voice-to-structured pipeline with retrieval-augmented summaries using Gemini API. Schema validation, confidence thresholds, and safe fallbacks ensure predictable UX. Error measured in user terms — time-to-correct and drop-off — not just model metrics.",
    stack: ["Python", "Gemini API", "Twilio", "RAG", "FastAPI"],
    metric: { value: "RAG", label: "Retrieval-augmented" },
    github: "https://github.com/DivyanshuX9",
    side: "right",
  },
];

function ProjectCard({ project }: { project: Project }) {
  const isLeft = project.side === "left";
  return (
    <article className="container-edge">
      <div aria-hidden className={`pointer-events-none absolute -top-12 select-none font-display text-[10rem] font-bold leading-none text-surface md:-top-24 md:text-[14rem] ${isLeft ? "left-0" : "right-0"}`}>
        {project.num}
      </div>
      <div className={`relative flex flex-col ${isLeft ? "items-start" : "items-end"}`}>
        <Reveal delay={0.05} className={`relative z-20 w-full max-w-2xl ${isLeft ? "" : "ml-auto"}`}>
          <div className="border border-border bg-background/80 p-6 md:p-8 backdrop-blur-sm">
            <p className="eyebrow mb-3">{project.year} · {project.tag}</p>
            <h3 className="font-display text-3xl font-medium tracking-tight text-foreground md:text-5xl">
              {project.name}
            </h3>
            <p className="mt-5 text-[15px] leading-relaxed text-foreground/80">
              {project.summary}
            </p>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-border pt-5">
              <div>
                <p className="font-display text-3xl font-medium tracking-tight text-foreground md:text-4xl">
                  {project.metric.value}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {project.metric.label}
                </p>
              </div>
              <ul className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {project.stack.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </div>

            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="group mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-foreground border-b border-border pb-0.5 transition-colors hover:border-foreground"
            >
              View on GitHub
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </Reveal>
      </div>
    </article>
  );
}

export function SelectedWork() {
  return (
    <>
      {/* SWE Section */}
      <section id="work" className="relative pt-20 pb-8 md:pt-32">
        <div className="container-edge">
          <Reveal>
            <div className="flex items-baseline justify-between border-t border-ink-deep pt-6">
              <p className="eyebrow">[ Sec. 02 ] Software Engineering</p>
              <p className="hidden text-[11px] uppercase tracking-[0.2em] opacity-60 md:block">
                Full-stack · Security · Systems
              </p>
            </div>
          </Reveal>
        </div>
        <div className="relative mt-16 space-y-20 md:space-y-32">
          {sweProjects.map((p) => <ProjectCard key={p.num} project={p} />)}
        </div>
      </section>

      {/* AI & DS Section */}
      <section id="ai-projects" className="relative pt-20 pb-8 md:pt-32">
        <div className="container-edge">
          <Reveal>
            <div className="flex items-baseline justify-between border-t border-ink-deep pt-6">
              <p className="eyebrow">[ Sec. 03 ] AI & Data Science</p>
              <p className="hidden text-[11px] uppercase tracking-[0.2em] opacity-60 md:block">
                ML · Computer Vision · Voice AI
              </p>
            </div>
          </Reveal>
        </div>
        <div className="relative mt-16 space-y-20 md:space-y-32">
          {aiProjects.map((p) => <ProjectCard key={p.num} project={p} />)}
        </div>
      </section>
    </>
  );
}
