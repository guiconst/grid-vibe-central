import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGrid } from "@/shared/context/GridContext";
import type { Driver, Team } from "@/lib/types";

export function DriverCard({ driver, team, onActivate }: { driver: Driver; team: Team; onActivate?: () => void }) {
  const { t } = useGrid();
  const faceSrc = `/images/drivers/face/${driver.id}.webp`;

  return (
    <Link
      to={`/pilotos/${driver.id}`}
      onClick={onActivate}
      className="group flex flex-col rounded-lg border border-border bg-card p-5 shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-[0_24px_60px_-20px_hsl(var(--team-primary)/0.45)]"
    >
      <div className="flex items-center gap-3">
        <div
          className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-border"
          style={{ background: `linear-gradient(160deg, hsl(${team.primary} / 0.25) 0%, hsl(${team.primary} / 0.05) 100%)` }}
        >
          <img
            src={faceSrc}
            alt={driver.name}
            className="absolute bottom-0 left-1/2 h-full w-auto -translate-x-1/2 object-cover object-top"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        </div>
        <span className="font-display text-3xl font-black leading-none" style={{ color: `hsl(${team.primary})` }}>
          #{driver.number}
        </span>
      </div>
      <h3 className="mt-4 font-display text-2xl font-black leading-tight">{driver.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{team.name}</p>
      <Button variant="link" className="mt-4 h-auto p-0">{t.common.readMore}<ArrowRight /></Button>
    </Link>
  );
}
