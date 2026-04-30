import { createContext, useContext, useEffect, useMemo, useState } from "react";
import teams from "@/data/teams.json";
import pt from "@/i18n/pt.json";
import en from "@/i18n/en.json";

type Language = "pt" | "en";
type Team = (typeof teams)[number];
type GridContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: typeof pt;
  teams: Team[];
  activeTeam: Team;
  favoriteTeam: Team;
  setThemeTeam: (teamId: string) => void;
  saveFavoriteTeam: (teamId: string) => void;
  showFavoriteModal: boolean;
  setShowFavoriteModal: (show: boolean) => void;
  teamById: (teamId: string) => Team;
};

const DEFAULT_TEAM = "red-bull";
const GridContext = createContext<GridContextValue | null>(null);

export function GridProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => (localStorage.getItem("cdg-language") as Language) || "pt");
  const [favoriteTeamId, setFavoriteTeamId] = useState(() => localStorage.getItem("cdg-favorite-team") || DEFAULT_TEAM);
  const [activeTeamId, setActiveTeamId] = useState(() => localStorage.getItem("cdg-active-team") || favoriteTeamId || DEFAULT_TEAM);
  const [showFavoriteModal, setShowFavoriteModal] = useState(() => !localStorage.getItem("cdg-favorite-team"));

  const teamById = (teamId: string) => teams.find((team) => team.id === teamId) || teams.find((team) => team.id === DEFAULT_TEAM)!;
  const activeTeam = teamById(activeTeamId);
  const favoriteTeam = teamById(favoriteTeamId);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--team-primary", activeTeam.primary);
    root.style.setProperty("--team-secondary", activeTeam.secondary);
    root.style.setProperty("--primary", activeTeam.primary);
    root.style.setProperty("--ring", activeTeam.primary);
    localStorage.setItem("cdg-active-team", activeTeam.id);
  }, [activeTeam]);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    localStorage.setItem("cdg-language", nextLanguage);
  };

  const saveFavoriteTeam = (teamId: string) => {
    localStorage.setItem("cdg-favorite-team", teamId);
    setFavoriteTeamId(teamId);
    setActiveTeamId(teamId);
    setShowFavoriteModal(false);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: language === "pt" ? pt : en,
      teams,
      activeTeam,
      favoriteTeam,
      setThemeTeam: setActiveTeamId,
      saveFavoriteTeam,
      showFavoriteModal,
      setShowFavoriteModal,
      teamById,
    }),
    [language, activeTeam, favoriteTeam, showFavoriteModal],
  );

  return <GridContext.Provider value={value}>{children}</GridContext.Provider>;
}

export function useGrid() {
  const context = useContext(GridContext);
  if (!context) throw new Error("useGrid must be used within GridProvider");
  return context;
}
