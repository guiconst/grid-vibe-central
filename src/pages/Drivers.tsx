import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DriverCard, StatPill } from "@/components/grid/Cards";
import { Button } from "@/components/ui/button";
import { useGrid } from "@/context/GridContext";
import { driverById, drivers, teamById } from "@/lib/gridData";

export default function Drivers() {
  const { t, teams, setThemeTeam } = useGrid();
  const [teamFilter, setTeamFilter] = useState("all");
  const filtered = teamFilter === "all" ? drivers : drivers.filter((driver) => driver.teamId === teamFilter);
  return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><h1 className="font-display text-5xl font-black">{t.drivers.title}</h1><p className="mt-3 text-muted-foreground">{t.drivers.subtitle}</p><div className="my-8 flex flex-wrap gap-2"><Button variant={teamFilter === "all" ? "hero" : "soft"} onClick={() => setTeamFilter("all")}>{t.common.all}</Button>{teams.map((team) => <Button key={team.id} variant={teamFilter === team.id ? "hero" : "soft"} onClick={() => setTeamFilter(team.id)}>{team.name}</Button>)}</div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{filtered.map((driver) => <DriverCard key={driver.id} driver={driver} team={teamById(driver.teamId)} onActivate={() => setThemeTeam(driver.teamId)} />)}</div></section>;
}

export function DriverDetail() {
  const { id } = useParams();
  const { t, language, setThemeTeam } = useGrid();
  const driver = driverById(id || "") || drivers[0];
  const team = teamById(driver.teamId);
  useEffect(() => setThemeTeam(team.id), [team.id, setThemeTeam]);
  return <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8"><div className="rounded-lg border border-border bg-card p-6 shadow-card"><div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-primary">{team.name} · {driver.flag} {driver.nationality[language]}</p><h1 className="font-display text-5xl font-black">{driver.name}</h1></div><div className="grid h-28 w-28 place-items-center rounded-lg bg-muted font-display text-5xl font-black text-primary">#{driver.number}</div></div><p className="mt-6 text-lg text-muted-foreground">{driver.bio[language]}</p><div className="mt-8 grid gap-3 sm:grid-cols-4"><StatPill label={t.drivers.starts} value={driver.stats.starts} /><StatPill label={t.common.wins} value={driver.stats.wins} /><StatPill label={t.drivers.podiums} value={driver.stats.podiums} /><StatPill label={t.drivers.poles} value={driver.stats.poles} /></div><h2 className="mt-10 font-display text-3xl font-bold">{t.drivers.season}</h2><div className="mt-4 grid gap-3 sm:grid-cols-3"><StatPill label={t.common.points} value={driver.season.points} /><StatPill label={t.common.wins} value={driver.season.wins} /><StatPill label={t.drivers.podiums} value={driver.season.podiums} /></div><h2 className="mt-10 font-display text-3xl font-bold">{t.drivers.facts}</h2><ul className="mt-4 grid gap-3">{driver.facts[language].map((fact) => <li key={fact} className="rounded-md bg-muted p-4 text-muted-foreground">{fact}</li>)}</ul></div></section>;
}
