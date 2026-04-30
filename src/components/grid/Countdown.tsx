import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { useGrid } from "@/context/GridContext";
import { Race, formatRaceDate } from "@/lib/gridData";

function diffTo(date: string) {
  const target = new Date(`${date}T15:00:00`).getTime();
  const diff = Math.max(0, target - Date.now());
  return { days: Math.floor(diff / 86400000), hours: Math.floor((diff / 3600000) % 24), minutes: Math.floor((diff / 60000) % 60), seconds: Math.floor((diff / 1000) % 60) };
}

export function Countdown({ race }: { race: Race }) {
  const { t, language } = useGrid();
  const [time, setTime] = useState(() => diffTo(race.date));
  useEffect(() => {
    const interval = window.setInterval(() => setTime(diffTo(race.date)), 1000);
    return () => window.clearInterval(interval);
  }, [race.date]);
  const parts = [[time.days, t.common.days], [time.hours, t.common.hours], [time.minutes, t.common.minutes], [time.seconds, t.common.seconds]];
  return (
    <section className="rounded-lg border border-primary/30 bg-card/80 p-5 shadow-card backdrop-blur">
      <div className="mb-4 flex items-center gap-3 text-primary"><CalendarClock /><span className="font-semibold">{race.name[language]} · {formatRaceDate(race.date, language)}</span></div>
      <div className="grid grid-cols-4 gap-2">
        {parts.map(([value, label]) => (
          <div key={label} className="rounded-md bg-muted p-3 text-center">
            <div className="font-display text-2xl font-black sm:text-4xl">{String(value).padStart(2, "0")}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
