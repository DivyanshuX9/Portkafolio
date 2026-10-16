import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { Experience } from "@/components/site/Experience";
import { PageHeaderHero } from "@/components/site/PageHeaderHero";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [{ title: "Divyanshu Sharma — Experience & Credentials" }],
  }),
  component: ExperiencePage,
});

function ExperiencePage() {
  return (
    <div className="relative min-h-dvh bg-background text-foreground transition-colors duration-700">
      <main className="relative z-10 mx-auto w-full max-w-7xl">
        <PageHeaderHero
          sectionIndex="01"
          eyebrow="Experience & Credentials"
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Experience" },
          ]}
          title="Certifications, Patents, Open Source & Honors."
          description="A verifiable track record spanning IBM Advanced Generative AI credentials, patented drone innovations, Amazon ML Challenge ranking, Node.js core contributions, and clinical biomechanics research."
          stats={[
            { label: "IBM Credential", value: "CEGENAI1IN", badgeType: "stack" },
            { label: "Amazon ML", value: "AIR 698", badgeType: "projects" },
            { label: "WorldQuant IQC", value: "AIR 6 · World 26", badgeType: "iqc" },
            { label: "Patents", value: "1 Filed", badgeType: "patent" },
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
