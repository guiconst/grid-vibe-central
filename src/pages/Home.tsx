import { Link } from "react-router-dom";
import { ArrowRight, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/grid/Countdown";
import { NewsCard } from "@/components/grid/Cards";
import { useGrid } from "@/context/GridContext";
import { calendar, drivers, news, standings, teamById } from "@/lib/gridData";

export default function Home() {
  const { t, language, favoriteTeam, setThemeTeam } = useGrid();
  const nextRace = calendar.find((r) => r.status === "next") || calendar[0];

  const driverLeader    = standings.drivers[0];
  const leaderDriver    = drivers.find((d) => d.id === driverLeader.driverId)!;
  const leaderTeam      = teamById(leaderDriver.teamId);
  const constructorLeader = standings.constructors[0];
  const constructorTeam   = teamById(constructorLeader.teamId);

  const driverFaceSrc   = `/images/drivers/face/${leaderDriver.id}.webp`;
  const constructorLogo = `/images/teams/logos/${constructorTeam.id}.png`;

  return (
    <div>
      {/* ── Countdown — topo, sem divisória, compacto ── */}
      <section className="mx-auto max-w-3xl px-4 pt-8 pb-2 text-center sm:px-6 lg:px-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
          {t.home.nextRace}
        </p>
        <Countdown race={nextRace} centered compact />
      </section>

      {/* ── Hero: título + líderes ── */}
      <section className="mx-auto grid min-h-[calc(100vh-14rem)] max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_540px] lg:px-8">

        {/* Esquerda: texto + botões */}
        <div>
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
        <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-card">
          <h2 className="mb-5 flex items-center gap-2 font-display text-2xl font-bold">
            <Trophy className="text-primary" />
            {t.home.leaders}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">

            {/* Líder pilotos */}
            <div
              className="overflow-hidden rounded-xl border border-border"
              style={{ background: `linear-gradient(160deg, hsl(${leaderTeam.primary} / 0.2), #18181b 70%)` }}
            >
              {/* Foto — usando a imagem completa posicionada de baixo pra cima */}
              <div className="relative h-52 w-full overflow-hidden">
                <img
                  src={driverFaceSrc}
                  alt={leaderDriver.name}
                  className="absolute bottom-0 left-1/2 h-full w-auto -translate-x-1/2 object-contain object-bottom"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {t.home.driverLeader}
                </p>
                <p className="mt-0.5 font-display text-xl font-black leading-tight">{leaderDriver.name}</p>
                <p className="mt-1 text-lg font-bold" style={{ color: `hsl(${leaderTeam.primary})` }}>
                  {driverLeader.points} {t.common.points}
                </p>
              </div>
            </div>

            {/* Líder construtores — logo centralizado */}
            <div
              className="overflow-hidden rounded-xl border border-border"
              style={{ background: `linear-gradient(160deg, hsl(${constructorTeam.primary} / 0.2), #18181b 70%)` }}
            >
              <div
                className="flex h-52 w-full items-center justify-center p-8"
                style={{ background: `linear-gradient(135deg, hsl(${constructorTeam.primary}/0.12), transparent)` }}
              >
                <img
                  src={constructorLogo}
                  alt={constructorTeam.name}
                  className="max-h-28 w-auto object-contain drop-shadow-lg"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {t.home.constructorLeader}
                </p>
                <p className="mt-0.5 font-display text-xl font-black leading-tight">{constructorTeam.name}</p>
                <p className="mt-1 text-lg font-bold" style={{ color: `hsl(${constructorTeam.primary})` }}>
                  {constructorLeader.points} {t.common.points}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Últimas notícias ── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-4xl font-black">{t.home.latest}</h2>
          <Button variant="link" asChild>
            <Link to="/noticias">{t.common.readMore}<ArrowRight /></Link>
          </Button>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {news.slice(0, 3).map((item) => <NewsCard key={item.id} item={item} />)}
        </div>
      </section>
    </div>
  );
}
