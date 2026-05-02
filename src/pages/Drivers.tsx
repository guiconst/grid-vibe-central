import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DriverCard } from "@/components/grid/Cards";
import { Button } from "@/components/ui/button";
import { useGrid } from "@/context/GridContext";
import { driverById, drivers, teamById } from "@/lib/gridData";
import driverBios from "@/data/driverBios";

export default function Drivers() {
  const { t, teams, setThemeTeam } = useGrid();
  const [teamFilter, setTeamFilter] = useState("all");
  const filtered = teamFilter === "all" ? drivers : drivers.filter((driver) => driver.teamId === teamFilter);
  return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><h1 className="font-display text-5xl font-black">{t.drivers.title}</h1><p className="mt-3 text-muted-foreground">{t.drivers.subtitle}</p><div className="my-8 flex flex-wrap gap-2"><Button variant={teamFilter === "all" ? "hero" : "soft"} onClick={() => setTeamFilter("all")}>{t.common.all}</Button>{teams.map((team) => <Button key={team.id} variant={teamFilter === team.id ? "hero" : "soft"} onClick={() => setTeamFilter(team.id)}>{team.name}</Button>)}</div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{filtered.map((driver) => <DriverCard key={driver.id} driver={driver} team={teamById(driver.teamId)} onActivate={() => setThemeTeam(driver.teamId)} />)}</div></section>;
}

export function DriverDetail() {
  const { id } = useParams();
  const { t, language, setThemeTeam, favoriteTeam } = useGrid();
  const driver = driverById(id || "") || drivers[0];
  const team = teamById(driver.teamId);
  useEffect(() => {
    setThemeTeam(team.id);
    return () => setThemeTeam(favoriteTeam.id);
  }, [team.id, favoriteTeam.id, setThemeTeam]);

  const photoSrc = `/images/drivers/${driver.id}.avif`;
  const manualBio = (driverBios as Record<string, string | undefined>)[driver.id];
  const champ = (driver as any).championships ?? 0;

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-border bg-card p-6 shadow-card">

        {/* Header: nome + número */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-primary">{team.name}</p>
            <h1 className="font-display text-5xl font-black">{driver.name}</h1>
          </div>
          <div className="grid h-24 w-24 flex-shrink-0 place-items-center rounded-lg bg-muted font-display text-5xl font-black text-primary">
            #{driver.number}
          </div>
        </div>

        {/* Foto + Bio lado a lado — bio com altura fixa e scroll se necessário */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[16rem_1fr]">
          {/* Foto */}
          <div
            className="overflow-hidden rounded-xl border border-border"
            style={{ background: `linear-gradient(135deg, hsl(${team.primary} / 0.15), #18181b 60%)` }}
          >
            <img
              src={photoSrc}
              alt={driver.name}
              className="block w-full object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).closest("div")!.style.display = "none";
              }}
            />
          </div>

          {/* Bio — altura máxima com scroll interno para não estourar no desktop */}
          <div className="rounded-xl border border-border bg-muted/40 p-5 lg:max-h-80 lg:overflow-y-auto">
            <h2 className="font-display text-xl font-bold">{language === "pt" ? "Biografia" : "Biography"}</h2>
            {manualBio ? (
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{manualBio}</p>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                ✍️ {language === "pt" ? "Edite em" : "Edit in"}{" "}
                <code className="rounded bg-background px-1.5 py-0.5">src/data/driverBios.ts</code>
              </p>
            )}
          </div>
        </div>

        {/* Títulos mundiais */}
        <div className="mt-6">
          {champ > 0 ? (
            <div
              className="relative overflow-hidden rounded-2xl p-6"
              style={{
                background: "linear-gradient(135deg, #2a1f00 0%, #1a1200 40%, #2a1f00 100%)",
                border: "1px solid #b8860b88",
                boxShadow: "0 0 32px #b8860b44, 0 0 8px #ffd70033, inset 0 1px 0 #ffd70044",
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                  background: "linear-gradient(105deg, transparent 40%, rgba(255,215,0,0.08) 50%, transparent 60%)",
                  animation: "shimmer 3s infinite linear",
                }}
              />
              <style>{`@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }`}</style>
              <div className="pointer-events-none absolute top-3 right-6 text-2xl opacity-60 select-none">★</div>
              <div className="pointer-events-none absolute bottom-3 left-6 text-lg opacity-30 select-none">✦</div>
              <div className="relative z-10 flex items-center gap-4">
                <div
                  className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full text-3xl"
                  style={{ background: "linear-gradient(135deg, #b8860b, #ffd700, #b8860b)", boxShadow: "0 0 20px #ffd70066" }}
                >
                  🏆
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#b8860b" }}>
                    {language === "pt" ? "Títulos Mundiais de Pilotos" : "World Drivers' Championships"}
                  </p>
                  <p
                    className="font-display text-5xl font-black leading-none"
                    style={{
                      background: "linear-gradient(135deg, #b8860b, #ffd700, #fffacd, #ffd700, #b8860b)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {champ}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-zinc-900 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xl">🏆</div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                    {language === "pt" ? "Títulos Mundiais de Pilotos" : "World Drivers' Championships"}
                  </p>
                  <p className="font-display text-4xl font-black text-white/25">0</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Temporada 2026 */}
        <h2 className="mt-10 font-display text-2xl font-bold">{language === "pt" ? "Temporada 2026" : "2026 Season"}</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: language === "pt" ? "Pontos" : "Points", value: (driver as any).season?.points ?? 0 },
            { label: language === "pt" ? "Vitórias" : "Wins", value: (driver as any).season?.wins ?? 0 },
            { label: language === "pt" ? "Pódios" : "Podiums", value: (driver as any).season?.podiums ?? 0 },
            { label: language === "pt" ? "Posição" : "Position", value: `P${(driver as any).season?.position ?? "—"}` },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-border bg-muted/50 p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
              <p className="mt-1 font-display text-3xl font-black text-primary">{value}</p>
            </div>
          ))}
        </div>

        {/* Estatísticas de carreira */}
        <h2 className="mt-10 font-display text-2xl font-bold">{language === "pt" ? "Carreira" : "Career Stats"}</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: language === "pt" ? "Largadas" : "Starts", value: driver.stats.starts },
            { label: language === "pt" ? "Vitórias" : "Wins", value: driver.stats.wins },
            { label: language === "pt" ? "Pódios" : "Podiums", value: driver.stats.podiums },
            { label: language === "pt" ? "Poles" : "Poles", value: driver.stats.poles },
            { label: "DNFs", value: (driver.stats as any).dnfs ?? 0 },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-border bg-muted/50 p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
              <p className="mt-1 font-display text-3xl font-black text-primary">{value}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
