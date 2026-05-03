import { Info } from "lucide-react";
import { useGrid } from "@/context/GridContext";

export default function About() {
  const { t } = useGrid();
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-border bg-card p-8 shadow-card">
        <Info className="mb-5 h-10 w-10 text-primary" />
        <h1 className="font-display text-4xl font-black sm:text-5xl">{t.about.title}</h1>

        <div className="mt-8 flex flex-col gap-5 text-muted-foreground leading-relaxed">
          <p>{t.about.p1}</p>
          <p>{t.about.p2}</p>
          <p>{t.about.p3}</p>
          <p>{t.about.p4}</p>
        </div>

        <h2 className="mt-10 font-display text-2xl font-bold text-foreground">{t.about.credits}</h2>
        <p className="mt-3 text-sm text-muted-foreground">{t.about.creditsText}</p>
      </div>
    </section>
  );
}
