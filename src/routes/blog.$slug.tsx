import { SectionHeader } from "@/components/site/SectionHeader";
import { blogPosts } from "@/content/blogPosts";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

// ── Markdown renderer ────────────────────────────────────────────────────────

type Token =
  | { type: "h1" | "h2" | "h3"; text: string }
  | { type: "hr" }
  | { type: "ul"; items: string[] }
  | { type: "blockquote"; text: string }
  | { type: "p"; text: string };

function tokenize(md: string): Token[] {
  const tokens: Token[] = [];
  // Split on any blank line (handles LF, CRLF and lines with spaces)
  const blocks = md.split(/\r?\n\s*\r?\n/);

  for (const raw of blocks) {
    const block = raw.trim();
    if (!block) continue;

    if (block.startsWith("# ")) {
      tokens.push({ type: "h1", text: block.slice(2) });
    } else if (block.startsWith("## ")) {
      tokens.push({ type: "h2", text: block.slice(3) });
    } else if (block.startsWith("### ")) {
      tokens.push({ type: "h3", text: block.slice(4) });
    } else if (/^-{3,}$/.test(block)) {
      tokens.push({ type: "hr" });
    } else if (block.startsWith("> ")) {
      tokens.push({ type: "blockquote", text: block.slice(2) });
    } else {
      const lines = block.split("\n");
      if (lines.length > 1 && lines.every((l) => /^[-*]\s/.test(l.trim()))) {
        tokens.push({
          type: "ul",
          items: lines.map((l) => l.replace(/^[-*]\s/, "").trim()),
        });
      } else if (lines.every((l) => /^[-*]\s/.test(l.trim()))) {
        tokens.push({
          type: "ul",
          items: lines.map((l) => l.replace(/^[-*]\s/, "").trim()),
        });
      } else {
        tokens.push({ type: "p", text: block.replace(/\n/g, " ") });
      }
    }
  }
  return tokens;
}

function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**"))
          return (
            <strong key={i} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        if (part.startsWith("*") && part.endsWith("*"))
          return (
            <em key={i} className="italic">
              {part.slice(1, -1)}
            </em>
          );
        if (part.startsWith("`") && part.endsWith("`"))
          return (
            <code
              key={i}
              className="rounded bg-surface px-1.5 py-0.5 font-mono text-[13px]"
            >
              {part.slice(1, -1)}
            </code>
          );
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function MarkdownArticle({ content }: { content: string }) {
  const tokens = tokenize(content);

  return (
    <article className="space-y-0">
      {tokens.map((tok, i) => {
        switch (tok.type) {
          case "h1":
            return (
              <h1
                key={i}
                className="pt-10 pb-3 font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
              >
                <Inline text={tok.text} />
              </h1>
            );
          case "h2":
            return (
              <h2
                key={i}
                className="pt-8 pb-2 font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl"
              >
                <Inline text={tok.text} />
              </h2>
            );
          case "h3":
            return (
              <h3
                key={i}
                className="pt-6 pb-2 font-display text-lg font-medium tracking-tight text-foreground"
              >
                <Inline text={tok.text} />
              </h3>
            );
          case "hr":
            return <hr key={i} className="my-8 border-border" />;
          case "blockquote":
            return (
              <blockquote
                key={i}
                className="my-4 border-l-2 border-ink-deep/30 pl-4 text-[15px] italic text-muted-foreground"
              >
                <Inline text={tok.text} />
              </blockquote>
            );
          case "ul":
            return (
              <ul key={i} className="my-4 space-y-2 pl-5">
                {tok.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex gap-2 text-[15px] leading-relaxed text-foreground/85"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-deep/40" />
                    <Inline text={item} />
                  </li>
                ))}
              </ul>
            );
          case "p":
            return (
              <p
                key={i}
                className="py-2 text-[15px] leading-[1.8] text-foreground/85"
              >
                <Inline text={tok.text} />
              </p>
            );
        }
      })}
    </article>
  );
}

// ── Speech hook (SSR-safe) ───────────────────────────────────────────────────

/** Strip markdown syntax so the browser reads clean prose */
function stripMarkdown(md: string): string {
  return md
    .replace(/^#{1,6}\s+/gm, "") // headings
    .replace(/^-{3,}$/gm, "") // hr
    .replace(/^>\s+/gm, "") // blockquotes
    .replace(/^[-*]\s+/gm, "") // list items
    .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
    .replace(/\*([^*]+)\*/g, "$1") // italic
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/\n{2,}/g, " ") // paragraph breaks → space
    .replace(/\n/g, " ")
    .trim();
}

/** Split into ~180-char chunks at sentence boundaries (fixes Chrome Android bug) */
function chunkText(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  const chunks: string[] = [];
  let current = "";
  for (const s of sentences) {
    if ((current + s).length > 180) {
      if (current) chunks.push(current.trim());
      current = s;
    } else {
      current += s;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length ? chunks : [text.slice(0, 180)];
}

function useSpeech(rawText: string) {
  const [status, setStatus] = useState<"idle" | "playing" | "paused">("idle");
  const [supported, setSupported] = useState(false);
  const chunksRef = useRef<string[]>([]);
  const indexRef = useRef(0);
  const activeUttRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  function speakChunk(chunks: string[], index: number) {
    if (index >= chunks.length) {
      setStatus("idle");
      return;
    }
    const u = new SpeechSynthesisUtterance(chunks[index]);
    u.rate = 0.95;
    activeUttRef.current = u;
    u.onend = () => {
      // only advance if we weren't paused/stopped
      if (activeUttRef.current === u) {
        indexRef.current = index + 1;
        speakChunk(chunks, index + 1);
      }
    };
    u.onerror = (e) => {
      // 'interrupted' fires on pause in some browsers — ignore it
      if (e.error === "interrupted") return;
      setStatus("idle");
    };
    window.speechSynthesis.speak(u);
  }

  const play = () => {
    if (!supported) return;
    if (status === "paused") {
      window.speechSynthesis.resume();
      setStatus("playing");
      return;
    }
    window.speechSynthesis.cancel();
    const clean = stripMarkdown(rawText);
    const chunks = chunkText(clean);
    chunksRef.current = chunks;
    indexRef.current = 0;
    setStatus("playing");
    // Small delay so cancel() fully clears before speak() on mobile
    setTimeout(() => speakChunk(chunks, 0), 50);
  };

  const pause = () => {
    if (status !== "playing") return;
    // Nullify ref so the onend of the current utterance doesn't advance
    activeUttRef.current = null;
    window.speechSynthesis.pause();
    setStatus("paused");
  };

  const stop = () => {
    activeUttRef.current = null;
    window.speechSynthesis.cancel();
    indexRef.current = 0;
    setStatus("idle");
  };

  return { supported, status, play, pause, stop };
}

// ── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = blogPosts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Divyanshu Sharma — ${loaderData?.post.title ?? "Blog"}` }],
  }),
  component: BlogPostPage,
});

// ── Reading progress bar ─────────────────────────────────────────────────────

function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setPct(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed left-0 top-0 z-[60] h-[2px] w-full bg-border">
      <div
        className="h-full bg-ink-deep transition-[width] duration-75"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const speech = useSpeech(`${post.title}. ${post.content}`);

  // Estimate read time
  const words = post.content.split(/\s+/).length;
  const readMin = Math.max(1, Math.round(words / 200));

  return (
    <div className="relative min-h-dvh bg-background text-foreground transition-colors duration-700">
      <ReadingProgress />

      <main className="relative z-10 mx-auto w-full max-w-5xl pt-24 pb-16">
        {/* Top Breadcrumb & Navigation Bar */}
        <div className="container-edge">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
              <span className="opacity-40">/</span>
              <Link to="/blog" className="transition-colors hover:text-foreground">Blog</Link>
              <span className="opacity-40">/</span>
              <span className="font-semibold text-foreground truncate max-w-[180px] sm:max-w-[280px]">
                {post.title}
              </span>
            </nav>

            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/60 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-foreground transition-all hover:bg-surface hover:border-foreground/30"
            >
              ← Back to all notes
            </Link>
          </div>
        </div>

        {/* Header */}
        <section className="py-8 md:py-12">
          <div className="container-edge">
            <SectionHeader
              index="01"
              eyebrow={post.tag}
              title={post.title}
              description={post.excerpt}
            />

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
              <Link
                to="/blog"
                className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
              >
                ← Back to blog
              </Link>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {post.dateLabel}
                </span>
                <span className="h-4 w-px bg-border" aria-hidden />
                <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {readMin} min read
                </span>
                <span className="h-4 w-px bg-border" aria-hidden />

                {speech.supported ? (
                  <>
                    <button
                      type="button"
                      onClick={
                        speech.status === "playing" ? speech.pause : speech.play
                      }
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-surface/70"
                    >
                      {speech.status === "playing" ? (
                        <>
                          <span className="flex gap-0.5">
                            <span className="h-3 w-0.5 animate-pulse bg-current" />
                            <span className="h-3 w-0.5 animate-pulse bg-current [animation-delay:0.15s]" />
                            <span className="h-3 w-0.5 animate-pulse bg-current [animation-delay:0.3s]" />
                          </span>
                          Pause
                        </>
                      ) : speech.status === "paused" ? (
                        "Resume"
                      ) : (
                        <>
                          <svg
                            className="size-3"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          Listen
                        </>
                      )}
                    </button>
                    {speech.status !== "idle" && (
                      <button
                        type="button"
                        onClick={speech.stop}
                        className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-surface/60"
                      >
                        Stop
                      </button>
                    )}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="pb-24">
          <div className="container-edge">
            <div className="mx-auto max-w-[68ch]">
              <MarkdownArticle content={post.content} />

              {/* Footer nav */}
              <div className="mt-16 flex items-center justify-between border-t border-border pt-8">
                <Link
                  to="/blog"
                  className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <svg
                    className="size-3 transition-transform group-hover:-translate-x-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 12H5M12 5l-7 7 7 7" />
                  </svg>
                  All posts
                </Link>
                <Link
                  to="/schedule"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-surface/70"
                >
                  Let's talk
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
