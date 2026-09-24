import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
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

  const applyPreference = useCallback(
    (nextPreference: Preference, event?: React.MouseEvent | MouseEvent) => {
      const nextSeason =
        nextPreference === "system" ? systemSeason : nextPreference;

      if (
        typeof document.startViewTransition === "function" &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;

        if (event && "clientX" in event && event.clientX) {
          x = event.clientX;
          y = event.clientY;
        } else {
          const toggleBtn = document.querySelector("[data-theme-toggle]");
          if (toggleBtn) {
            const rect = toggleBtn.getBoundingClientRect();
            x = rect.left + rect.width / 2;
            y = rect.top + rect.height / 2;
          }
        }

        const endRadius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y),
        );

        const root = document.documentElement;

        const transition = document.startViewTransition(() => {
          root.classList.toggle("dark", nextSeason === "dark");
          root.style.colorScheme = nextSeason;
          flushSync(() => {
            setPreference(nextPreference);
          });
        });

        transition.ready
          .then(() => {
            document.documentElement.animate(
              {
                clipPath: [
                  `circle(0px at ${x}px ${y}px)`,
                  `circle(${endRadius}px at ${x}px ${y}px)`,
                ],
              },
              {
                duration: 480,
                easing: "cubic-bezier(0.16, 1, 0.3, 1)",
                pseudoElement: "::view-transition-new(root)",
              },
            );
          })
          .catch(() => {});

        return;
      }

      const root = document.documentElement;
      root.classList.toggle("dark", nextSeason === "dark");
      root.style.colorScheme = nextSeason;
      setPreference(nextPreference);
    },
    [systemSeason],
  );

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
      setSeason: (nextSeason: Season, event?: React.MouseEvent | MouseEvent) =>
        applyPreference(nextSeason, event),
      toggleSeason: (event?: React.MouseEvent | MouseEvent) =>
        applyPreference(season === "light" ? "dark" : "light", event),
      cycle: () => {
        const ids = SEASONS.map((s) => s.id);
        const i = ids.indexOf(season);
        applyPreference(ids[(i + 1) % ids.length]);
      },
    }),
    [season, applyPreference],
  );

  return <SeasonCtx.Provider value={value}>{children}</SeasonCtx.Provider>;
}
