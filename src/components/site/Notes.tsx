import { Reveal } from "./Reveal";

const notes = [
  {
    tag: "LinkedIn",
    date: "May · 26",
    title: "Shipping RideHub from web app to Android",
    href: "https://www.linkedin.com/in/mr-divyanshu",
  },
  {
    tag: "AI",
    date: "Apr · 26",
    title: "Inside NABHA Health: voice intake + RAG summaries",
    href: "https://www.linkedin.com/in/mr-divyanshu",
  },
  {
    tag: "Data Science",
    date: "Mar · 26",
    title: "Walmart sales model: Stacking Regressor vs linear baseline",
    href: "https://github.com/DivyanshuX9",
  },
  {
    tag: "Computer Vision",
    date: "Feb · 26",
    title: "Traffic sign CNN at 43 classes with OpenCV inference",
    href: "https://github.com/DivyanshuX9",
  },
  {
    tag: "SWE",
    date: "Jan · 26",
    title: "Role-based encrypted documents with blockchain audit logs",
    href: "https://github.com/DivyanshuX9",
  },
  {
    tag: "Career",
    date: "Now",
    title: "Open to SWE and Data Science internship opportunities",
    href: "https://www.linkedin.com/in/mr-divyanshu",
  },
];

export function Notes() {
  return (
    <section id="notes" className="py-28 md:py-40">
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
          {notes.map((n, i) => (
            <Reveal as="li" key={n.title} delay={i * 0.03} className="border-b border-ink-deep/15">
              <a
                href={n.href}
                target="_blank"
                rel="noreferrer"
                className={`group grid grid-cols-12 items-baseline gap-4 py-6 transition-[padding,background-color] hover:bg-surface/60 hover:pl-4 md:py-8 ${
                  i % 2 === 1 ? "md:pl-[8%]" : ""
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
                  {n.date}
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
