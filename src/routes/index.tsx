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
    <div id="top" className="relative min-h-dvh bg-background text-foreground transition-colors duration-700 [&[data-season=night]]:text-foreground">
      <VerticalTimeline sections={sections} />
      <main className="relative z-10 mx-auto w-full max-w-[1280px] pt-28 md:pt-32 md:pl-16 lg:pl-28 xl:pl-36">
        <Hero />
        <GithubContributions />
        <CurrentWorkTimeline />
        <Contact />
      </main>
    </div>
  );
}
