import { useState } from "react";
import { Reveal } from "./Reveal";

import iqcPhoto1 from "../../assests/IQC'26 photo1.jpg";
import iqcPhoto2 from "../../assests/IQC'26 photo2.jpg";
import ridehubHome from "../../assests/ridehub-home.jpg";

type Entry = {
  date: string;
  title: string;
  location: string;
  body: string;
  tag: string;
  badge?: string;
  links: { label: string; href: string }[];
  images?: { src: string; alt: string }[];
};

const entries: Entry[] = [
  {
    date: "Aug 2026 — Present",
    title: "AI Enabled Monocular Gait Analysis",
    location: "Deep Learning & Biomechanics · VIT Chennai",
    tag: "AI",
    badge: "Capstone R&D",
    body: "Clinical gait analysis pipeline using ordinary single-camera video to assess neurological conditions (Cerebral Palsy, Stroke, Myopathic, Normal). Features YOLOv8 + ByteTrack tracking, 147-D kinematic pose features, 28-D RAFT dense optical flow, and dilated Temporal Convolutional Networks (TCN) reaching 70.7% balanced accuracy under strict video-grouped cross-validation with SPARC smoothness profiling. Co-authored with Debeshi Sen, guided by Dr. Pavithra L K.",
    links: [
      { label: "Read Blog Analysis →", href: "/blog/ai-enabled-monocular-gait-analysis" },
      { label: "View in Projects", href: "/projects#work" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/mr-divyanshu/" },
    ],
  },
  {
    date: "Sep 2026",
    title: "Amazon ML Challenge 2026",
    location: "Machine Learning · National Finalist",
    tag: "DS",
    badge: "AIR 698",
    body: "Secured All India Rank 698 with an overall benchmark score of 0.983906 out of thousands of top engineering teams across India in the Amazon ML Challenge 2026 with team members from VIT (Anshik Kumar Tiwari, Aryan Mahawar, Kartik Patel, Divyanshu Sharma). Built deep multi-modal tabular & predictive pipelines for high-precision estimation.",
    links: [
      { label: "LinkedIn Profile", href: "https://www.linkedin.com/in/mr-divyanshu/" },
    ],
  },
  {
    date: "Jul 2026",
    title: "IBM Advanced Generative AI Certification",
    location: "IBM Career Education · Cognitive Class",
    tag: "AI",
    badge: "Verified Credential",
    body: "Earned official certification in Advanced Generative AI (CEGENAI1IN) issued by IBM Career Education Program and IBM Developer Skills Network. Validates deep capabilities in transformer architectures, prompt engineering, RAG pipelines, and LLM orchestration.",
    links: [
      {
        label: "Verify Certificate ↗",
        href: "https://courses.ibmcep.cognitiveclass.ai/certificates/d3a570e88dc6474ba1f97f5321c5d887",
      },
    ],
  },
  {
    date: "Mar 2026 — Jul 2026",
    title: "WorldQuant IQC 2026",
    location: "Quant Research · National Finalist",
    tag: "Quant",
    badge: "AIR 6 · World 26",
    body: "Secured All India Rank 6 and World Rank 26 out of 150,000+ teams globally representing VIT at the WorldQuant International Quant Championship 2026 National Finals in Mumbai with Team Simpson's Paradox.",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/mr-divyanshu/" },
    ],
    images: [
      { src: iqcPhoto1, alt: "WorldQuant IQC 2026 National Finals Team Photo 1" },
      { src: iqcPhoto2, alt: "WorldQuant IQC 2026 National Finals Team Photo 2" },
    ],
  },
  {
    date: "May 2025 — Mar 2026",
    title: "RideHub",
    location: "Full-stack · SWE",
    badge: "Shipped",
    tag: "SWE",
    body: "Built a unified ride aggregation platform with Next.js 15, FastAPI, and PostgreSQL, combining five transport services with real-road routing, trip history, and cross-platform mobile support.",
    links: [
      { label: "GitHub ↗", href: "https://github.com/DivyanshuX9/RideHub" },
      { label: "Read Story", href: "/blog/i-got-lost-in-chennai-then-i-built-ridehub" },
    ],
    images: [
      { src: ridehubHome, alt: "RideHub Home Dashboard" },
    ],
  },
  {
    date: "Dec 2025 — Feb 2026",
    title: "Weather-Based Traffic Signal Model",
    location: "Computer Vision · Adaptive AI",
    tag: "CV",
    badge: "Open Source",
    body: "Adaptive traffic signal control system combining real-time weather parameters with computer vision to dynamically adjust signal timings, green clearance intervals, and vehicle detection under adverse conditions (heavy rain, fog, low light).",
    links: [
      { label: "GitHub ↗", href: "https://github.com/DivyanshuX9/Weather_Based_Traffic_signal_model" },
      { label: "Read Case Study", href: "/blog/weather-based-traffic-signal-model" },
    ],
  },
  {
    date: "Aug 2025 — Oct 2025",
    title: "NABHA Health",
    location: "SWE + Applied AI · SIH 2025",
    tag: "AI",
    badge: "SIH Qualifier",
    body: "Voice-based intake, RAG summaries with Gemini API, and appointment flow integrations for rural-first healthcare. Built for Smart India Hackathon 2025.",
    links: [
      { label: "GitHub", href: "https://github.com/DivyanshuX9" },
      { label: "Read Story", href: "/blog/nabha-what-happens-when-technology-stops-assuming" },
    ],
  },
  {
    date: "May 2025 — Jun 2025",
    title: "Walmart Sales Prediction",
    location: "Data Science · Forecasting",
    tag: "DS",
    body: "Stacking regressor pipeline (XGBoost + Random Forest) with R² 0.965 and strong MAE reduction over linear baseline after feature engineering and EDA.",
    links: [
      { label: "GitHub ↗", href: "https://github.com/DivyanshuX9/Walmart-Sales-Prediction" },
      { label: "Read Analysis", href: "/blog/walmart-sales-model-stacking-vs-linear" },
    ],
  },
  {
    date: "Mar 2025",
    title: "RBAC-DocEncryption",
    location: "Security Engineering",
    tag: "Security",
    body: "Blockchain-audited document security with AES-256-GCM field-level encryption, SHA-256 tamper checks, and role-based selective decryption.",
    links: [
      { label: "GitHub ↗", href: "https://github.com/DivyanshuX9/RBAC-DocEncryption" },
    ],
  },
  {
    date: "Ongoing",
    title: "Build logs & updates",
    location: "LinkedIn",
    tag: "Log",
    body: "Project demos, architecture notes, and internship-ready learnings from SWE and Data Science work.",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/mr-divyanshu/" },
    ],
  },
];

const tagColor: Record<string, string> = {
  Quant: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  SWE: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  AI: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  Security: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  DS: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  CV: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Log: "bg-surface text-muted-foreground border-border",
};

export function CurrentWorkTimeline() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section
      id="timeline"
      className="border-t border-border bg-background py-16 sm:py-20 md:py-24"
    >
      <div className="container-edge">
        <Reveal>
          <div className="flex items-baseline justify-between border-b border-border pb-6">
            <p className="eyebrow">[ Sec. 03 ] Timeline</p>
            <p className="hidden text-xs uppercase tracking-[0.2em] text-muted-foreground md:block">
              Resume-backed work & Achievements
            </p>
          </div>
        </Reveal>

        {/* ── Modern Redesigned Mobile Timeline (Polished Cards & Interactive Spine) ── */}
        <div className="mt-8 space-y-0 md:hidden">
          {entries.map((entry, index) => (
            <Reveal key={entry.title} delay={index * 0.03}>
              <div className="relative pl-6 pb-6 last:pb-1">
                {/* Continuous Timeline Spine */}
                {index < entries.length - 1 && (
                  <div className="absolute left-[7px] top-4 bottom-0 w-[2px] bg-border/70" />
                )}

                {/* Milestone Node Bullet */}
                <div className="absolute left-0 top-3.5 z-10 flex size-4 items-center justify-center rounded-full border-2 border-background bg-foreground shadow-xs">
                  <span className="size-1 rounded-full bg-background" />
                </div>

                {/* Elevated Glassmorphism Timeline Card */}
                <div className="group rounded-2xl border border-border/80 bg-surface/50 p-4 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-foreground/30 hover:bg-surface/75">
                  {/* Top Meta Header: Date & Badge & Tag */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-background/80 border border-border/60 px-2.5 py-0.5 text-xs font-mono font-medium text-foreground">
                        {entry.date}
                      </span>
                      {entry.badge && (
                        <span className="rounded-full border border-foreground/20 bg-foreground/5 px-2 py-0.5 text-xs font-mono font-semibold text-foreground">
                          {entry.badge}
                        </span>
                      )}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-[0.14em] ${tagColor[entry.tag] ?? tagColor.Log}`}
                    >
                      <span className="size-1 rounded-full bg-current opacity-70" />
                      {entry.tag}
                    </span>
                  </div>

                  {/* Title & Role */}
                  <h3 className="mt-2.5 font-display text-lg font-bold tracking-tight text-foreground">
                    {entry.title}
                  </h3>
                  <p className="mt-0.5 text-xs uppercase tracking-[0.16em] text-muted-foreground font-medium">
                    {entry.location}
                  </p>

                  {/* Body description */}
                  <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-foreground/85">
                    {entry.body}
                  </p>

                  {/* Interactive Action Buttons */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5 pt-2 border-t border-border/50">
                    {entry.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground transition-all duration-200 hover:border-foreground/40 hover:bg-surface active:scale-95 shadow-2xs"
                      >
                        <span>{link.label}</span>
                        <svg className="size-3 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M7 17L17 7M17 7H7M17 7v10" />
                        </svg>
                      </a>
                    ))}
                  </div>

                  {/* Image Previews if present */}
                  {entry.images && entry.images.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
                      {entry.images.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedImage(img.src)}
                          className="group/img relative cursor-zoom-in overflow-hidden rounded-xl border border-border/80 bg-surface/30 p-1 text-left transition-all hover:border-foreground/30 hover:shadow-md"
                        >
                          <img
                            src={img.src}
                            alt={img.alt}
                            className="h-24 w-full rounded-lg object-cover transition-transform duration-500 group-hover/img:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 flex items-end justify-start bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-0 transition-opacity group-hover/img:opacity-100">
                            <span className="text-xs text-white">Tap to zoom</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── Desktop Layout: Two-Column Spacing ── */}
        <ol className="mt-12 hidden space-y-0 md:block">
          {entries.map((entry, index) => (
            <li key={entry.title} className="list-none">
              <Reveal delay={index * 0.04}>
                <article className="grid grid-cols-[auto_1fr] gap-x-8 border-b border-border py-8 last:border-b-0">
                  {/* Left: connector */}
                  <div className="flex flex-col items-center pt-1">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface shadow-xs">
                      <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                        {entry.tag}
                      </span>
                    </div>
                    {index < entries.length - 1 && (
                      <div className="mt-3 w-px flex-1 bg-border" style={{ minHeight: "2.5rem" }} />
                    )}
                  </div>

                  {/* Right: content */}
                  <div className="min-w-0 pb-2">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-medium">
                        {entry.date}
                      </p>
                      <span className="text-muted-foreground/40">•</span>
                      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        {entry.location}
                      </p>
                      {entry.badge && (
                        <span className="rounded-full border border-foreground/20 bg-surface/90 px-2 py-0.5 text-xs font-mono font-medium text-foreground">
                          {entry.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 font-display text-2xl font-medium tracking-tight text-foreground lg:text-3xl">
                      {entry.title}
                    </h3>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/80 sm:text-base">
                      {entry.body}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {entry.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target={link.href.startsWith("http") ? "_blank" : undefined}
                          rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/50 px-3.5 py-1.5 text-xs uppercase tracking-[0.18em] text-foreground transition-all hover:bg-surface hover:border-foreground/30 active:scale-95"
                        >
                          {link.label}
                          <svg className="size-2.5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 17L17 7M17 7H7M17 7v10" />
                          </svg>
                        </a>
                      ))}
                    </div>

                    {/* Images below entry */}
                    {entry.images && entry.images.length > 0 && (
                      <div className="mt-5 grid grid-cols-2 gap-3 max-w-lg">
                        {entry.images.map((img, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setSelectedImage(img.src)}
                            className="group relative cursor-zoom-in overflow-hidden rounded-xl border border-border bg-surface/30 p-1.5 text-left transition-all hover:border-foreground/30 hover:shadow-lg"
                          >
                            <img
                              src={img.src}
                              alt={img.alt}
                              className="h-40 w-full rounded-lg object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 flex items-end justify-start bg-gradient-to-t from-black/60 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                              <span className="text-xs font-medium text-white">
                                Click to preview
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      {/* Image Modal Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSelectedImage(null);
          }}
          tabIndex={0}
          role="button"
          aria-label="Close image preview"
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl border border-white/20 bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black"
              aria-label="Close"
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Enlarged preview"
              className="max-h-[85vh] w-auto max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
