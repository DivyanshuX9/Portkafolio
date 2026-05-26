import { motion } from "motion/react";
import { useEffect, useState } from "react";

export type TimelineSection = {
  id: string;
  label: string;
};

const defaultSections: TimelineSection[] = [
  { id: "top", label: "Index" },
  { id: "work", label: "Work" },
  { id: "case-study", label: "Case" },
  { id: "experience", label: "Experience" },
  { id: "notes", label: "Blog" },
  { id: "github", label: "GitHub" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export function VerticalTimeline({
  sections = defaultSections,
}: {
  sections?: TimelineSection[];
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "top");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(1, y / h) : 0);

      const mid = y + window.innerHeight * 0.35;
      let current = sections[0].id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        if (el.offsetTop <= mid) current = s.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="pointer-events-none fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 lg:block lg:left-8"
      aria-label="Section index"
    >
      <div className="pointer-events-auto relative flex overflow-visible">
        <div className="relative mr-4 w-px bg-ink-deep/20">
          <motion.div
            style={{ height: `${progress * 100}%` }}
            className="absolute left-0 top-0 w-px bg-ink-deep"
          />
        </div>

        <ul className="flex flex-col gap-3 text-[10px] uppercase tracking-[0.22em]">
          {sections.map((s, i) => {
            const isActive = active === s.id;
            return (
              <li key={s.id} className="group flex flex-col items-start gap-3">
                <a
                  href={`#${s.id}`}
                  className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span
                    className={`flex h-3 items-center justify-center transition-all ${
                      isActive ? "w-6" : "w-3"
                    }`}
                  >
                    <span
                      className={`block h-px transition-all ${
                        isActive
                          ? "w-6 bg-foreground"
                          : "w-3 bg-muted-foreground/30 group-hover:bg-muted-foreground/60"
                      }`}
                    />
                  </span>
                  <span
                    className={`tabular-nums transition-opacity ${
                      isActive
                        ? "opacity-100 text-foreground"
                        : "opacity-0 group-hover:opacity-70"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")} · {s.label}
                  </span>
                </a>
                {s.id === "github" && (
                  <div className="h-px w-4 bg-border/30 ml-1.5" />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </motion.aside>
  );
}
