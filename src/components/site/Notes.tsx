import { blogPosts, type BlogPost } from "@/content/blogPosts";
import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";

export function Notes({ posts = blogPosts }: { posts?: BlogPost[] }) {
  
  return (
    <section id="notes" className="py-20 md:py-28">
      <div className="container-edge">
        <Reveal>
          <div className="flex items-baseline justify-between border-t border-ink-deep pt-6">
            <p className="eyebrow">[ Sec. 05 ] Notes & Experiments</p>
            <p className="hidden text-[11px] uppercase tracking-[0.2em] opacity-60 md:block">
              A notebook, kept in public
            </p>
          </div>
        </Reveal>

        <ul className="mt-16 border-t border-ink-deep/15">
          {posts.map((n, i) => (
            <li key={n.slug} className="border-b border-ink-deep/15">
              <Reveal>
                <Link
                  to="/blog/$slug"
                  params={{ slug: n.slug }}
                  className={`group grid grid-cols-12 items-baseline gap-4 py-6 transition-[padding,background-color] hover:bg-surface/60 hover:pl-4 md:py-8 ${
                    i % 2 === 1 ? "lg:pl-[8%]" : ""
                  }`}
                >
                  <span className="col-span-2 font-display text-xs tabular-nums opacity-40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="col-span-10 font-display text-2xl font-medium tracking-tight text-ink-deep md:col-span-7 md:text-4xl">
                    {n.title}
                  </h3>
                  <span className="col-span-6 mt-2 text-[11px] uppercase tracking-[0.18em] opacity-60 md:col-span-2 md:mt-0">
                    {n.tag}
                  </span>
                  <span className="col-span-6 mt-2 text-right text-[11px] uppercase tracking-[0.18em] opacity-60 md:col-span-1 md:mt-0">
                    {n.dateLabel}
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
