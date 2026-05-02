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

  const driverLeader = standings.drivers[0];
  const leaderDriver = drivers.find((d) => d.id === driverLeader.driverId)!;
  const leaderTeam = teamById(leaderDriver.teamId);

  const constructorLeader = standings.constructors[0];
  const constructorTeam = teamById(constructorLeader.teamId);

  const driverFaceSrc = `/images/drivers/face/${leaderDriver.id}.webp`;
  const carSrc = `/images/teams/cars/${constructorTeam.id}.avif`;

  return (
    <div>
      {/* ── Countdown centralizado no topo ── */}
      <section className="border-b border-border bg-card/60 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            {t.home.nextRace}
          </p>
          <Countdown race={nextRace} centered />
        </div>
      </section>

      {/* ── Hero: título + líderes ── */}
      <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">

        {/* Coluna esquerda: texto + botões */}
        <div>
          <p className="mb-4 inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
            {t.home.kicker}
          </p>
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

        {/* Coluna direita: líderes com fotos */}
        <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-card">
          <h2 className="mb-5 flex items-center gap-2 font-display text-2xl font-bold">
            <Trophy className="text-primary" />
            {t.home.leaders}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Líder de pilotos */}
            <div
              className="relative overflow-hidden rounded-xl border border-border"
              style={{ background: `linear-gradient(160deg, hsl(${leaderTeam.primary} / 0.2), #18181b 70%)` }}
            >
              {/* Foto do rosto */}
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={driverFaceSrc}
                  alt={leaderDriver.name}
                  className="absolute bottom-0 left-1/2 h-full w-auto -translate-x-1/2 object-cover object-top"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
                {/* gradiente na base */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>
              {/* Info */}
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

            {/* Líder de construtores */}
            <div
              className="relative overflow-hidden rounded-xl border border-border"
              style={{ background: `linear-gradient(160deg, hsl(${constructorTeam.primary} / 0.2), #18181b 70%)` }}
            >
              {/* Foto do carro */}
              <div className="relative h-44 w-full overflow-hidden flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, hsl(${constructorTeam.primary}/0.15), #18181b)` }}
              >
                <img
                  src={carSrc}
                  alt={constructorTeam.name}
                  className="h-full w-full object-contain px-3 py-2"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              </div>
              {/* Info */}
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
