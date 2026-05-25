import { Reveal } from "./Reveal";

export function About() {
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="container-edge">
        <Reveal>
          <div className="flex items-baseline justify-between border-t border-ink-deep pt-6">
            <p className="eyebrow">[ Sec. 06 ] About</p>
            <p className="hidden text-[11px] uppercase tracking-[0.2em] opacity-60 md:block">
              A short version, ageing slowly
            </p>
          </div>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-3">
            <Reveal>
              <p className="font-display text-7xl font-bold leading-none text-ink-deep md:text-8xl">
                Hi.
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-7 md:col-start-5">
            <Reveal>
              <div className="space-y-6 text-[19px] leading-[1.65] text-ink">
                <p>
                    I'm Divyanshu Sharma — a software engineer who fell in love with building
                  the moment I shipped my first ugly side project at fifteen
                  and watched a stranger use it.
                </p>
                <p>
                  Most of my work sits at the seam between engineering and
                  product: AI systems that have to feel honest, internal tools
                  that have to feel inevitable, payments flows that have to
                  feel boring in the best possible way.
                </p>
                <p>
                  Curiosity is the engine. I read more than I write, run
                  before the city wakes up, cook badly but enthusiastically,
                  and keep a list of questions I haven't yet earned the right
                  to answer.
                </p>
                <p className="opacity-60">
                  Based in India. Available for a small number of partnerships
                  in 2026.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
