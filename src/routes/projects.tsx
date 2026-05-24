import { FeaturedCaseStudy } from "@/components/site/FeaturedCaseStudy";
import { SectionHeader } from "@/components/site/SectionHeader";
import { SelectedWork } from "@/components/site/SelectedWork";
import { VerticalTimeline } from "@/components/site/VerticalTimeline";
import { createFileRoute } from "@tanstack/react-router";

const sections = [
  { id: "projects", label: "Overview" },
  { id: "work", label: "Selected Work" },
  { id: "case-study", label: "Case Study" },
];

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [{ title: "Divyanshu Sharma — Projects" }],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  return (
    <div className="relative min-h-dvh bg-background text-foreground transition-colors duration-700">
      <VerticalTimeline sections={sections} />
      <main className="relative z-10 mx-auto w-full max-w-[1120px] pt-28 md:pt-32 md:pl-16 lg:pl-28 xl:pl-36">
        <section id="projects" className="py-10 md:py-16">
          <div className="container-edge">
            <SectionHeader
              index="01"
              eyebrow="Projects"
              title="Product work, systems work, and the things that held up under real use."
              description="A focused set of shipped pieces, each one built to feel calm even when the underlying system was not."
            />
          </div>
        </section>
        <SelectedWork />
        <FeaturedCaseStudy />
      </main>
    </div>
  );
}
