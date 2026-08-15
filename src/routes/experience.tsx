import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { Experience } from "@/components/site/Experience";
import { PageHeaderHero } from "@/components/site/PageHeaderHero";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [{ title: "Divyanshu Sharma — Experience" }],
  }),
  component: ExperiencePage,
});

function ExperiencePage() {
  return (
    <div className="relative min-h-dvh bg-background text-foreground transition-colors duration-700">
      <main className="relative z-10 mx-auto w-full max-w-7xl">
        <PageHeaderHero
          sectionIndex="01"
          eyebrow="Experience"
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Experience" },
          ]}
          title="Patents, Open Source, and Team Leadership."
          description="A track record of research inventions, Node.js core contributions, hackathon leadership, and engineering systems shipped in public."
          stats={[
            { label: "Patents", value: "1 Filed", icon: "📜" },
            { label: "Node.js Core", value: "PR #63491", icon: "🌐" },
            { label: "WorldQuant IQC", value: "AIR 6 · World 26", icon: "🏆" },
            { label: "Hackathon", value: "SIH Qualifier Lead", icon: "👥" },
          ]}
        />
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
