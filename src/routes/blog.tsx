import { Notes } from "@/components/site/Notes";
import { PageHeaderHero } from "@/components/site/PageHeaderHero";
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

const categories = ["All", "Product", "Health", "Life", "Data Science", "Computer Vision", "SWE"];

function BlogPage() {
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  const posts = useMemo(() => {
    return blogPosts.filter((p) => {
      const matchesQuery = !query.trim() || `${p.title} ${p.tag} ${p.excerpt}`.toLowerCase().includes(query.trim().toLowerCase());
      const matchesTag = selectedTag === "All" || p.tag.toLowerCase() === selectedTag.toLowerCase();
      return matchesQuery && matchesTag;
    });
  }, [query, selectedTag]);

  return (
    <div className="relative min-h-dvh bg-background text-foreground transition-colors duration-700">
      <main className="relative z-10 mx-auto w-full max-w-7xl">
        <PageHeaderHero
          sectionIndex="01"
          eyebrow="Blog & Notes"
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Blog" },
          ]}
          title="Engineering notes, architecture logs & observations."
          description="A public notebook of experiments, software engineering observations, and explanations behind built products."
          stats={[
            { label: "Published Notes", value: `${blogPosts.length} Articles`, icon: "📝" },
            { label: "Topics Covered", value: "Systems & AI", icon: "💡" },
            { label: "Read Time", value: "~25 Min Total", icon: "⏱️" },
            { label: "Format", value: "Public Build Logs", icon: "🔓" },
          ]}
        >
          {/* Search & Tag Filter Bar */}
          <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-5 backdrop-blur-sm shadow-xs">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Category chips */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => {
                  const active = selectedTag === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedTag(cat)}
                      className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] transition-all ${
                        active
                          ? "bg-foreground text-background shadow-xs"
                          : "border border-border bg-background/60 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Search input */}
              <div className="relative w-full md:max-w-xs">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search articles & topics…"
                  className="w-full rounded-full border border-border bg-background px-4 py-2 pl-9 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/50"
                />
                <svg
                  className="absolute left-3 top-2.5 size-3.5 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-2.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Results counter */}
            {(query || selectedTag !== "All") && (
              <div className="mt-3 border-t border-border/60 pt-3 text-[11px] text-muted-foreground flex items-center justify-between">
                <span>
                  Showing {posts.length} of {blogPosts.length} articles
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setSelectedTag("All");
                  }}
                  className="underline hover:text-foreground"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </PageHeaderHero>

        <Notes posts={posts} />
      </main>
    </div>
  );
}
