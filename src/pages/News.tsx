import { useState } from "react";
import { NewsCard } from "@/components/grid/Cards";
import { Button } from "@/components/ui/button";
import { useGrid } from "@/context/GridContext";
import { news } from "@/lib/gridData";

export default function News() {
  const { t } = useGrid();
  const [category, setCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(news.map((item) => item.category)))];
  const filtered = category === "All" ? news : news.filter((item) => item.category === category);
  return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><h1 className="font-display text-5xl font-black">{t.news.title}</h1><p className="mt-3 text-muted-foreground">{t.news.subtitle}</p><div className="my-8 flex flex-wrap gap-2">{categories.map((item) => <Button key={item} variant={category === item ? "hero" : "soft"} onClick={() => setCategory(item)}>{item === "All" ? t.common.all : item}</Button>)}</div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filtered.map((item) => <NewsCard key={item.id} item={item} />)}</div></section>;
}
