import { Notes } from "@/components/site/Notes";
import { SectionHeader } from "@/components/site/SectionHeader";
import { VerticalTimeline } from "@/components/site/VerticalTimeline";
import { createFileRoute } from "@tanstack/react-router";

const sections = [
  { id: "blog", label: "Overview" },
  { id: "notes", label: "Notes" },
];

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [{ title: "Divyanshu Sharma — Blog" }],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <div className="relative min-h-dvh bg-background text-foreground transition-colors duration-700">
      <VerticalTimeline sections={sections} />
      <main className="relative z-10 mx-auto w-full max-w-[1120px] pt-28 md:pt-32 md:pl-16 lg:pl-28 xl:pl-36">
        <section id="blog" className="py-10 md:py-16">
          <div className="container-edge">
            <SectionHeader
              index="01"
              eyebrow="Blog"
              title="Notes on engineering, product, and the work behind both."
              description="A public notebook of experiments, observations, and the short explanations I wish I had earlier."
            />
          </div>
        </section>
        <Notes />
      </main>
    </div>
  );
}
