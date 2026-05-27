import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

export type Season = "light" | "dark";

const SEASONS: { id: Season; label: string; hint: string }[] = [
  { id: "light", label: "Light", hint: "Bright" },
  { id: "dark", label: "Dark", hint: "Dim" },
];

type Ctx = {
  season: Season;
  setSeason: (s: Season) => void;
  cycle: () => void;
};

const SeasonCtx = createContext<Ctx | null>(null);

export function SeasonProvider({ children }: { children: ReactNode }) {
  // Initialize to a deterministic value so server and client match during
  // hydration. Load stored preference only after mount to avoid hydration
  // mismatches when localStorage differs from the server default.
  const [season, setSeason] = useState<Season>(() => "light");

  // After mount, read stored season (if any) and apply it.
  useEffect(() => {
    try {
      const stored = localStorage.getItem("season");
      if (stored) {
        // Normalize legacy season values to our simplified light/dark theme.
        let normalized: Season = "light";
        if (stored === "night" || stored === "dark") normalized = "dark";
        setSeason((prev) => (normalized !== prev ? normalized : prev));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (season === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("season", season);
  }, [season]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== "season" || !event.newValue) return;
      const stored = event.newValue;
      let normalized: Season = "light";
      if (stored === "night" || stored === "dark") normalized = "dark";
      setSeason(normalized);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      season,
      setSeason,
      cycle: () => {
        const ids = SEASONS.map((s) => s.id);
        const i = ids.indexOf(season);
        setSeason(ids[(i + 1) % ids.length]);
      },
    }),
    [season],
  );

  return <SeasonCtx.Provider value={value}>{children}</SeasonCtx.Provider>;
}

export function useSeason() {
  const ctx = useContext(SeasonCtx);
  if (!ctx) throw new Error("useSeason must be used inside SeasonProvider");
  return ctx;
}
