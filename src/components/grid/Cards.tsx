import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGrid } from "@/context/GridContext";
import { Driver, NewsItem, Team, teamById } from "@/lib/gridData";

export function NewsCard({ item }: { item: NewsItem }) {
  const { language } = useGrid();
  const team = teamById(item.teamId);
  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-card shadow-card transition-grid-theme hover:-translate-y-1 hover:border-primary/50">
      <div className="h-32 bg-[linear-gradient(135deg,hsl(var(--team-primary)/0.22),hsl(var(--muted)))] p-4">
        <span className="rounded-full bg-primary px-3 py-1 text-xs font-black text-primary-foreground">{item.category}</span>
      </div>
      <div className="p-5">
        <div className="mb-2 text-xs text-muted-foreground">{new Date(`${item.date}T12:00:00`).toLocaleDateString(language === "pt" ? "pt-BR" : "en-GB")} · {team.name}</div>
        <h3 className="min-h-16 font-display text-xl font-bold leading-tight">{item.title[language]}</h3>
        <p className="mt-3 text-sm text-muted-foreground">{item.excerpt[language]}</p>
      </div>
    </article>
  );
}

export function TeamCard({ team, onActivate }: { team: Team; onActivate?: () => void }) {
  const { t } = useGrid();
  return (
    <Link to={`/equipes/${team.id}`} onClick={onActivate} className="group rounded-lg border border-border bg-card p-5 shadow-card transition-grid-theme hover:-translate-y-1 hover:border-primary/50">
      <span className="mb-5 block h-2 rounded-full" style={{ background: `linear-gradient(90deg, hsl(${team.primary}), hsl(${team.secondary}))` }} />
      <div className="text-3xl">{team.country}</div>
      <h3 className="mt-3 font-display text-2xl font-black">{team.name}</h3>
      <p className="mt-1 min-h-10 text-sm text-muted-foreground">{team.fullName}</p>
      <div className="mt-5 flex items-center justify-between text-sm"><span>{team.championships} {t.teams.championships}</span><ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" /></div>
    </Link>
  );
}

export function DriverCard({ driver, team, onActivate }: { driver: Driver; team: Team; onActivate?: () => void }) {
  const { t, language } = useGrid();
  return (
    <Link to={`/pilotos/${driver.id}`} onClick={onActivate} className="group rounded-lg border border-border bg-card p-5 shadow-card transition-grid-theme hover:-translate-y-1 hover:border-primary/50">
      <div className="flex items-start justify-between">
        <div className="grid h-20 w-20 place-items-center rounded-lg bg-muted font-display text-3xl font-black" style={{ color: `hsl(${team.primary})` }}>#{driver.number}</div>
        <span className="text-3xl">{driver.flag}</span>
      </div>
      <h3 className="mt-5 font-display text-2xl font-black leading-tight">{driver.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{team.name} · {driver.nationality[language]}</p>
      <Button variant="link" className="mt-4 h-auto p-0">{t.common.readMore}<ArrowRight /></Button>
    </Link>
  );
}

export function StatPill({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-lg border border-border bg-muted/60 p-4"><div className="font-display text-2xl font-black">{value}</div><div className="text-sm text-muted-foreground">{label}</div></div>;
}
