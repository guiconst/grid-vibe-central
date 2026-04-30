import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { StatPill } from "@/components/grid/Cards";
import { useGrid } from "@/context/GridContext";
import { driversByTeam, teamById } from "@/lib/gridData";

export default function Teams() {
  const { t, teams } = useGrid();
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl font-black">{t.teams.title}</h1>
      <p className="mt-3 text-muted-foreground">{t.teams.subtitle}</p>
      <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {teams.map((team) => (
          <TeamLogoCard key={team.id} team={team} />
        ))}
      </div>
    </section>
  );
}

function TeamLogoCard({ team }: { team: ReturnType<typeof teamById> }) {
  const primaryColor = `hsl(${team.primary})`;
  const secondaryColor = `hsl(${team.secondary})`;
  return (
    <Link
      to={`/equipes/${team.id}`}
      className="group relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 transition-all duration-300 hover:scale-105 hover:border-transparent"
      style={
        {
          "--team-glow": primaryColor,
        } as React.CSSProperties
      }
    >
      {/* Glow background on hover */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at center, ${primaryColor}33 0%, ${primaryColor}11 50%, transparent 70%)`,
          boxShadow: `inset 0 0 40px ${primaryColor}22`,
        }}
      />
      {/* Border glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow: `0 0 20px ${primaryColor}66, 0 0 40px ${primaryColor}33`,
          border: `1px solid ${primaryColor}88`,
        }}
      />
      {/* Color bar top */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }}
      />
      {/* Logo */}
      <div className="relative z-10 flex h-3/5 w-3/5 items-center justify-center p-3">
        <img
          src={`/images/teams/logos/${team.id}.png`}
          alt={team.name}
          className="h-full w-full object-contain transition-all duration-300 group-hover:drop-shadow-lg"
          style={{ filter: "drop-shadow(0 0 0px transparent)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLImageElement).style.filter = `drop-shadow(0 0 8px ${primaryColor})`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLImageElement).style.filter = "drop-shadow(0 0 0px transparent)";
          }}
        />
      </div>
      {/* Team name */}
      <p className="relative z-10 mt-2 text-center text-sm font-bold text-white/60 transition-colors duration-300 group-hover:text-white">
        {team.name}
      </p>
    </Link>
  );
}

export function TeamDetail() {
  const { id } = useParams();
  const { t, language, setThemeTeam, favoriteTeam } = useGrid();
  const team = teamById(id || "red-bull");
  const currentDrivers = driversByTeam(team.id);
  const primaryColor = `hsl(${team.primary})`;
  const secondaryColor = `hsl(${team.secondary})`;

  useEffect(() => {
    setThemeTeam(team.id);
    return () => setThemeTeam(favoriteTeam.id);
  }, [team.id, favoriteTeam.id, setThemeTeam]);

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 p-8">
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: `radial-gradient(circle at top right, ${primaryColor}, transparent 60%)` }}
        />
        <span className="mb-6 block h-1 rounded-full" style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }} />
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-white/50">{team.country} · {team.base}</p>
            <h1 className="font-display text-4xl font-black text-white sm:text-5xl">{team.fullName}</h1>
          </div>
          <img
            src={`/images/teams/logos/${team.id}.png`}
            alt={team.name}
            className="h-24 w-24 object-contain"
            style={{ filter: `drop-shadow(0 0 12px ${primaryColor}88)` }}
          />
        </div>
        <p className="relative z-10 mt-6 text-lg text-white/70">{team.history[language]}</p>
      </div>

      {/* Stats históricos */}
      <div className="mt-6">
        <h2 className="mb-4 font-display text-2xl font-bold">{t.teams.championships} & {t.teams.car}</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <StatPill label={t.teams.championships} value={team.championships} />
          <StatPill label={t.teams.car} value={team.car} />
          <StatPill label={t.teams.base} value={team.base} />
        </div>
      </div>

      {/* Dados atuais da temporada — reservado */}
      <div className="mt-6 rounded-2xl border border-dashed border-white/20 bg-zinc-900/50 p-6">
        <h2 className="font-display text-2xl font-bold">{language === "pt" ? "Dados da Temporada 2026" : "2026 Season Data"}</h2>
        <p className="mt-2 text-sm text-white/40">{language === "pt" ? "Em breve — dados atuais da temporada serão adicionados aqui." : "Coming soon — current season data will be added here."}</p>
      </div>

      {/* Foto do carro */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden">
        <div className="px-6 pt-5 pb-3">
          <h2 className="font-display text-2xl font-bold">{language === "pt" ? `Carro — ${team.car}` : `Car — ${team.car}`}</h2>
        </div>
        <div
          className="relative flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${primaryColor}18, #18181b 60%)` }}
        >
          <img
            src={`/images/teams/cars/${team.id}.avif`}
            alt={team.car}
            className="w-full max-h-72 object-contain py-4 px-6 drop-shadow-2xl"
            onError={(e) => {
              const img = e.currentTarget;
              img.style.display = "none";
              img.parentElement?.querySelector("[data-car-placeholder]")?.removeAttribute("hidden");
            }}
          />
          <p data-car-placeholder hidden className="py-12 text-sm text-white/30">
            {language === "pt" ? "Foto do carro não encontrada" : "Car photo not found"}
          </p>
        </div>
      </div>

      {/* Pilotos — reservado para fotos */}
      <div className="mt-6">
        <h2 className="mb-4 font-display text-2xl font-bold">{t.teams.currentDrivers}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {currentDrivers.map((driver) => (
            <Link
              key={driver.id}
              to={`/pilotos/${driver.id}`}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 p-5 transition-all duration-300 hover:border-white/20 hover:scale-105"
            >
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: `radial-gradient(circle at top left, ${primaryColor}22, transparent 60%)` }}
              />
              {/* Foto do piloto */}
              <div
                className="mb-4 h-48 overflow-hidden rounded-xl border border-white/10 relative flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${primaryColor}18, #18181b)` }}
              >
                <img
                  src={`/images/drivers/${driver.id}.avif`}
                  alt={driver.name}
                  className="h-full w-full object-contain object-center"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div className="relative z-10">
                <p className="text-2xl font-black text-white">{driver.name}</p>
                <p className="text-sm text-white/50">#{driver.number} · {driver.flag}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Curiosidades */}
      <div className="mt-6">
        <h2 className="mb-4 font-display text-2xl font-bold">{t.teams.curiosities}</h2>
        <ul className="grid gap-3">
          {team.curiosities[language].map((fact) => (
            <li key={fact} className="rounded-xl border border-white/10 bg-zinc-900 p-4 text-white/70">{fact}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
