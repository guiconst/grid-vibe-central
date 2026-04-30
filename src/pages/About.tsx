import { Info } from "lucide-react";
import { useGrid } from "@/context/GridContext";

export default function About() {
  const { t } = useGrid();
  return <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8"><div className="rounded-lg border border-border bg-card p-8 shadow-card"><Info className="mb-5 h-10 w-10 text-primary" /><h1 className="font-display text-5xl font-black">{t.about.title}</h1><p className="mt-5 text-xl text-muted-foreground">{t.about.subtitle}</p><p className="mt-8 text-muted-foreground">{t.about.project}</p><h2 className="mt-10 font-display text-3xl font-bold">{t.about.credits}</h2><p className="mt-3 text-muted-foreground">{t.about.creditsText}</p></div></section>;
}
