import { useState } from "react";
import { DriverCard } from "@/features/drivers/components/DriverCard";
import { Button } from "@/components/ui/button";
import { useGrid } from "@/shared/context/GridContext";
import { drivers, teamById } from "@/lib/entities";

export default function DriversList() {
  const { t, teams, setThemeTeam } = useGrid();
  const [teamFilter, setTeamFilter] = useState("all");
  const filtered = teamFilter === "all" ? drivers : drivers.filter((driver) => driver.teamId === teamFilter);
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl font-black animate-fade-up">{t.drivers.title}</h1>
      <p className="mt-3 text-muted-foreground animate-fade-up" style={{ animationDelay: "100ms" }}>{t.drivers.subtitle}</p>
      <div className="my-8 flex flex-wrap gap-2 animate-fade-up" style={{ animationDelay: "180ms" }}>
        <Button variant={teamFilter === "all" ? "hero" : "soft"} onClick={() => setTeamFilter("all")}>{t.common.all}</Button>
        {teams.map((team) => (
          <Button key={team.id} variant={teamFilter === team.id ? "hero" : "soft"} onClick={() => setTeamFilter(team.id)}>{team.name}</Button>
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((driver, i) => (
          <div key={driver.id} className="animate-fade-up" style={{ animationDelay: `${260 + i * 80}ms` }}>
            <DriverCard driver={driver} team={teamById(driver.teamId)} onActivate={() => setThemeTeam(driver.teamId)} />
          </div>
        ))}
      </div>
    </section>
  );
}
