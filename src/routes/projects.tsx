import { PageHeaderHero } from "@/components/site/PageHeaderHero";
import { SelectedWork } from "@/components/site/SelectedWork";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [{ title: "Divyanshu Sharma — Projects" }],
  }),
  component: ProjectsPage,
});

const filterTabs = [
  { id: "all", label: "All Projects" },
  { id: "swe", label: "Full-Stack & Systems" },
  { id: "ai", label: "Applied AI & Biomechanics" },
  { id: "security", label: "Security & Crypto" },
  { id: "ds", label: "Vision & Data Science" },
];

function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <div className="relative min-h-dvh bg-background text-foreground transition-colors duration-700">
      <main className="relative z-10 mx-auto w-full max-w-7xl">
        <PageHeaderHero
          sectionIndex="01"
          eyebrow="Projects"
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Projects" },
          ]}
          title="SWE, Applied AI, and Security systems."
          description="Seven production, research, and hackathon systems built from real constraints — from monocular clinical gait deep learning and transport aggregation to field-level encryption, voice AI, and weather-adaptive traffic models."
          stats={[
            { label: "Total Projects", value: "7 Shipped", badgeType: "projects" },
            { label: "SIH 2025", value: "Qualifier", badgeType: "sih" },
            { label: "Core Stack", value: "Next.js · PyTorch", badgeType: "stack" },
            { label: "Domains", value: "SWE · AI · Security", badgeType: "node" },
          ]}
        >
          {/* Category Filter Pills */}
          <div className="mt-4 flex flex-wrap gap-2 border-t border-border/60 pt-5 sm:pt-6">
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.14em] transition-all active:scale-95 sm:px-4 ${
                    isActive
                      ? "bg-foreground text-background shadow-xs"
                      : "border border-border/80 bg-surface/50 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </PageHeaderHero>

        <SelectedWork activeFilter={activeFilter} />
      </main>
    </div>
  );
}
