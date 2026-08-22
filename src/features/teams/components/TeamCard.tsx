import { Link } from "react-router-dom";
import type { Team } from "@/lib/types";

export function TeamCard({ team }: { team: Team }) {
  const primaryColor = `hsl(${team.primary})`;
  const secondaryColor = `hsl(${team.secondary})`;
  return (
    <Link
      to={`/equipes/${team.id}`}
      className="group relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 transition-all duration-300 hover:scale-105 hover:border-transparent"
      style={
        {
          "--team-glow": primaryColor,
        } as React.CSSProperties
      }
    >
      {/* Glow background on hover */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at center, ${primaryColor}33 0%, ${primaryColor}11 50%, transparent 70%)`,
          boxShadow: `inset 0 0 40px ${primaryColor}22`,
        }}
      />
      {/* Border glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow: `0 0 20px ${primaryColor}66, 0 0 40px ${primaryColor}33`,
          border: `1px solid ${primaryColor}88`,
        }}
      />
      {/* Color bar top */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }}
      />
      {/* Logo */}
      <div className="relative z-10 flex h-3/5 w-3/5 items-center justify-center p-3">
        <img
          src={`/images/teams/logos/${team.id}.png`}
          alt={team.name}
          className="h-full w-full object-contain transition-all duration-300 group-hover:drop-shadow-lg"
          style={{ filter: "drop-shadow(0 0 0px transparent)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLImageElement).style.filter = `drop-shadow(0 0 8px ${primaryColor})`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLImageElement).style.filter = "drop-shadow(0 0 0px transparent)";
          }}
        />
      </div>
      {/* Team name */}
      <p className="relative z-10 mt-2 text-center text-sm font-bold text-white/60 transition-colors duration-300 group-hover:text-white">
        {team.name}
      </p>
    </Link>
  );
}
