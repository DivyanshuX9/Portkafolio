import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type CompanionProps = {
  slug: string;
  progress: number; // 0 to 100
};

export function BlogStoryCompanion({ slug, progress }: CompanionProps) {
  switch (slug) {
    case "i-got-lost-in-chennai-then-i-built-ridehub":
      return <RideHubCompanion progress={progress} />;
    case "nabha-what-happens-when-technology-stops-assuming":
      return <NabhaCompanion progress={progress} />;
    case "the-night-i-mapped-stars":
      return <StarsCompanion progress={progress} />;
    case "ich-lerne-deutsch":
      return <GermanCompanion progress={progress} />;
    case "walmart-sales-model-stacking-vs-linear":
      return <WalmartCompanion progress={progress} />;
    case "weather-based-traffic-signal-model":
      return <TrafficCompanion progress={progress} />;
    case "encrypted-docs-audit-logs":
      return <SecurityCompanion progress={progress} />;
    default:
      return <GenericReadingCompanion progress={progress} />;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. RIDEHUB: The Confused Man & Moving Chennai Cab
// ─────────────────────────────────────────────────────────────────────────────

function RideHubCompanion({ progress }: { progress: number }) {
  const [honked, setHonked] = useState(false);
  const [speechIdx, setSpeechIdx] = useState(0);

  const thoughts = [
    "Lost in Chennai... Which bus? 🚌",
    "Auto meter: ₹400?! Is that fair? 🛺",
    "Where is CMBT bus terminus? 📍",
    "Wait, what if one app unified all of this? 💡",
    "RideHub: Buses, Metro & Cabs together! 🚀",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSpeechIdx((prev) => (prev + 1) % thoughts.length);
    }, 3600);
    return () => clearInterval(timer);
  }, [thoughts.length]);

  function handleHonk() {
    setHonked(true);
    toast.success("🚕 Beep beep! RideHub cab navigating Chennai traffic!");
    setTimeout(() => setHonked(false), 900);
  }

  // Calculate car position along road based on reading progress (10% to 85%)
  const carX = Math.min(85, Math.max(10, progress * 0.8 + 10));

  return (
    <div className="relative my-8 overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-b from-surface/50 via-background to-surface/30 p-5 sm:p-6 shadow-sm">
      {/* City Skyline Silhouette & Ambient Clouds */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex size-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            Story Companion // Chennai Transit Simulation
          </span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">
          Trip Progress: {Math.round(progress)}%
        </span>
      </div>

      <div className="relative mt-4 flex flex-col md:flex-row items-center justify-between gap-6 min-h-[140px]">
        {/* Left: The Confused Traveler */}
        <div className="flex items-center gap-3.5 z-10 shrink-0">
          <div className="relative">
            {/* Thought Bubble */}
            <motion.div
              key={speechIdx}
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute -top-12 -left-2 z-20 whitespace-nowrap rounded-xl border border-border bg-background/95 px-3 py-1.5 text-[11px] font-medium text-foreground shadow-md backdrop-blur-md"
            >
              {thoughts[speechIdx]}
              <span className="absolute -bottom-1 left-4 size-2 rotate-45 border-b border-r border-border bg-background" />
            </motion.div>

            {/* Traveler Avatar */}
            <div className="relative flex size-14 items-center justify-center rounded-2xl border border-border bg-surface text-2xl shadow-xs">
              <motion.span
                animate={{ rotate: [-4, 4, -4] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="select-none"
              >
                🤷‍♂️
              </motion.span>
              <span className="absolute -bottom-1 -right-1 text-sm">📱</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-foreground">Lost in Chennai</p>
            <p className="text-[11px] text-muted-foreground">Looking for a ride</p>
          </div>
        </div>

        {/* Right / Road: Moving Cab */}
        <div className="w-full relative flex-1">
          {/* Animated Road Track */}
          <div className="relative h-16 w-full rounded-2xl border border-border/80 bg-surface/60 overflow-hidden flex items-center px-4">
            {/* Road Dotted Line */}
            <div className="absolute inset-x-0 h-0.5 border-t border-dashed border-muted-foreground/30" />

            {/* Street Lamp / Signboard */}
            <div className="absolute right-6 top-1 text-[10px] font-mono text-muted-foreground/60 select-none">
              CMBT →
            </div>

            {/* The Moving Cab */}
            <motion.div
              animate={{ left: `${carX}%` }}
              transition={{ type: "spring", stiffness: 70, damping: 15 }}
              onClick={handleHonk}
              className="absolute -translate-x-1/2 cursor-pointer z-10 flex flex-col items-center"
              title="Click to honk!"
            >
              {/* Exhaust Puffs */}
              <motion.span
                animate={{ opacity: [0, 0.8, 0], x: [-12, -20], scale: [0.6, 1.2] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="absolute -left-3 top-2 text-[10px] select-none pointer-events-none"
              >
                💨
              </motion.span>

              {/* The Car */}
              <motion.div
                animate={{
                  y: [0, -2, 0],
                  scale: honked ? 1.2 : 1,
                }}
                transition={{ duration: 0.4, repeat: Infinity }}
                className="relative flex items-center justify-center rounded-xl bg-amber-400 dark:bg-amber-500 px-3 py-1.5 shadow-md border border-amber-600/40 text-black font-mono text-[10px] font-bold"
              >
                <span className="mr-1">🚕</span>
                <span>RideHub</span>
              </motion.div>
              <span className="text-[9px] font-mono text-muted-foreground mt-0.5">
                {honked ? "HONK! 📢" : "Click to honk"}
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. NABHA: Rural Telemedicine & Live ECG Pulse
// ─────────────────────────────────────────────────────────────────────────────

function NabhaCompanion({ progress }: { progress: number }) {
  const [pulseCount, setPulseCount] = useState(72);

  function handleCheck() {
    setPulseCount((p) => p + 1);
    toast.success("📡 Vitals received: 2G SMS sync verified!");
  }

  return (
    <div className="relative my-8 overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-b from-surface/50 via-background to-surface/30 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex size-2 rounded-full bg-rose-500 animate-ping" />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            Story Companion // Nabha Civil Hospital Telemedicine Monitor
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
          Offline Sync: ACTIVE
        </span>
      </div>

      <div className="mt-4 grid gap-6 md:grid-cols-12 items-center">
        {/* Doctor & Patient Antenna */}
        <div className="md:col-span-5 flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-border bg-surface text-2xl shadow-xs shrink-0">
            <motion.span
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              👩‍⚕️
            </motion.span>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Dr. Remote / Nabha Unit</p>
            <p className="text-[11px] text-muted-foreground leading-tight">
              Designing without assuming 5G or broadband.
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>2G Resilient Protocol</span>
            </div>
          </div>
        </div>

        {/* Live ECG Wave Oscilloscope */}
        <div className="md:col-span-7 flex flex-col gap-2">
          <div className="relative h-16 w-full rounded-2xl border border-border/80 bg-surface/70 overflow-hidden flex items-center px-4">
            {/* Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]" />

            {/* Simulated ECG Line SVG */}
            <svg className="w-full h-10 text-rose-500" viewBox="0 0 300 40" fill="none" preserveAspectRatio="none">
              <motion.path
                d="M 0 20 L 40 20 L 50 10 L 60 30 L 70 5 L 80 35 L 90 20 L 150 20 L 160 10 L 170 30 L 180 5 L 190 35 L 200 20 L 300 20"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathOffset: 0 }}
                animate={{ pathOffset: [0, 1] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
              />
            </svg>

            <button
              type="button"
              onClick={handleCheck}
              className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-lg border border-border bg-background/80 px-2 py-1 text-[10px] font-mono font-medium hover:bg-surface active:scale-95"
            >
              <span>❤️ {pulseCount} BPM</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground px-1">
            <span>Scroll depth: {Math.round(progress)}%</span>
            <span>Constraint: Low-bandwidth healthcare</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CONSTELLATIONS: 2 AM Stargazer & Twinkling Night Sky
// ─────────────────────────────────────────────────────────────────────────────

function StarsCompanion({ progress }: { progress: number }) {
  const [constellationDrawn, setConstellationDrawn] = useState(false);

  function handleTwinkle() {
    setConstellationDrawn((d) => !d);
    toast.success("🔭 Constellation mapped! Plate-solving algorithms aligned.");
  }

  return (
    <div className="relative my-8 overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-b from-[#0a0e17] via-[#0d1424] to-[#080b12] p-5 sm:p-6 text-white shadow-md">
      {/* Starlight Ambient Dots */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs">✨</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/70">
            Story Companion // 2 AM Night Sky Observatory
          </span>
        </div>
        <span className="text-[10px] font-mono text-cyan-300">
          Plate-Solving: {Math.round(progress)}%
        </span>
      </div>

      <div className="relative mt-4 flex flex-col md:flex-row items-center justify-between gap-6 min-h-[140px]">
        {/* Stargazer with Telescope */}
        <div className="flex items-center gap-4 z-10">
          <div className="relative flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl shadow-inner">
            <motion.span
              animate={{ rotate: [-8, 8, -8] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              🔭
            </motion.span>
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Stargazer at 2 AM</p>
            <p className="text-[11px] text-white/60">Mapping celestial boundaries</p>
            <button
              type="button"
              onClick={handleTwinkle}
              className="mt-1.5 inline-flex items-center gap-1 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-mono text-cyan-300 hover:bg-cyan-400/20 active:scale-95"
            >
              <span>{constellationDrawn ? "Reset Sky" : "Connect Orion's Belt ✨"}</span>
            </button>
          </div>
        </div>

        {/* Sky View with Interactive Stars */}
        <div className="w-full relative flex-1 h-20 rounded-2xl border border-white/10 bg-black/40 overflow-hidden flex items-center justify-center">
          {/* Constellation Stars */}
          <div className="relative w-full h-full">
            {/* Stars */}
            {[
              { x: "20%", y: "30%", size: "size-2" },
              { x: "38%", y: "45%", size: "size-2.5" },
              { x: "50%", y: "35%", size: "size-1.5" },
              { x: "65%", y: "60%", size: "size-2" },
              { x: "82%", y: "25%", size: "size-3" },
            ].map((st, idx) => (
              <motion.div
                key={idx}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 2 + idx * 0.5, repeat: Infinity }}
                style={{ left: st.x, top: st.y }}
                className={`absolute rounded-full bg-cyan-200 shadow-[0_0_8px_rgba(103,232,249,0.8)] ${st.size}`}
              />
            ))}

            {/* Constellation Connector Line */}
            {constellationDrawn && (
              <svg className="absolute inset-0 size-full text-cyan-400/60" viewBox="0 0 100 100" preserveAspectRatio="none">
                <motion.path
                  d="M 20 30 L 38 45 L 50 35 L 65 60 L 82 25"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2 }}
                />
              </svg>
            )}

            {/* Shooting Star */}
            <motion.div
              animate={{
                x: ["-20%", "120%"],
                y: ["10%", "90%"],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 4 }}
              className="absolute size-1 bg-white rounded-full shadow-[0_0_12px_#fff]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. GERMAN: The Student in the Whirlwind of Der / Die / Das
// ─────────────────────────────────────────────────────────────────────────────

function GermanCompanion({ progress }: { progress: number }) {
  const [beerCount, setBeerCount] = useState(1);

  const words = [
    { word: "der Tisch 🪑", color: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
    { word: "die Lampe 💡", color: "bg-rose-500/10 text-rose-600 border-rose-500/30" },
    { word: "das Mädchen 👧", color: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
    { word: "den / dem / des 🤯", color: "bg-purple-500/10 text-purple-600 border-purple-500/30" },
  ];

  return (
    <div className="relative my-8 overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-b from-surface/50 via-background to-surface/30 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs">🥨</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            Story Companion // Deutsch Lernen & Grammatik
          </span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">
          Kapitel: {Math.round(progress)}%
        </span>
      </div>

      <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Student at desk */}
        <div className="flex items-center gap-4">
          <div className="relative flex size-14 items-center justify-center rounded-2xl border border-border bg-surface text-2xl shadow-xs">
            <motion.span
              animate={{ rotate: [-6, 6, -6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🧑‍🎓
            </motion.span>
            <span className="absolute -bottom-1 -right-1 text-sm">☕</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Divyanshu vs. German Grammar</p>
            <p className="text-[11px] text-muted-foreground">"Warum ist das Mädchen neutral?!"</p>
            <button
              type="button"
              onClick={() => {
                setBeerCount((b) => b + 1);
                toast.success("Genau! Wunderbar gemacht! 🥨");
              }}
              className="mt-1 inline-flex items-center gap-1 text-[10px] font-mono text-amber-600 dark:text-amber-400 hover:underline"
            >
              <span>Give Pretzels 🥨 ({beerCount})</span>
            </button>
          </div>
        </div>

        {/* Floating Article Badges */}
        <div className="flex flex-wrap gap-2 justify-center">
          {words.map((item, idx) => (
            <motion.div
              key={item.word}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2 + idx * 0.3, repeat: Infinity, ease: "easeInOut" }}
              className={`rounded-xl border px-3 py-1.5 text-xs font-mono font-medium shadow-2xs ${item.color}`}
            >
              {item.word}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. WALMART: Sales Model Stacking Regressor vs Linear
// ─────────────────────────────────────────────────────────────────────────────

function WalmartCompanion({ progress }: { progress: number }) {
  return (
    <div className="relative my-8 overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-b from-surface/50 via-background to-surface/30 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs">🛒</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            Story Companion // ML Model Stacking vs. Baseline
          </span>
        </div>
        <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">
          Stacking Ensemble
        </span>
      </div>

      <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-border bg-surface text-2xl shadow-xs">
            <motion.span
              animate={{ x: [-4, 4, -4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              🛒
            </motion.span>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Walmart Sales Forecasting</p>
            <p className="text-[11px] text-muted-foreground">Linear Model vs. Stacked Regressor</p>
          </div>
        </div>

        {/* Comparison Pills */}
        <div className="flex flex-wrap gap-2.5">
          <div className="rounded-xl border border-border bg-surface/60 p-2.5 text-center min-w-[110px]">
            <p className="text-[10px] font-mono text-muted-foreground">Baseline</p>
            <p className="font-display text-sm font-bold text-foreground">Linear OLS</p>
            <span className="text-[9px] text-emerald-500 font-mono">Simple & Fast</span>
          </div>
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-2.5 text-center min-w-[110px]">
            <p className="text-[10px] font-mono text-blue-500">Challenger</p>
            <p className="font-display text-sm font-bold text-foreground">Stacked Meta</p>
            <span className="text-[9px] text-blue-500 font-mono">Higher Accuracy</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. TRAFFIC: Weather-Based Adaptive Traffic Light
// ─────────────────────────────────────────────────────────────────────────────

function TrafficCompanion({ progress }: { progress: number }) {
  const [light, setLight] = useState<"red" | "yellow" | "green">("green");

  useEffect(() => {
    const timer = setInterval(() => {
      setLight((prev) => (prev === "green" ? "yellow" : prev === "yellow" ? "red" : "green"));
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative my-8 overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-b from-surface/50 via-background to-surface/30 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs">🌧️</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            Story Companion // Vision Sensor & Weather Signal
          </span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">
          Condition: Rain / Low-Vis
        </span>
      </div>

      <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {/* Animated Traffic Light */}
          <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-surface p-2 shadow-xs">
            <span className={`size-3 rounded-full transition-opacity ${light === "red" ? "bg-rose-500 shadow-[0_0_8px_#f43f5e]" : "bg-rose-500/20"}`} />
            <span className={`size-3 rounded-full transition-opacity ${light === "yellow" ? "bg-amber-500 shadow-[0_0_8px_#f59e0b]" : "bg-amber-500/20"}`} />
            <span className={`size-3 rounded-full transition-opacity ${light === "green" ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-emerald-500/20"}`} />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Adaptive Signal Control</p>
            <p className="text-[11px] text-muted-foreground">Computer Vision adjusting green duration in rain.</p>
          </div>
        </div>

        {/* Rain Detection Badge */}
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface/40 p-3">
          <span className="text-xl">📹</span>
          <div className="text-left font-mono text-[11px]">
            <p className="text-foreground font-semibold">CV Inference: 38 FPS</p>
            <p className="text-muted-foreground text-[10px]">Weather Shift: Domain Adapted</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. SECURITY: Encrypted Documents & Audit Log Safe
// ─────────────────────────────────────────────────────────────────────────────

function SecurityCompanion({ progress }: { progress: number }) {
  const [locked, setLocked] = useState(true);

  return (
    <div className="relative my-8 overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-b from-surface/50 via-background to-surface/30 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs">🔐</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            Story Companion // Role-Based Cryptographic Boundary
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-500 font-semibold">
          AES-256 GCM
        </span>
      </div>

      <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              setLocked((l) => !l);
              toast.success(locked ? "🔓 Document decrypted via Role Key" : "🔒 Vault locked & audit logged");
            }}
            className="flex size-14 items-center justify-center rounded-2xl border border-border bg-surface text-2xl shadow-xs hover:scale-105 active:scale-95 transition-transform"
          >
            <span>{locked ? "🔒" : "🔓"}</span>
          </button>
          <div>
            <p className="text-xs font-semibold text-foreground">
              {locked ? "Encrypted State: Key Required" : "Decrypted: Auditor Access Granted"}
            </p>
            <p className="text-[11px] text-muted-foreground">Click the vault lock to simulate key rotation.</p>
          </div>
        </div>

        {/* Audit Log Blocks */}
        <div className="flex flex-col gap-1 font-mono text-[10px] text-muted-foreground bg-surface/60 rounded-xl border border-border p-2.5">
          <span className="text-foreground font-semibold">HASH: 0x9f4a...8b12 [VERIFIED]</span>
          <span>ACTION: ROLE_PERMISSION_CHECK [ALLOW]</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Default Fallback
// ─────────────────────────────────────────────────────────────────────────────

function GenericReadingCompanion({ progress }: { progress: number }) {
  return (
    <div className="relative my-8 overflow-hidden rounded-3xl border border-border/80 bg-surface/30 p-5 text-center">
      <p className="text-xs font-mono text-muted-foreground">
        Reading Progress: {Math.round(progress)}%
      </p>
    </div>
  );
}

