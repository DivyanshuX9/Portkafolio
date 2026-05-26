import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "../components/site/Contact";
import { CurrentWorkTimeline } from "../components/site/CurrentWorkTimeline";
import { GithubContributions } from "../components/site/GithubContributions";
import { Hero } from "../components/site/Hero";
import { VerticalTimeline } from "../components/site/VerticalTimeline";

const sections = [
  { id: "top", label: "Abstract" },
  { id: "github", label: "GitHub Nerd" },
  { id: "timeline", label: "Timeline" },
  { id: "contact", label: "Contact" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Divyanshu Sharma — Software engineer & product builder" },
      {
        name: "description",
        content:
          "Software engineer focused on AI systems, scalable web applications, and exceptional user experiences.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div id="top" className="relative min-h-dvh overflow-x-hidden bg-background text-foreground transition-colors duration-700 [&[data-season=night]]:text-foreground">
      <VerticalTimeline sections={sections} />
      <main className="relative z-10 mx-auto w-full max-w-full px-4 pt-28 sm:px-5 sm:max-w-[95vw] md:pt-32 md:px-0 lg:max-w-[calc(100%-4rem)] lg:pl-24 xl:max-w-[calc(100%-6rem)] xl:pl-32">
        <Hero />
        <GithubContributions />
        <CurrentWorkTimeline />
        <Contact />
      </main>
    </div>
  );
}
