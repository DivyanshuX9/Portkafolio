import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { About } from "../components/site/About";
import { Contact } from "../components/site/Contact";
import { CurrentWorkTimeline } from "../components/site/CurrentWorkTimeline";
import { Hero } from "../components/site/Hero";
import { Skills } from "../components/site/Skills";

const GithubContributions = lazy(() =>
  import("../components/site/GithubContributions").then((module) => ({
    default: module.GithubContributions,
  })),
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Divyanshu Sharma - Software engineer & product builder" },
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
    <div
      id="top"
      className="relative min-h-dvh overflow-x-hidden bg-background text-foreground transition-colors duration-700 dark:text-foreground"
    >
      <main className="relative z-10 mx-auto w-full max-w-full px-4 pt-28 sm:max-w-[95vw] sm:px-5 md:px-0 md:pt-32 lg:max-w-[calc(100%-4rem)] lg:pl-24 xl:max-w-[calc(100%-6rem)] xl:pl-32">
        <Hero />
        <Suspense
          fallback={
            <div className="container-edge py-20 text-sm text-muted-foreground">
              Loading GitHub profile...
            </div>
          }
        >
          <GithubContributions />
        </Suspense>
        <Skills />
        <CurrentWorkTimeline />
        <About />
        <Contact />
      </main>
    </div>
  );
}
