/**
 * Ponto único de acesso aos dados estáticos (fallback) do app.
 * Cada JSON mora dentro da pasta da sua própria feature; este arquivo só
 * importa, tipa e expõe funções de busca (teamById, driverById, etc).
 */
import driversJson from "@/features/drivers/data/drivers.json";
import teamsJson from "@/features/teams/data/teams.json";
import calendarJson from "@/features/calendar/data/calendar.json";
import newsJson from "@/features/news/data/news.json";
import standings from "@/data/standings.json";
import type { Team, Driver, Race, Lang } from "@/lib/types";

export type { Team, Driver, Race, Lang };
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
