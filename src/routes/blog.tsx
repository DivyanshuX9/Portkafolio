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
      <main className="relative z-10 mx-auto w-full max-w-280 pt-28 md:pt-32 md:pl-16 lg:pl-28 xl:pl-36">
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
        <div className="container-edge">
          <div className="rounded-4xl border border-ink-deep/10 bg-background/70 p-4 text-[12px] uppercase tracking-[0.18em] opacity-70">
            Latest notes and experiments are listed below. The page now has a clear two-part structure: overview and notes.
          </div>
        </div>
        <Notes />
      </main>
    </div>
  );
}
