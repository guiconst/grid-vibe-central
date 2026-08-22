import { NewsCard } from "@/features/news/components/NewsCard";
import { useGrid } from "@/shared/context/GridContext";
import { news } from "@/lib/entities";

export default function News() {
  const { t } = useGrid();
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl font-black animate-fade-up">{t.news.title}</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {news.map((item, i) => (
          <div key={item.id} className="animate-fade-up" style={{ animationDelay: `${100 + i * 100}ms` }}>
            <NewsCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
