import { createContext, useContext } from "react";

export type Season = "light" | "dark";

export type SeasonContextValue = {
  season: Season;
  setSeason: (s: Season) => void;
  cycle: () => void;
};

export const SeasonCtx = createContext<SeasonContextValue | null>(null);

export function useSeason() {
  const ctx = useContext(SeasonCtx);
  if (!ctx) throw new Error("useSeason must be used inside SeasonProvider");
  return ctx;
}
