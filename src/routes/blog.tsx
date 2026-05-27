import { Notes } from "@/components/site/Notes";
import { SectionHeader } from "@/components/site/SectionHeader";
import { blogPosts } from "@/content/blogPosts";
import { createFileRoute, Outlet, useMatchRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [{ title: "Divyanshu Sharma — Blog" }],
  }),
  component: BlogLayout,
});

function BlogLayout() {
  const matchRoute = useMatchRoute();
  const isIndex = matchRoute({ to: "/blog", fuzzy: false });

  if (!isIndex) return <Outlet />;

  return <BlogPage />;
}

function BlogPage() {
  const [query, setQuery] = useState("");
  const posts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return blogPosts;
    return blogPosts.filter((p) => {
      const hay = `${p.title} ${p.tag} ${p.excerpt}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  return (
    <div className="relative min-h-dvh bg-background text-foreground transition-colors duration-700">
      <main className="relative z-10 mx-auto w-full max-w-280 pt-28 md:pt-32 lg:pl-28 xl:pl-36">
        <section id="blog" className="py-10 md:py-16">
          <div className="container-edge">
            <SectionHeader
              index="01"
              eyebrow="Blog"
              title="Notes on engineering, product, and the work behind both."
              description="A public notebook of experiments, observations, and the short explanations I wish I had earlier."
            />

            <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Search notes
              </p>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to filter by title, tag, or topic…"
                className="w-full rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent sm:max-w-md"
              />
            </div>
          </div>
        </section>
        <Notes posts={posts} />
      </main>
    </div>
  );
}
