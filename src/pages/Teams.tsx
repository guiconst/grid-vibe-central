import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { TeamCard, StatPill } from "@/components/grid/Cards";
import { Button } from "@/components/ui/button";
import { useGrid } from "@/context/GridContext";
import { driversByTeam, teamById } from "@/lib/gridData";

export default function Teams() {
  const { t, teams, setThemeTeam } = useGrid();
  return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><h1 className="font-display text-5xl font-black">{t.teams.title}</h1><p className="mt-3 text-muted-foreground">{t.teams.subtitle}</p><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{teams.map((team) => <TeamCard key={team.id} team={team} onActivate={() => setThemeTeam(team.id)} />)}</div></section>;
}

export function TeamDetail() {
  const { id } = useParams();
  const { t, language, setThemeTeam, favoriteTeam } = useGrid();
  const team = teamById(id || "red-bull");
  const currentDrivers = driversByTeam(team.id);
  useEffect(() => {
    setThemeTeam(team.id);
    return () => setThemeTeam(favoriteTeam.id);
  }, [team.id, favoriteTeam.id, setThemeTeam]);
  return <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8"><div className="rounded-lg border border-border bg-card p-6 shadow-card"><span className="mb-6 block h-2 rounded-full" style={{ background: `linear-gradient(90deg, hsl(${team.primary}), hsl(${team.secondary}))` }} /><p className="text-primary">{team.country} {team.base}</p><h1 className="font-display text-5xl font-black">{team.fullName}</h1><p className="mt-6 text-lg text-muted-foreground">{team.history[language]}</p><div className="mt-8 grid gap-3 sm:grid-cols-3"><StatPill label={t.teams.championships} value={team.championships} /><StatPill label={t.teams.car} value={team.car} /><StatPill label={t.teams.base} value={team.base} /></div><h2 className="mt-10 font-display text-3xl font-bold">{t.teams.currentDrivers}</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{currentDrivers.map((driver) => <Link key={driver.id} to={`/pilotos/${driver.id}`} className="rounded-md bg-muted p-4 transition-grid-theme hover:bg-accent"><strong>{driver.name}</strong><span className="block text-sm text-muted-foreground">#{driver.number} · {driver.flag}</span></Link>)}</div><h2 className="mt-10 font-display text-3xl font-bold">{t.teams.curiosities}</h2><ul className="mt-4 grid gap-3">{team.curiosities[language].map((fact) => <li key={fact} className="rounded-md bg-muted p-4 text-muted-foreground">{fact}</li>)}</ul><Button variant="hero" className="mt-8" onClick={() => setThemeTeam(team.id)}>{t.common.favorite}: {team.name}</Button></div></section>;
}
