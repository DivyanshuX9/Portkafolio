import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

export type Season = "light" | "dark";

type Preference = Season | "system";

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

function getSystemSeason(): Season {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStoredPreference(): Preference {
  try {
    const stored = localStorage.getItem("season");
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // ignore storage access errors
  }
  return "system";
}

export function SeasonProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<Preference>(() => readStoredPreference());
  const [systemSeason, setSystemSeason] = useState<Season>(() => getSystemSeason());
  const season = preference === "system" ? systemSeason : preference;

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const syncSystemSeason = () => {
      setSystemSeason(media.matches ? "dark" : "light");
    };

    syncSystemSeason();

    if (media.addEventListener) {
      media.addEventListener("change", syncSystemSeason);
      return () => media.removeEventListener("change", syncSystemSeason);
    }

    media.addListener(syncSystemSeason);
    return () => media.removeListener(syncSystemSeason);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", season === "dark");

    if (preference === "system") {
      localStorage.removeItem("season");
    } else {
      localStorage.setItem("season", preference);
    }
  }, [preference, season]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== "season") return;
      if (!event.newValue) {
        setPreference("system");
        return;
      }
      if (event.newValue === "light" || event.newValue === "dark") {
        setPreference(event.newValue);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      season,
      setSeason: (nextSeason: Season) => setPreference(nextSeason),
      cycle: () => {
        const ids = SEASONS.map((s) => s.id);
        const i = ids.indexOf(season);
        setPreference(ids[(i + 1) % ids.length]);
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
