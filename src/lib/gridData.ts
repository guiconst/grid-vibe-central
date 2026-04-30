import drivers from "@/data/drivers.json";
import teams from "@/data/teams.json";
import calendar from "@/data/calendar.json";
import news from "@/data/news.json";
import standings from "@/data/standings.json";

export type Lang = "pt" | "en";
export type Team = (typeof teams)[number];
export type Driver = (typeof drivers)[number];
export type Race = (typeof calendar)[number];
export type NewsItem = (typeof news)[number];

export { drivers, teams, calendar, news, standings };

export const teamById = (id: string) => teams.find((team) => team.id === id) || teams[1];
export const driverById = (id: string) => drivers.find((driver) => driver.id === id);
export const driversByTeam = (teamId: string) => drivers.filter((driver) => driver.teamId === teamId);
export const nextRace = calendar.find((race) => race.status === "next") || calendar.find((race) => race.status === "upcoming") || calendar[0];

export function formatRaceDate(date: string, language: Lang) {
  return new Intl.DateTimeFormat(language === "pt" ? "pt-BR" : "en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${date}T12:00:00`));
}
