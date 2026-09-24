import { SectionHeader } from "@/components/site/SectionHeader";
import { blogPosts } from "@/content/blogPosts";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  ArrowUp,
  Bookmark,
  Check,
  Clock,
  Copy,
  ExternalLink,
  List,
  Pause,
  Play,
  Share2,
  Sparkles,
  Volume2,
} from "lucide-react";

// ── Markdown renderer ────────────────────────────────────────────────────────

type Token =
  | { type: "h1" | "h2" | "h3"; text: string; id: string }
  | { type: "hr" }
  | { type: "ul"; items: string[] }
  | { type: "blockquote"; text: string }
  | { type: "p"; text: string };

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function tokenize(md: string): Token[] {
  const tokens: Token[] = [];
  const blocks = md.split(/\r?\n\s*\r?\n/);

  for (const raw of blocks) {
    const block = raw.trim();
    if (!block) continue;

    if (block.startsWith("# ")) {
      const text = block.slice(2);
      tokens.push({ type: "h1", text, id: slugify(text) });
    } else if (block.startsWith("## ")) {
      const text = block.slice(3);
      tokens.push({ type: "h2", text, id: slugify(text) });
    } else if (block.startsWith("### ")) {
      const text = block.slice(4);
      tokens.push({ type: "h3", text, id: slugify(text) });
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
              className="rounded bg-surface px-1.5 py-0.5 font-mono text-[13px] text-foreground"
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
  const tokens = useMemo(() => tokenize(content), [content]);

  return (
    <article className="space-y-0 leading-relaxed">
      {tokens.map((tok, i) => {
        switch (tok.type) {
          case "h1":
            return (
              <h1
                key={i}
                id={tok.id}
                className="scroll-mt-24 pt-10 pb-3 font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
              >
                <Inline text={tok.text} />
              </h1>
            );
          case "h2":
            return (
              <h2
                key={i}
                id={tok.id}
                className="group scroll-mt-24 pt-9 pb-2.5 font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl flex items-center justify-between"
              >
                <span>
                  <Inline text={tok.text} />
                </span>
                <a
                  href={`#${tok.id}`}
                  aria-label={`Link to ${tok.text}`}
                  className="opacity-0 group-hover:opacity-40 transition-opacity text-sm font-mono text-muted-foreground hover:text-foreground"
                >
                  #
                </a>
              </h2>
            );
          case "h3":
            return (
              <h3
                key={i}
                id={tok.id}
                className="scroll-mt-24 pt-6 pb-2 font-display text-lg font-medium tracking-tight text-foreground"
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
                className="my-6 relative overflow-hidden rounded-2xl border-l-4 border-foreground/50 bg-surface/40 p-4 sm:p-5 text-[15px] italic text-foreground/90 shadow-2xs backdrop-blur-xs"
              >
                <span className="pointer-events-none absolute right-4 top-2 select-none font-serif text-4xl text-foreground/10" aria-hidden>
                  “
                </span>
                <Inline text={tok.text} />
              </blockquote>
            );
          case "ul":
            return (
              <ul key={i} className="my-4 space-y-2.5 pl-4 sm:pl-5">
                {tok.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex gap-2.5 text-[15px] leading-relaxed text-foreground/85"
                  >
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-foreground/50" />
                    <span>
                      <Inline text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            );
          case "p":
            return (
              <p
                key={i}
                className="py-2.5 text-[15px] leading-[1.82] text-foreground/85"
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

function stripMarkdown(md: string): string {
  return md
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^-{3,}$/gm, "")
    .replace(/^>\s+/gm, "")
    .replace(/^[-*]\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\n{2,}/g, " ")
    .replace(/\n/g, " ")
    .trim();
}

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
      if (activeUttRef.current === u) {
        indexRef.current = index + 1;
        speakChunk(chunks, index + 1);
      }
    };
    u.onerror = (e) => {
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
    setTimeout(() => speakChunk(chunks, 0), 50);
  };

  const pause = () => {
    if (status !== "playing") return;
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
    meta: [
      { title: `${loaderData?.post.title ?? "Blog"} — Divyanshu Sharma` },
      { name: "description", content: loaderData?.post.excerpt },
    ],
  }),
  component: BlogPostPage,
});

// ── Floating Reading Particle Type ──────────────────────────────────────────

type Particle = {
  id: number;
  emoji: string;
  x: number;
};

// ── Page Component ──────────────────────────────────────────────────────────

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const speech = useSpeech(`${post.title}. ${post.content}`);

  // Reading progress state
  const [pct, setPct] = useState(0);
  const [activeHeading, setActiveHeading] = useState("");
  const [showHud, setShowHud] = useState(false);
  const [claps, setClaps] = useState(() => {
    if (typeof window === "undefined") return 14;
    const stored = localStorage.getItem(`blog_claps_${post.slug}`);
    return stored ? Number(stored) : 14;
  });
  const [particles, setParticles] = useState<Particle[]>([]);

  // Words & read time
  const words = useMemo(() => post.content.split(/\s+/).length, [post.content]);
  const totalReadMin = useMemo(() => Math.max(1, Math.round(words / 200)), [words]);
  const minRemaining = useMemo(() => {
    const rem = Math.max(1, Math.round(totalReadMin * (1 - pct / 100)));
    return pct > 92 ? 0 : rem;
  }, [totalReadMin, pct]);

  // Headings for Table of Contents
  const headings = useMemo(() => {
    return tokenize(post.content).filter(
      (t): t is { type: "h2"; text: string; id: string } => t.type === "h2",
    );
  }, [post.content]);

  // Scroll tracking & active section detection
  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      const currentPct = total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;
      setPct(currentPct);
      setShowHud(scrolled > 140);

      // Detect active heading
      const headingElements = headings
        .map((h) => document.getElementById(h.id))
        .filter((node): node is HTMLElement => node !== null);

      let current = "";
      const offsetTop = scrolled + 160;
      for (const hEl of headingElements) {
        if (hEl.offsetTop <= offsetTop) {
          current = hEl.innerText.replace(/#$/, "").trim();
        }
      }
      setActiveHeading(current || headings[0]?.text || "");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  // Trigger floating reaction burst
  const handleReaction = useCallback((e: React.MouseEvent) => {
    const newCount = claps + 1;
    setClaps(newCount);
    try {
      localStorage.setItem(`blog_claps_${post.slug}`, String(newCount));
    } catch {}

    const emojis = ["👏", "✨", "💡", "❤️", "🔥", "🚀"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const id = Date.now() + Math.random();
    const offsetX = (Math.random() - 0.5) * 40;

    setParticles((prev) => [...prev, { id, emoji: randomEmoji, x: offsetX }]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 1200);
  }, [claps, post.slug]);

  // Copy share link
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Article link copied to clipboard!");
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-dvh bg-background text-foreground transition-colors duration-700">
      
      {/* Top Reading Progress Bar */}
      <div className="fixed left-0 top-0 z-[60] h-[3px] w-full bg-border/40 backdrop-blur-xs">
        <div
          className="h-full bg-foreground transition-[width] duration-150 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Floating Ambient Cosmic Mesh (Background Drifting Orbs) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none" aria-hidden>
        <motion.div
          animate={{
            x: [0, 28, 0],
            y: [0, -36, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-36 right-1/4 size-[440px] rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-500/10"
        />
        <motion.div
          animate={{
            x: [0, -24, 0],
            y: [0, 32, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 -left-28 size-[400px] rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/10"
        />
        <motion.div
          animate={{
            x: [0, 18, 0],
            y: [0, -22, 0],
          }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-24 right-10 size-[340px] rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-500/10"
        />
      </div>

      {/* Floating Table of Contents Rail on Large Screens */}
      {headings.length > 0 && (
        <aside
          aria-label="Table of Contents"
          className="pointer-events-none fixed right-6 top-32 z-30 hidden w-64 xl:block 2xl:right-16"
        >
          <div className="pointer-events-auto rounded-2xl border border-border/70 bg-surface/40 p-4 shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-2 border-b border-border/60 pb-2.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              <List className="size-3.5 text-foreground" />
              <span>Table of Contents</span>
            </div>

            <nav className="mt-3 space-y-1.5 text-xs">
              {headings.map((h) => {
                const isActive = activeHeading === h.text;
                return (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`group flex items-start gap-2 rounded-lg px-2 py-1.5 transition-all ${
                      isActive
                        ? "bg-foreground text-background font-medium shadow-2xs"
                        : "text-muted-foreground hover:bg-surface hover:text-foreground"
                    }`}
                  >
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-current opacity-70" />
                    <span className="line-clamp-2 leading-snug">{h.text}</span>
                  </a>
                );
              })}
            </nav>

            <div className="mt-4 border-t border-border/60 pt-3 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
              <span>{Math.round(pct)}% Complete</span>
              <span>{minRemaining > 0 ? `${minRemaining}m left` : "Done 🎉"}</span>
            </div>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="relative z-10 mx-auto w-full max-w-5xl pt-24 pb-20">
        
        {/* Top Breadcrumb & Return Bar */}
        <div className="container-edge">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
              <span className="opacity-40">/</span>
              <Link to="/blog" className="transition-colors hover:text-foreground">Blog</Link>
              <span className="opacity-40">/</span>
              <span className="font-semibold text-foreground truncate max-w-[170px] sm:max-w-[280px]">
                {post.title}
              </span>
            </nav>

            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/60 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-foreground transition-all hover:bg-surface hover:border-foreground/30"
            >
              ← All Articles
            </Link>
          </div>
        </div>

        {/* Blog Post Header */}
        <section className="py-8 md:py-12">
          <div className="container-edge">
            <SectionHeader
              index="01"
              eyebrow={post.tag}
              title={post.title}
              description={post.excerpt}
            />

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
              <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <span>{post.dateLabel}</span>
                <span className="h-3.5 w-px bg-border" aria-hidden />
                <span>{totalReadMin} min read</span>
                <span className="h-3.5 w-px bg-border" aria-hidden />
                <span className="text-foreground font-semibold">{words} words</span>
              </div>

              {/* Header Action Controls */}
              <div className="flex items-center gap-2">
                {speech.supported && (
                  <button
                    type="button"
                    onClick={speech.status === "playing" ? speech.pause : speech.play}
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
                        <Play className="size-3 fill-current" />
                        Listen
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share article link"
                  className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface/70"
                >
                  <Share2 className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Article Body */}
        <section className="pb-24">
          <div className="container-edge">
            <div className="mx-auto max-w-[68ch]">
              <MarkdownArticle content={post.content} />

              {/* End of article reaction card */}
              <div className="mt-14 rounded-2xl border border-border/80 bg-surface/30 p-6 text-center shadow-xs backdrop-blur-xs">
                <span className="text-2xl">👏</span>
                <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-foreground">
                  Enjoyed this article?
                </h3>
                <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
                  Give it a quick clap, share it with colleagues, or book a 1-on-1 session to dive deeper into the code.
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={handleReaction}
                      className="inline-flex items-center gap-2 rounded-full border border-rose-500/40 bg-rose-500/10 px-5 py-2 text-xs font-semibold text-rose-500 shadow-2xs transition-all hover:bg-rose-500/20 active:scale-95"
                    >
                      <span>👏 Clap</span>
                      <span className="rounded-full bg-rose-500/20 px-2 py-0.5 font-mono text-[11px]">
                        {claps}
                      </span>
                    </button>

                    {/* Floating Emojis */}
                    <AnimatePresence>
                      {particles.map((p) => (
                        <motion.span
                          key={p.id}
                          initial={{ opacity: 1, y: 0, scale: 0.8 }}
                          animate={{ opacity: 0, y: -65, scale: 1.35 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                          style={{ left: `calc(50% + ${p.x}px)` }}
                          className="pointer-events-none absolute bottom-8 text-base select-none"
                        >
                          {p.emoji}
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-surface"
                  >
                    <Share2 className="size-3.5" />
                    <span>Share</span>
                  </button>

                  <Link
                    to="/schedule"
                    className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition-opacity hover:opacity-90"
                  >
                    <span>Discuss Architecture →</span>
                  </Link>
                </div>
              </div>

              {/* Footer navigation */}
              <div className="mt-12 flex items-center justify-between border-t border-border pt-8">
                <Link
                  to="/blog"
                  className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="transition-transform group-hover:-translate-x-1">←</span>
                  All articles
                </Link>
                <Link
                  to="/schedule"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-surface/70"
                >
                  Schedule Sync
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Heads-Up Reading HUD Pill (Bottom Floater) */}
      <AnimatePresence>
        {showHud && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 md:bottom-8 right-3 sm:right-6 z-40 max-w-[calc(100vw-1.5rem)]"
          >
            <div className="flex items-center gap-1.5 sm:gap-2.5 rounded-full border border-border/80 bg-background/90 px-2 sm:px-3 py-1.5 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.35)] backdrop-blur-2xl backdrop-saturate-150">
              
              {/* Circular Progress Ring */}
              <div className="relative flex size-7 sm:size-8 items-center justify-center shrink-0">
                <svg className="size-7 sm:size-8 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-border/60"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-foreground transition-all duration-150"
                    strokeDasharray={`${Math.round(pct)}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute font-mono text-[8px] sm:text-[9px] font-bold text-foreground">
                  {Math.round(pct)}%
                </span>
              </div>

              {/* Active Section / Time Left Indicator */}
              <div className="hidden sm:flex flex-col pr-1 min-w-0">
                <span className="font-medium text-[11px] text-foreground truncate max-w-[130px] md:max-w-[180px]">
                  {activeHeading || post.title}
                </span>
                <span className="text-[9px] font-mono text-muted-foreground">
                  {minRemaining > 0 ? `${minRemaining}m remaining` : "Finished 🎉"}
                </span>
              </div>

              <span className="hidden sm:block h-4 w-px bg-border/80" aria-hidden />

              {/* Interactive Reaction with Floating Particle Spawner */}
              <div className="relative">
                <button
                  type="button"
                  onClick={handleReaction}
                  title="Applause / Reaction"
                  className="flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 sm:px-2.5 py-1 text-xs font-semibold text-rose-500 transition-transform hover:scale-105 active:scale-90"
                >
                  <span className="text-xs">👏</span>
                  <span className="font-mono text-[10px] sm:text-[11px]">{claps}</span>
                </button>

                {/* Floating Emojis */}
                <AnimatePresence>
                  {particles.map((p) => (
                    <motion.span
                      key={p.id}
                      initial={{ opacity: 1, y: 0, scale: 0.8 }}
                      animate={{ opacity: 0, y: -65, scale: 1.35 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      style={{ left: `calc(50% + ${p.x}px)` }}
                      className="pointer-events-none absolute bottom-7 text-sm select-none"
                    >
                      {p.emoji}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>

              {/* Audio Listen Quick Control */}
              {speech.supported && (
                <button
                  type="button"
                  onClick={speech.status === "playing" ? speech.pause : speech.play}
                  title={speech.status === "playing" ? "Pause narration" : "Listen to article"}
                  className="flex size-7 sm:size-8 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-all hover:bg-surface/80 active:scale-90"
                >
                  {speech.status === "playing" ? (
                    <span className="flex items-center gap-0.5 h-3">
                      <span className="w-0.5 h-3 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="w-0.5 h-2 bg-emerald-500 rounded-full animate-pulse [animation-delay:0.15s]" />
                      <span className="w-0.5 h-3 bg-emerald-500 rounded-full animate-pulse [animation-delay:0.3s]" />
                    </span>
                  ) : (
                    <Volume2 className="size-3.5" />
                  )}
                </button>
              )}

              {/* Share Button */}
              <button
                type="button"
                onClick={handleShare}
                title="Share article link"
                className="flex size-7 sm:size-8 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-all hover:bg-surface/80 active:scale-90"
              >
                <Share2 className="size-3.5" />
              </button>

              {/* Back to top Button */}
              <button
                type="button"
                onClick={scrollToTop}
                title="Scroll to top"
                className="flex size-7 sm:size-8 items-center justify-center rounded-full bg-foreground text-background transition-all hover:opacity-90 active:scale-90 shadow-2xs"
              >
                <ArrowUp className="size-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
