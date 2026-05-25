import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

export type Season = "sunny" | "rain" | "night" | "autumn";

export const SEASONS: { id: Season; label: string; hint: string }[] = [
  { id: "sunny", label: "Sunny", hint: "Paper & light" },
  { id: "rain", label: "Rain", hint: "Soft drizzle" },
  { id: "night", label: "Night", hint: "Stars twinkling" },
  { id: "autumn", label: "Autumn", hint: "Beige evening" },
];

type Ctx = {
  season: Season;
  setSeason: (s: Season) => void;
  cycle: () => void;
};

const SeasonCtx = createContext<Ctx | null>(null);

export function SeasonProvider({ children }: { children: ReactNode }) {
  const [season, setSeason] = useState<Season>(() => {
    if (typeof window === "undefined") return "night";
    const stored = localStorage.getItem("season");
    return (stored as Season) || "night";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.season = season;
    localStorage.setItem("season", season);
  }, [season]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== "season" || !event.newValue) return;
      setSeason(event.newValue as Season);
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
