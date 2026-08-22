import { Countdown } from "@/features/calendar/components/Countdown";
import { useGrid } from "@/shared/context/GridContext";
import { formatRaceDate } from "@/lib/entities";
import { useCalendar } from "@/shared/hooks/useF1Data";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";

// Map country name → flag emoji (Ergast returns country names, not flags)
const COUNTRY_FLAGS: Record<string, string> = {
  Australia: "🇦🇺",
  China: "🇨🇳",
  Japan: "🇯🇵",
  USA: "🇺🇸",
  "United States": "🇺🇸",
  Canada: "🇨🇦",
  Monaco: "🇲🇨",
  Spain: "🇪🇸",
  Austria: "🇦🇹",
  UK: "🇬🇧",
  "United Kingdom": "🇬🇧",
  Belgium: "🇧🇪",
  Hungary: "🇭🇺",
  Netherlands: "🇳🇱",
  Italy: "🇮🇹",
  Azerbaijan: "🇦🇿",
  Singapore: "🇸🇬",
  Mexico: "🇲🇽",
  Brazil: "🇧🇷",
  Qatar: "🇶🇦",
  "Abu Dhabi": "🇦🇪",
  UAE: "🇦🇪",
  Bahrain: "🇧🇭",
  "Saudi Arabia": "🇸🇦",
  France: "🇫🇷",
  Germany: "🇩🇪",
  Portugal: "🇵🇹",
  Russia: "🇷🇺",
  Turkey: "🇹🇷",
  Vietnam: "🇻🇳",
};

function getFlag(country?: string) {
  if (!country) return "🏁";
  return COUNTRY_FLAGS[country] ?? "🏁";
}

export default function Calendar() {
  const { t, language } = useGrid();
  const { data: calendar, isLoading, dataUpdatedAt } = useCalendar();

  const races = calendar ?? [];
  const nextRace = races.find((r: any) => r.status === "next") || races[0];

  const lastUpdatedStr = dataUpdatedAt
    ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(
        new Date(dataUpdatedAt)
      )
    : null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Título */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 justify-center">
          <h1 className="font-display text-5xl font-black">{t.calendar.title}</h1>
          {isLoading && <RefreshCw className="h-5 w-5 animate-spin text-primary" />}
        </div>
        <p className="mt-2 text-muted-foreground">{t.calendar.subtitle}</p>
        {lastUpdatedStr && (
          <p className="mt-1 text-xs text-muted-foreground">
            Dados via API Ergast · {lastUpdatedStr}
          </p>
        )}
      </div>

      {/* Countdown */}
      {nextRace && (
        <div className="mx-auto mt-10 max-w-xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            {language === "pt"
              ? `Contagem regressiva para o ${nextRace.name?.["pt"] ?? nextRace.name} — ${formatRaceDate(nextRace.date, language)}`
              : `Countdown to the ${nextRace.name?.["en"] ?? nextRace.name} — ${formatRaceDate(nextRace.date, language)}`}
          </p>
          <Countdown race={nextRace} />
        </div>
      )}

      {/* Grade de corridas */}
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {races.map((race: any) => {
          const raceName =
            typeof race.name === "string"
              ? race.name
              : race.name?.[language] ?? race.name?.["pt"] ?? "";
          const flag = race.flag ?? getFlag(race.country);

          return (
            <article
              key={race.id ?? race.circuit}
              className={cn(
                "rounded-lg border border-border bg-card p-5 shadow-card",
                race.status === "next" && "border-primary bg-accent"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-primary">
                    {race.round && (
                      <span className="mr-2 text-muted-foreground font-normal">R{race.round}</span>
                    )}
                    {race.status === "completed"
                      ? t.common.completed
                      : race.status === "next"
                      ? t.common.next
                      : t.common.upcoming}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-black">{raceName}</h2>
                </div>
                <span className="text-3xl">{flag}</span>
              </div>
              <p className="mt-4 text-muted-foreground">{race.circuit}</p>
              {race.locality && race.country && (
                <p className="text-xs text-muted-foreground">
                  {race.locality}, {race.country}
                </p>
              )}
              <p className="mt-2 font-semibold">{formatRaceDate(race.date, language)}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
