import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { Experience } from "@/components/site/Experience";
import { SectionHeader } from "@/components/site/SectionHeader";
import { VerticalTimeline } from "@/components/site/VerticalTimeline";
import { createFileRoute } from "@tanstack/react-router";

const sections = [
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [{ title: "Divyanshu Sharma — Experience" }],
  }),
  component: ExperiencePage,
});

function ExperiencePage() {
  return (
    <div className="relative min-h-dvh bg-background text-foreground transition-colors duration-700">
      <VerticalTimeline sections={sections} />
      <main className="relative z-10 mx-auto w-full max-w-[1120px] pt-28 md:pt-32 lg:pl-28 xl:pl-36">
        <section id="experience" className="py-10 md:py-16">
          <div className="container-edge">
            <SectionHeader
              index="01"
              eyebrow="Experience"
              title="The roles, the rules, and the ideas that shaped how I build."
              description="A compact view of the teams, systems, and habits that still influence my work today."
            />
          </div>
        </section>
        <Experience />
        <div className="container-edge">
          <div className="border-t border-ink-deep/15" />
        </div>
        <About />
        <Contact />
      </main>
    </div>
  );
}
