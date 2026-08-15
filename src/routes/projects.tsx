import { PageHeaderHero } from "@/components/site/PageHeaderHero";
import { SelectedWork } from "@/components/site/SelectedWork";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [{ title: "Divyanshu Sharma — Projects" }],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
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
          description="Six engineering projects built to solve real-world constraints — from transport aggregation and field-level document encryption to voice AI for rural healthcare."
          stats={[
            { label: "Total Projects", value: "6 Shipped", icon: "🚀" },
            { label: "SIH 2025", value: "Qualifier", icon: "🏆" },
            { label: "Quant IQC '26", value: "Rank 6", icon: "🏅" },
            { label: "Core Stack", value: "Next.js · FastAPI", icon: "⚡" },
          ]}
        />
        <SelectedWork />
      </main>
    </div>
  );
}
