import { useGrid } from "@/shared/context/GridContext";
import { TeamCard } from "@/features/teams/components/TeamCard";

export default function TeamsList() {
  const { t, teams } = useGrid();
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl font-black animate-fade-up">{t.teams.title}</h1>
      <p className="mt-3 text-muted-foreground animate-fade-up" style={{ animationDelay: "100ms" }}>{t.teams.subtitle}</p>
      <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {teams.map((team, i) => (
          <div key={team.id} className="animate-fade-up" style={{ animationDelay: `${120 + i * 80}ms` }}>
            <TeamCard team={team} />
          </div>
        ))}
      </div>
    </section>
  );
}
