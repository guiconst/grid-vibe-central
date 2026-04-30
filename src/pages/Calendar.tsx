import { Countdown } from "@/components/grid/Countdown";
import { useGrid } from "@/context/GridContext";
import { calendar, formatRaceDate } from "@/lib/gridData";
import { cn } from "@/lib/utils";

export default function Calendar() {
  const { t, language } = useGrid();
  const nextRace = calendar.find((race) => race.status === "next") || calendar[0];
  return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><h1 className="font-display text-5xl font-black">{t.calendar.title}</h1><p className="mt-3 text-muted-foreground">{t.calendar.subtitle}</p><div className="mt-8 max-w-3xl"><Countdown race={nextRace} /></div><div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{calendar.map((race) => <article key={race.id} className={cn("rounded-lg border border-border bg-card p-5 shadow-card", race.status === "next" && "border-primary bg-accent") }><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-bold text-primary">{race.status === "completed" ? t.common.completed : race.status === "next" ? t.common.next : t.common.upcoming}</p><h2 className="mt-2 font-display text-2xl font-black">{race.name[language]}</h2></div><span className="text-3xl">{race.flag}</span></div><p className="mt-4 text-muted-foreground">{race.circuit}</p><p className="mt-2 font-semibold">{formatRaceDate(race.date, language)}</p></article>)}</div></section>;
}
