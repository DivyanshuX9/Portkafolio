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
                  I'm Divyanshu Sharma, a developer who loves building systems
                  around real human experiences. Most of my ideas begin with
                  observation, whether it is getting lost in a new city,
                  noticing gaps in healthcare accessibility, or wondering why
                  digital experiences feel disconnected from the people using
                  them.
                </p>

                <p>
                  I enjoy working at the intersection of AI, full stack
                  development, interactive design, and scalable systems. From
                  mobility platforms and healthcare concepts to immersive web
                  experiences, I care deeply about creating technology that
                  feels intuitive, meaningful, and human.
                </p>

                <p>
                  Beyond coding, I spend a lot of time exploring ideas,
                  redesigning things that probably do not need redesigning, and
                  thinking about how software can reduce friction in everyday
                  life. I believe the best products are not just functional,
                  they leave an impression.
                </p>

                <p className="opacity-60">
                  Based in India. Building, learning, and experimenting one
                  project at a time.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
