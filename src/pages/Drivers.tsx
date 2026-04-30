import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DriverCard, StatPill } from "@/components/grid/Cards";
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
  const bio = driver.bio?.[language];
  const facts = driver.facts?.[language] ?? [];
  // 📸 FOTO DO PILOTO: coloque o arquivo em `public/images/drivers/{driver.id}.png`
  //    (ex.: public/images/drivers/antonelli.png) — a imagem aparecerá automaticamente.
  const photoSrc = `/images/drivers/${driver.id}.avif`;

  // ✍️ BIOGRAFIA DO PILOTO: edite o texto manualmente em `src/data/driverBios.ts`
  //    Adicione uma entrada com o id do piloto (ex.: antonelli: "Texto da bio...").
  const manualBio = (driverBios as Record<string, string | undefined>)[driver.id];

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-border bg-card p-6 shadow-card">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-primary">{team.name}</p>
            <h1 className="font-display text-5xl font-black">{driver.name}</h1>
          </div>
          <div className="grid h-28 w-28 place-items-center rounded-lg bg-muted font-display text-5xl font-black text-primary">#{driver.number}</div>
        </div>

        {/* Espaço para foto do piloto */}
        <div
          className="mt-6 overflow-hidden rounded-xl border border-border"
          style={{ background: `linear-gradient(135deg, hsl(${team.primary} / 0.15), #18181b 60%)` }}
        >
          <img
            src={photoSrc}
            alt={driver.name}
            className="mx-auto block max-h-96 w-full object-contain object-center"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>

        {/* Biografia manual */}
        <div className="mt-6 rounded-xl border border-border bg-muted/40 p-5">
          <h2 className="font-display text-2xl font-bold">{language === "pt" ? "Biografia" : "Biography"}</h2>
          {manualBio ? (
            <p className="mt-3 whitespace-pre-line text-muted-foreground">{manualBio}</p>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              ✍️ {language === "pt" ? "Edite manualmente em" : "Edit manually in"}{" "}
              <code className="rounded bg-background px-1.5 py-0.5">src/data/driverBios.ts</code>{" "}
              {language === "pt" ? "adicionando a chave" : "adding the key"}{" "}
              <code className="rounded bg-background px-1.5 py-0.5">{driver.id}</code>.
            </p>
          )}
        </div>

        {bio && <p className="mt-6 text-lg text-muted-foreground">{bio}</p>}
        <div className="mt-8 grid gap-3 sm:grid-cols-4">
          <StatPill label={t.drivers.starts} value={driver.stats.starts} />
          <StatPill label={t.common.wins} value={driver.stats.wins} />
          <StatPill label={t.drivers.podiums} value={driver.stats.podiums} />
          <StatPill label={t.drivers.poles} value={driver.stats.poles} />
        </div>
        <h2 className="mt-10 font-display text-3xl font-bold">{t.drivers.season}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <StatPill label={t.common.points} value={driver.season.points} />
          <StatPill label={t.common.wins} value={driver.season.wins ?? 0} />
          <StatPill label={t.drivers.podiums} value={driver.season.podiums ?? 0} />
        </div>
        {facts.length > 0 && (
          <>
            <h2 className="mt-10 font-display text-3xl font-bold">{t.drivers.facts}</h2>
            <ul className="mt-4 grid gap-3">
              {facts.map((fact) => <li key={fact} className="rounded-md bg-muted p-4 text-muted-foreground">{fact}</li>)}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
