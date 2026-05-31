import { useEffect, useMemo, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import {
  SeasonCtx,
  type Season,
  type SeasonContextValue,
} from "./season-context";

type Preference = Season | "system";

const SEASONS: { id: Season; label: string; hint: string }[] = [
  { id: "light", label: "Light", hint: "Bright" },
  { id: "dark", label: "Dark", hint: "Dim" },
];

function getSystemSeason(): Season {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
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
  const [preference, setPreference] = useState<Preference>(() =>
    readStoredPreference(),
  );
  const [systemSeason, setSystemSeason] = useState<Season>(() =>
    getSystemSeason(),
  );
  const season = preference === "system" ? systemSeason : preference;

  useEffect(() => {
    document.documentElement.dataset.themeReady = "true";
  }, []);

  const applyPreference = (nextPreference: Preference) => {
    if (typeof document.startViewTransition === "function") {
      document.startViewTransition(() => {
        flushSync(() => {
          setPreference(nextPreference);
        });
      });
      return;
    }

    setPreference(nextPreference);
  };

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
    root.style.colorScheme = season;

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

  const value = useMemo<SeasonContextValue>(
    () => ({
      season,
      setSeason: (nextSeason: Season) => applyPreference(nextSeason),
      cycle: () => {
        const ids = SEASONS.map((s) => s.id);
        const i = ids.indexOf(season);
        applyPreference(ids[(i + 1) % ids.length]);
      },
    }),
    [season],
  );

  return <SeasonCtx.Provider value={value}>{children}</SeasonCtx.Provider>;
}
