import { Reveal } from "./Reveal";

import caseStudyImg from "@/assests/case-study.jpg";
import project1Img from "@/assests/project-1.jpg";
import project2Img from "@/assests/project-2.jpg";
import project3Img from "@/assests/project-3.jpg";

type Project = {
  num: string;
  year: string;
  tag: string;
  category: "swe" | "ai" | "security" | "ds";
  name: string;
  summary: string;
  stack: string[];
  metric: { value: string; label: string };
  github: string;
  image: string;
  side: "left" | "right";
};

const allProjectsList: Project[] = [
  {
    num: "01",
    year: "2024 — 2025",
    tag: "Full-stack · Transport Aggregation",
    category: "swe",
    name: "RideHub",
    summary:
      "Unified ride aggregation platform combining five transport services — buses, cabs, metro, autos, and mixed routes — with real-road routing, booking history, and a FastAPI + PostgreSQL backend. Built to solve transport fragmentation in Indian cities.",
    stack: ["Next.js 15", "FastAPI", "PostgreSQL", "React Native"],
    metric: { value: "5×", label: "Transport services unified" },
    github: "https://github.com/DivyanshuX9",
    image: project1Img,
    side: "left",
  },
  {
    num: "02",
    year: "2025",
    tag: "Security · Field Encryption",
    category: "security",
    name: "RBAC-DocEncryption",
    summary:
      "Blockchain-audited document security system with AES-256-GCM field-level encryption, SHA-256 tamper detection, and role-based selective decryption. Built for high-integrity document workflows requiring verifiable audit trails.",
    stack: ["Python", "AES-256-GCM", "SHA-256", "Blockchain"],
    metric: { value: "256-bit", label: "Field-level encryption" },
    github: "https://github.com/DivyanshuX9/RBAC-DocEncryption",
    image: project2Img,
    side: "right",
  },
  {
    num: "03",
    year: "2025",
    tag: "Healthcare · SIH 2025",
    category: "ai",
    name: "NABHA Health",
    summary:
      "Telemedicine platform for rural India built for Smart India Hackathon 2025. Voice-based AI intake via Twilio + Bolna, adaptive wristband health monitoring, doctor & pharmacy portals, and offline-first data sync.",
    stack: ["React", "FastAPI", "Twilio", "Bolna AI", "Gemini API"],
    metric: { value: "173", label: "Villages served (target)" },
    github: "https://github.com/DivyanshuX9",
    image: project3Img,
    side: "left",
  },
  {
    num: "04",
    year: "2025",
    tag: "Data Science · ML Forecasting",
    category: "ds",
    name: "Walmart Sales Prediction",
    summary:
      "Stacking regressor pipeline combining XGBoost and Random Forest with custom feature engineering and EDA. Achieved R² of 0.965 and strong MAE reduction over a linear baseline across seasonal segments.",
    stack: ["Python", "XGBoost", "Random Forest", "Scikit-learn", "Pandas"],
    metric: { value: "0.965", label: "R² score" },
    github: "https://github.com/DivyanshuX9/Walmart-Sales-Prediction",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    side: "right",
  },
  {
    num: "05",
    year: "2025 — 2026",
    tag: "Computer Vision · Weather-Adaptive AI",
    category: "ds",
    name: "Weather-Based Traffic Signal Model",
    summary:
      "Adaptive traffic signal control system combining real-time environmental/weather parameters with computer vision to dynamically adjust signal timings, green light durations, and object detection under adverse weather conditions (rain, fog, low visibility).",
    stack: ["Python", "OpenCV", "YOLO / CNN", "Weather API", "FastAPI"],
    metric: { value: "Adaptive", label: "Real-time weather control" },
    github: "https://github.com/DivyanshuX9/Weather_Based_Traffic_signal_model",
    image: "https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=800&q=80",
    side: "left",
  },
  {
    num: "06",
    year: "2025",
    tag: "Applied AI · Voice + RAG",
    category: "ai",
    name: "NABHA Voice Intake",
    summary:
      "Voice-to-structured pipeline with retrieval-augmented summaries using Gemini API. Schema validation, confidence thresholds, and safe fallbacks ensure predictable UX for medical intake.",
    stack: ["Python", "Gemini API", "Twilio", "RAG", "FastAPI"],
    metric: { value: "RAG", label: "Retrieval-augmented" },
    github: "https://github.com/DivyanshuX9",
    image: caseStudyImg,
    side: "right",
  },
];

function ProjectCard({ project }: { project: Project }) {
  const isLeft = project.side === "left";
  return (
    <article className="container-edge relative">
      {/* Background Watermark Number */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -top-12 select-none font-display text-[9rem] font-bold leading-none text-surface opacity-60 md:-top-24 md:text-[13rem] ${
          isLeft ? "left-0" : "right-0"
        }`}
      >
        {project.num}
      </div>

      <div
        className={`relative flex flex-col ${
          isLeft ? "items-start" : "items-end"
        }`}
      >
        <Reveal delay={0.05} className="relative z-20 w-full max-w-4xl">
          <div className="group overflow-hidden rounded-2xl border border-border bg-background/90 p-6 md:p-8 backdrop-blur-md shadow-sm transition-all duration-500 hover:border-foreground/30 hover:shadow-xl">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 lg:items-center">
              {/* Image Preview Banner */}
              <div
                className={`overflow-hidden rounded-xl border border-border/70 bg-surface/50 lg:col-span-5 ${
                  isLeft ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <img
                  src={project.image}
                  alt={`${project.name} preview`}
                  className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Content Body */}
              <div
                className={`flex flex-col justify-between lg:col-span-7 ${
                  isLeft ? "lg:order-2" : "lg:order-1"
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                      {project.year} · {project.tag}
                    </span>
                    <span className="rounded-full border border-border/80 bg-surface/50 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-foreground">
                      #{project.num}
                    </span>
                  </div>

                  <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl lg:text-4xl">
                    {project.name}
                  </h3>

                  <p className="mt-3 text-[14px] leading-relaxed text-foreground/80 md:text-[15px]">
                    {project.summary}
                  </p>
                </div>

                <div className="mt-6 border-t border-border/80 pt-4">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                        {project.metric.value}
                      </p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {project.metric.label}
                      </p>
                    </div>

                    <ul className="flex flex-wrap gap-1.5 text-[10px] uppercase tracking-[0.16em]">
                      {project.stack.map((t) => (
                        <li
                          key={t}
                          className="rounded-md border border-border/80 bg-surface/40 px-2 py-1 text-foreground/75"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground transition-colors hover:text-blue-500"
                    >
                      View Code on GitHub
                      <svg
                        className="size-3.5 transition-transform group-hover:translate-x-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </article>
  );
}

export function SelectedWork({ activeFilter = "all" }: { activeFilter?: string }) {
  const filteredProjects = allProjectsList.filter((p) => {
    if (activeFilter === "all") return true;
    return p.category === activeFilter;
  });

  return (
    <section id="work" className="relative pt-12 pb-24">
      <div className="relative space-y-16 md:space-y-24">
        {filteredProjects.map((p) => (
          <ProjectCard key={p.num} project={p} />
        ))}

        {filteredProjects.length === 0 && (
          <div className="container-edge py-12 text-center text-muted-foreground">
            No projects found for this category.
          </div>
        )}
      </div>
    </section>
  );
}
