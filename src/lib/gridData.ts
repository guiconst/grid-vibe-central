import driversJson from "@/data/drivers.json";
import teamsJson from "@/data/teams.json";
import calendarJson from "@/data/calendar.json";
import newsJson from "@/data/news.json";
import standings from "@/data/standings.json";

export type Lang = "pt" | "en";

export type Team = {
  id: string;
  name: string;
  fullName: string;
  primary: string;
  secondary: string;
  base: string;
  championships: number;
  car: string;
  country?: string;
  history: { pt: string; en: string };
  curiosities: { pt: string[]; en: string[] };
};

export type Driver = {
  id: string;
  name: string;
  number: number;
  teamId: string;
  flag?: string;
  nationality?: { pt: string; en: string };
  bio?: { pt: string; en: string };
  facts?: { pt: string[]; en: string[] };
  stats: { starts: number; wins: number; podiums: number; poles: number };
  season: { position: number; points: number; wins?: number; podiums?: number };
};

export type Race = {
  id: string;
  name: { pt: string; en: string };
  circuit: string;
  date: string;
  status: string;
  flag?: string;
};

export type NewsItem = (typeof newsJson)[number];

export const teams = teamsJson as Team[];
export const drivers = driversJson as Driver[];
export const calendar = calendarJson as Race[];
export const news = newsJson;
export { standings };

export const teamById = (id: string) => teams.find((team) => team.id === id) || teams[1];
export const driverById = (id: string) => drivers.find((driver) => driver.id === id);
export const driversByTeam = (teamId: string) => drivers.filter((driver) => driver.teamId === teamId);
export const nextRace = calendar.find((race) => race.status === "next") || calendar.find((race) => race.status === "upcoming") || calendar[0];

export function formatRaceDate(date: string, language: Lang) {
  return new Intl.DateTimeFormat(language === "pt" ? "pt-BR" : "en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${date}T12:00:00`));
}
