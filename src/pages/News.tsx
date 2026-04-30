import { NewsCard } from "@/components/grid/Cards";
import { useGrid } from "@/context/GridContext";
import { news } from "@/lib/gridData";

export default function News() {
  const { t } = useGrid();
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl font-black">{t.news.title}</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {news.map((item) => <NewsCard key={item.id} item={item} />)}
      </div>
    </section>
  );
}
