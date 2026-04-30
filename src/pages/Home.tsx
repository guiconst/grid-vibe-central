import { Link } from "react-router-dom";
import { ArrowRight, Flag, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/grid/Countdown";
import { NewsCard, TeamCard } from "@/components/grid/Cards";
import { useGrid } from "@/context/GridContext";
import { calendar, drivers, news, standings, teamById } from "@/lib/gridData";

export default function Home() {
  const { t, language, favoriteTeam, setThemeTeam } = useGrid();
  const nextRace = calendar.find((race) => race.status === "next") || calendar[0];
  const driverLeader = standings.drivers[0];
  const driver = drivers.find((item) => item.id === driverLeader.driverId)!;
  const constructorLeader = standings.constructors[0];
  const constructorTeam = teamById(constructorLeader.teamId);

  return (
    <div>
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">{t.home.kicker}</p>
          <h1 className="font-display text-6xl font-black leading-none sm:text-7xl lg:text-8xl">{t.home.title}</h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">{t.home.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="hero" size="lg" asChild><Link to="/calendario"><Flag />{t.nav.calendar}</Link></Button>
            <Button variant="outline" size="lg" asChild><Link to="/classificacao">{t.nav.standings}<ArrowRight /></Link></Button>
          </div>
        </div>
        <div className="space-y-5">
          <h2 className="font-display text-2xl font-bold">{t.home.nextRace}</h2>
          <Countdown race={nextRace} />
          <section className="rounded-lg border border-border bg-card/80 p-5 shadow-card">
            <h2 className="mb-4 flex items-center gap-2 font-display text-2xl font-bold"><Trophy className="text-primary" />{t.home.leaders}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-md bg-muted p-4"><p className="text-sm text-muted-foreground">{t.home.driverLeader}</p><strong className="text-xl">{driver.name}</strong><p className="text-primary">{driverLeader.points} {t.common.points}</p></div>
              <div className="rounded-md bg-muted p-4"><p className="text-sm text-muted-foreground">{t.home.constructorLeader}</p><strong className="text-xl">{constructorTeam.name}</strong><p className="text-primary">{constructorLeader.points} {t.common.points}</p></div>
            </div>
          </section>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4"><h2 className="font-display text-4xl font-black">{t.home.latest}</h2><Button variant="link" asChild><Link to="/noticias">{t.common.readMore}<ArrowRight /></Link></Button></div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{news.slice(0, 3).map((item) => <NewsCard key={item.id} item={item} />)}</div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="mb-6 font-display text-4xl font-black">{t.home.featured}</h2>
        <div className="grid gap-6 lg:grid-cols-[0.45fr_1fr]">
          <TeamCard team={favoriteTeam} onActivate={() => setThemeTeam(favoriteTeam.id)} />
          <div className="rounded-lg border border-border bg-card p-6 shadow-card"><h3 className="font-display text-3xl font-black">{favoriteTeam.fullName}</h3><p className="mt-4 text-muted-foreground">{favoriteTeam.history[language]}</p><div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="rounded-md bg-muted p-4">{favoriteTeam.car}<span className="block text-xs text-muted-foreground">{t.teams.car}</span></div><div className="rounded-md bg-muted p-4">{favoriteTeam.base}<span className="block text-xs text-muted-foreground">{t.teams.base}</span></div><div className="rounded-md bg-muted p-4">{favoriteTeam.championships}<span className="block text-xs text-muted-foreground">{t.teams.championships}</span></div></div></div>
        </div>
      </section>
    </div>
  );
}
