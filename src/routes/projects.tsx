import { SectionHeader } from "@/components/site/SectionHeader";
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
      <main className="relative z-10 mx-auto w-full max-w-[1120px] pt-28 md:pt-32 lg:pl-28 xl:pl-36">
        <section id="projects" className="py-10 md:py-16">
          <div className="container-edge">
            <SectionHeader
              index="01"
              eyebrow="Projects"
              title="SWE, AI, and Data Science — built to solve real problems."
              description="Six projects across full-stack engineering, security systems, computer vision, and voice AI. Each one built from a real constraint."
            />
          </div>
        </section>
        <SelectedWork />
      </main>
    </div>
  );
}
