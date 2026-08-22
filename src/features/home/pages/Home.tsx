import { Link } from "react-router-dom";
import { ArrowRight, Trophy, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/features/calendar/components/Countdown";
import { NewsCard } from "@/features/news/components/NewsCard";
import { useGrid } from "@/shared/context/GridContext";
import { drivers, news, teamById } from "@/lib/entities";
import { useStandings, useNextRace, useLastRaceResults } from "@/shared/hooks/useF1Data";

export default function Home() {
  const { t, language } = useGrid();
  const { nextRace } = useNextRace();
  const { drivers: driverRows, constructors: constructorRows } = useStandings();
  const { data: lastRace } = useLastRaceResults();

  // Leader cards from live standings
  const driverLeaderRow = driverRows[0];
  const constructorLeaderRow = constructorRows[0];

  const leaderLocalDriver = driverLeaderRow
    ? drivers.find((d) => d.id === driverLeaderRow.driverId)
    : null;
  const leaderTeam = leaderLocalDriver
    ? teamById(leaderLocalDriver.teamId)
    : driverLeaderRow?.teamId
    ? teamById(driverLeaderRow.teamId)
    : null;

  const constructorTeam = constructorLeaderRow?.teamId
    ? teamById(constructorLeaderRow.teamId)
    : null;

  const leaderName = leaderLocalDriver?.name ?? driverLeaderRow?.driverName ?? "—";
  const leaderPoints = driverLeaderRow?.points ?? 0;
  const constructorName =
    constructorTeam?.id === "red-bull"
      ? "Red Bull Racing"
      : constructorTeam?.name ?? constructorLeaderRow?.teamName ?? "—";
  const constructorPoints = constructorLeaderRow?.points ?? 0;

  const driverFaceSrc = leaderLocalDriver
    ? `/images/drivers/face/${leaderLocalDriver.id}.webp`
    : null;
  const constructorLogo = constructorTeam
    ? `/images/teams/logos/${constructorTeam.id}.png`
    : null;

  return (
    <div>
      {/* Countdown */}
      {nextRace && (
        <section
          className="mx-auto max-w-3xl px-4 pt-8 pb-2 text-center sm:px-6 lg:px-8 animate-fade-up"
          style={{ animationDelay: "0ms" }}
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
            {t.home.nextRace}
          </p>
          <Countdown race={nextRace} centered compact />
        </section>
      )}

      {/* Hero: título + líderes */}
      <section className="mx-auto grid min-h-[calc(100vh-14rem)] max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_540px] lg:px-8">
        {/* Esquerda */}
        <div className="animate-fade-up" style={{ animationDelay: "80ms" }}>
          <h1 className="font-display text-6xl font-black leading-none sm:text-7xl lg:text-8xl">
            {t.home.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl">
            {t.home.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="hero" size="lg" asChild>
              <Link to="/classificacao">
                <Trophy className="h-5 w-5" />
                {language === "pt" ? "Ver classificação" : "View standings"}
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/pilotos">
                {language === "pt" ? "Ver pilotos" : "View drivers"}
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>

        {/* Direita: líderes */}
        <div
          className="rounded-2xl border border-border bg-card/80 p-6 shadow-card animate-fade-up"
          style={{ animationDelay: "180ms" }}
        >
          <h2 className="mb-5 flex items-center gap-2 font-display text-2xl font-bold">
            <Trophy className="text-primary" />
            {t.home.leaders}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Líder pilotos */}
            <div
              className="overflow-hidden rounded-xl border border-border"
              style={{
                background: leaderTeam
                  ? `linear-gradient(160deg, hsl(${leaderTeam.primary} / 0.2), #18181b 70%)`
                  : undefined,
              }}
            >
              <div className="relative h-52 w-full overflow-hidden">
                {driverFaceSrc && (
                  <img
                    src={driverFaceSrc}
                    alt={leaderName}
                    className="absolute bottom-0 left-1/2 h-full w-auto -translate-x-1/2 object-contain object-bottom"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {t.home.driverLeader}
                </p>
                <p className="mt-0.5 font-display text-xl font-black leading-tight">{leaderName}</p>
                <p
                  className="mt-1 text-lg font-bold"
                  style={{ color: leaderTeam ? `hsl(${leaderTeam.primary})` : undefined }}
                >
                  {leaderPoints} {t.common.points}
                </p>
              </div>
            </div>

            {/* Líder construtores */}
            <div
              className="overflow-hidden rounded-xl border border-border"
              style={{
                background: constructorTeam
                  ? `linear-gradient(160deg, hsl(${constructorTeam.primary} / 0.2), #18181b 70%)`
                  : undefined,
              }}
            >
              <div
                className="flex h-52 w-full items-center justify-center p-8"
                style={{
                  background: constructorTeam
                    ? `linear-gradient(135deg, hsl(${constructorTeam.primary}/0.12), transparent)`
                    : undefined,
                }}
              >
                {constructorLogo && (
                  <img
                    src={constructorLogo}
                    alt={constructorName}
                    className="max-h-28 w-auto object-contain drop-shadow-lg"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {t.home.constructorLeader}
                </p>
                <p className="mt-0.5 font-display text-xl font-black leading-tight">
                  {constructorName}
                </p>
                <p
                  className="mt-1 text-lg font-bold"
                  style={{
                    color: constructorTeam ? `hsl(${constructorTeam.primary})` : undefined,
                  }}
                >
                  {constructorPoints} {t.common.points}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Último resultado */}
      {lastRace && (
        <section
          className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-up"
          style={{ animationDelay: "220ms" }}
        >
          <div className="mb-4 flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-black flex items-center gap-2">
              <Flag className="h-6 w-6 text-primary" />
              {language === "pt" ? "Último resultado" : "Last result"}
              <span className="text-lg font-normal text-muted-foreground ml-2">
                {lastRace.raceName}
              </span>
            </h2>
            <Button variant="link" asChild>
              <Link to="/classificacao">
                {language === "pt" ? "Ver classificação" : "Full standings"}
                <ArrowRight />
              </Link>
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px] text-left text-sm">
                <thead className="bg-muted text-xs text-muted-foreground">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">{language === "pt" ? "Piloto" : "Driver"}</th>
                    <th className="p-3">{language === "pt" ? "Equipe" : "Team"}</th>
                    <th className="p-3">PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {lastRace.results.slice(0, 5).map((result) => {
                    const localDriver = drivers.find((d) => d.id === result.driverId);
                    const team = teamById(result.teamId);
                    return (
                      <tr
                        key={result.driverId}
                        className="border-t border-border hover:bg-accent transition-grid-theme"
                      >
                        <td className="p-3 font-black">{result.position}</td>
                        <td className="p-3 font-semibold">
                          {localDriver ? (
                            <Link
                              to={`/pilotos/${localDriver.id}`}
                              className="hover:underline underline-offset-4"
                            >
                              {result.driverName}
                            </Link>
                          ) : (
                            result.driverName
                          )}
                          {result.fastestLap && (
                            <span className="ml-2 text-xs text-purple-400">⚡ {result.fastestLap}</span>
                          )}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          <span
                            className="inline-block h-2 w-2 rounded-full mr-1"
                            style={{ backgroundColor: team ? `hsl(${team.primary})` : "#666" }}
                          />
                          {team?.name ?? result.teamId}
                        </td>
                        <td className="p-3 font-bold text-primary">{result.points}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Últimas notícias */}
      <section
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-fade-up"
        style={{ animationDelay: "260ms" }}
      >
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-4xl font-black">{t.home.latest}</h2>
          <Button variant="link" asChild>
            <Link to="/noticias">
              {t.common.readMore}
              <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {news.slice(0, 3).map((item, i) => (
            <div
              key={item.id}
              className="animate-fade-up"
              style={{ animationDelay: `${320 + i * 80}ms` }}
            >
              <NewsCard item={item} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
