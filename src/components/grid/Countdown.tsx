import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { useGrid } from "@/context/GridContext";
import { Race, formatRaceDate } from "@/lib/gridData";

function diffTo(date: string) {
  const target = new Date(`${date}T15:00:00`).getTime();
  const diff = Math.max(0, target - Date.now());
  return { days: Math.floor(diff / 86400000), hours: Math.floor((diff / 3600000) % 24), minutes: Math.floor((diff / 60000) % 60), seconds: Math.floor((diff / 1000) % 60) };
}

export function Countdown({ race, centered, compact }: { race: Race; centered?: boolean; compact?: boolean }) {
  const { t, language } = useGrid();
  const [time, setTime] = useState(() => diffTo(race.date));
  useEffect(() => {
    const interval = window.setInterval(() => setTime(diffTo(race.date)), 1000);
    return () => window.clearInterval(interval);
  }, [race.date]);
  const parts = [[time.days, t.common.days], [time.hours, t.common.hours], [time.minutes, t.common.minutes], [time.seconds, t.common.seconds]];
  return (
    <section className={`rounded-lg bg-card/60 backdrop-blur ${compact ? "px-4 py-3" : "border border-primary/30 p-5 shadow-card"}`}>
      <div className={`flex items-center gap-2 text-primary ${centered ? "justify-center" : ""} ${compact ? "mb-2 text-sm" : "mb-4"}`}>
        <CalendarClock className={compact ? "h-4 w-4" : "h-5 w-5"} />
        <span className={compact ? "text-sm font-medium" : "font-semibold"}>
          {race.name[language]} · {formatRaceDate(race.date, language)}
        </span>
      </div>
      <div className={`grid grid-cols-4 ${compact ? "gap-2" : "gap-3"}`}>
        {parts.map(([value, label]) => (
          <div key={label} className={`rounded-md bg-muted text-center ${compact ? "p-2" : "p-3"}`}>
            <div className={`font-display font-black ${compact ? "text-2xl sm:text-3xl" : "text-4xl sm:text-5xl"}`}>
              {String(value).padStart(2, "0")}
            </div>
            <div className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
