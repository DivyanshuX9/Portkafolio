import { motion } from "motion/react";

export function Hero() {
  return (
    <section id="top" className="relative min-h-[88vh] w-full overflow-hidden pt-32 pb-20 md:pt-36 md:pb-24">
      {/* Massive AM watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[8vw] right-0 select-none opacity-[0.04]"
      >
        <span className="font-display block text-[42vw] font-bold leading-none -mr-[5vw] text-ink-deep">
          DS
        </span>
      </div>

      {/* Index numerals top-left */}
      <div className="container-edge">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] opacity-60"
        >
          <span>Index No. 01 · India</span>
          <span className="hidden md:inline tabular-nums">[ 24 — V.01 ]</span>
        </motion.div>
      </div>

      {/* Slipping headline */}
      <div className="container-edge relative z-10 mt-16 md:mt-28">
        <h1 className="font-display max-w-[16ch] text-[clamp(2.5rem,8vw,10rem)] font-bold leading-[0.88] tracking-[-0.04em] text-ink-deep">
          <SlipLine delay={0}>Building digital</SlipLine>
          <SlipLine delay={0.08} className="block lg:ml-[8%]">
            products people
          </SlipLine>
          <SlipLine delay={0.16} className="block lg:ml-[22%]">
            actually enjoy.
          </SlipLine>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 max-w-md text-base leading-relaxed text-ink md:mt-16 md:text-lg lg:ml-[22%]"
        >
          Software engineer focused on AI systems, scalable web applications,
          and the unreasonable amount of detail that makes an interface feel
          inevitable.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm md:mt-12 md:gap-x-8 md:gap-y-4 lg:ml-[22%]"
        >
          <a
            href="/projects#work"
            className="group inline-flex items-center gap-3 border-b border-ink-deep pb-1 font-display text-base font-medium tracking-tight text-ink-deep"
          >
            View work
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#contact"
            className="text-[11px] uppercase tracking-[0.25em] text-ink hover:opacity-50"
          >
            Get in touch
          </a>
        </motion.div>
      </div>

      {/* Subtle scroll mark, bottom-right */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="container-edge mt-12 flex items-end justify-end gap-3 text-[9px] uppercase tracking-[0.2em] opacity-50 md:mt-20 md:text-[10px] md:tracking-[0.3em]"
      >
          <span>Scroll</span>
        <span className="relative block h-8 w-px overflow-hidden bg-ink/30">
          <motion.span
            className="absolute inset-x-0 top-0 block h-3 bg-ink-deep"
            animate={{ y: ["-100%", "260%"] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}

function SlipLine({
  children,
  delay,
  className,
}: {
  children: string;
  delay: number;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden ${className ?? ""}`}>
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}
