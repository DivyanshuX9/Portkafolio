import { motion } from "motion/react";
import { useMemo } from "react";
import { useSeason } from "./SeasonContext";

function createSeededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function hashSeason(season: string) {
  let hash = 0;
  for (let index = 0; index < season.length; index += 1) {
    hash = (hash * 31 + season.charCodeAt(index)) >>> 0;
  }
  return hash || 1;
}

export function SeasonalBackdrop() {
  const { season } = useSeason();

  // Pre-generate particle positions, stable per season
  const rainDrops = useMemo(() => {
    const rand = createSeededRandom(hashSeason(`${season}-rain`));
    return Array.from({ length: 80 }, () => ({
      left: rand() * 100,
      delay: rand() * 1.6,
      duration: 0.7 + rand() * 0.8,
      opacity: 0.15 + rand() * 0.35,
      length: 30 + rand() * 40,
    }));
  }, [season]);

  const stars = useMemo(() => {
    const rand = createSeededRandom(hashSeason(`${season}-stars`));
    return Array.from({ length: 90 }, () => ({
      left: rand() * 100,
      top: rand() * 100,
      size: rand() < 0.85 ? 1 : 2,
      delay: rand() * 4,
      duration: 1.8 + rand() * 3.2,
    }));
  }, [season]);

  const leaves = useMemo(() => {
    const rand = createSeededRandom(hashSeason(`${season}-leaves`));
    return Array.from({ length: 14 }, () => ({
      left: rand() * 100,
      delay: rand() * 10,
      duration: 14 + rand() * 10,
      size: 8 + rand() * 10,
      rot: rand() * 360,
      drift: -40 + rand() * 80,
    }));
  }, [season]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden transition-colors duration-700"
    >
      {/* Sunny — warm top glow */}
      {season === "sunny" && (
        <>
          <div
            className="absolute -top-40 right-[-10%] h-[60vh] w-[60vh] rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(255, 220, 150, 0.55), rgba(255,220,150,0) 70%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,240,210,0.25) 0%, rgba(255,240,210,0) 40%)",
            }}
          />
        </>
      )}

      {/* Rain */}
      {season === "rain" && (
        <>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(120,140,160,0.18) 0%, rgba(120,140,160,0.05) 60%)",
            }}
          />
          {rainDrops.map((d, i) => (
            <motion.span
              key={i}
              className="absolute top-[-10%] block w-px bg-[#3a4a58]"
              style={{
                left: `${d.left}%`,
                height: d.length,
                opacity: d.opacity,
              }}
              animate={{ y: ["0vh", "115vh"] }}
              transition={{
                duration: d.duration,
                delay: d.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </>
      )}

      {/* Night — stars */}
      {season === "night" && (
        <>
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 70% 10%, rgba(120,140,200,0.18), transparent 60%)",
            }}
          />
          {stars.map((s, i) => (
            <motion.span
              key={i}
              className="absolute block rounded-full bg-[#f0eada]"
              style={{
                left: `${s.left}%`,
                top: `${s.top}%`,
                width: s.size,
                height: s.size,
                boxShadow:
                  s.size > 1 ? "0 0 4px rgba(240,234,218,0.8)" : "none",
              }}
              animate={{ opacity: [0.15, 1, 0.15] }}
              transition={{
                duration: s.duration,
                delay: s.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </>
      )}

      {/* Autumn — drifting leaves + warm wash */}
      {season === "autumn" && (
        <>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(210,150,90,0.22) 0%, rgba(180,120,70,0.10) 50%, rgba(120,70,40,0.08) 100%)",
            }}
          />
          {leaves.map((l, i) => (
            <motion.span
              key={i}
              className="absolute top-[-8%] block"
              style={{
                left: `${l.left}%`,
                width: l.size,
                height: l.size,
              }}
              animate={{
                y: ["0vh", "115vh"],
                x: [0, l.drift, 0, -l.drift, 0],
                rotate: [l.rot, l.rot + 360],
              }}
              transition={{
                duration: l.duration,
                delay: l.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <svg viewBox="0 0 24 24" width={l.size} height={l.size}>
                <path
                  d="M12 2c4 4 7 7 7 11a7 7 0 1 1-14 0c0-4 3-7 7-11z"
                  fill="#b9692c"
                  opacity="0.75"
                />
              </svg>
            </motion.span>
          ))}
        </>
      )}
    </div>
  );
}
