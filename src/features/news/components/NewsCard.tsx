import { useGrid } from "@/shared/context/GridContext";
import { teamById, type NewsItem } from "@/lib/entities";

export function NewsCard({ item }: { item: NewsItem }) {
  const { language } = useGrid();
  const team = teamById(item.teamId);
  const imageSrc = (item as any).image ? `/images/news/${(item as any).image}` : null;

  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-card shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-[0_24px_60px_-20px_hsl(var(--team-primary)/0.45)]">
      {/* Capa: foto real ou gradiente fallback */}
      <div className="relative h-44 overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={item.title[language]}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-[linear-gradient(135deg,hsl(var(--team-primary)/0.22),hsl(var(--muted)))]" />
        )}
        {/* Gradiente escuro na base para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Tag de equipe sobre a imagem */}
        <span
          className="absolute bottom-3 left-3 rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
          style={{ background: `hsl(${team.primary} / 0.85)` }}
        >
          {team.name}
        </span>
      </div>

      <div className="p-5">
        <div className="mb-2 text-xs text-muted-foreground">
          {new Date(`${item.date}T12:00:00`).toLocaleDateString(language === "pt" ? "pt-BR" : "en-GB")}
        </div>
        <h3 className="min-h-12 font-display text-xl font-bold leading-tight">{item.title[language]}</h3>
        <p className="mt-3 text-sm text-muted-foreground">{item.excerpt[language]}</p>
      </div>
    </article>
  );
}
