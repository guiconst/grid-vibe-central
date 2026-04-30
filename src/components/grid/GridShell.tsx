import { Menu, X, Languages } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useGrid } from "@/context/GridContext";
import { cn } from "@/lib/utils";

const navItems = [
  ["/", "home"],
  ["/noticias", "news"],
  ["/pilotos", "drivers"],
  ["/equipes", "teams"],
  ["/calendario", "calendar"],
  ["/classificacao", "standings"],
  ["/sobre", "about"],
] as const;

export function GridShell() {
  const { t, language, setLanguage, teams, saveFavoriteTeam, showFavoriteModal, setShowFavoriteModal, activeTeam, favoriteTeam } = useGrid();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground transition-grid-theme">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--team-primary)/0.26),transparent_32rem),linear-gradient(120deg,hsl(var(--team-secondary)/0.10),transparent_32%)]" />
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/82 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <NavLink to="/" className="group flex items-center gap-2 sm:gap-3" onClick={() => setMenuOpen(false)}>
            <img
              src="/images/logo.png"
              alt="Central do Grid"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg object-contain bg-primary p-1 shadow-glow transition-transform group-hover:-translate-y-0.5"
            />
            <span className="font-display text-base sm:text-lg font-black tracking-wide leading-tight">Central do Grid</span>
          </NavLink>
          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map(([href, key]) => (
              <NavLink key={href} to={href} className={({ isActive }) => cn("rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition-grid-theme hover:bg-accent hover:text-foreground", isActive && "bg-accent text-foreground") }>
                {t.nav[key]}
              </NavLink>
            ))}
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <Button variant="soft" size="sm" onClick={() => setShowFavoriteModal(true)}>{favoriteTeam.name}</Button>
            <Button variant="ghost" size="sm" onClick={() => setLanguage(language === "pt" ? "en" : "pt")}><Languages className="h-4 w-4" /> {language === "pt" ? "EN-US" : "PT-BR"}</Button>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label="Menu">
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </nav>
        {menuOpen && (
          <div className="border-t border-border bg-card px-4 py-4 lg:hidden">
            <div className="grid gap-2">
              {navItems.map(([href, key]) => (
                <NavLink key={href} to={href} onClick={() => setMenuOpen(false)} className={({ isActive }) => cn("rounded-md border border-transparent px-3 py-3 font-semibold text-muted-foreground", isActive && "border-primary/40 bg-accent text-foreground") }>
                  {t.nav[key]}
                </NavLink>
              ))}
              <div className="mt-2 flex gap-2">
                <Button variant="soft" className="flex-1" onClick={() => setShowFavoriteModal(true)}>{favoriteTeam.name}</Button>
                <Button variant="outline" onClick={() => setLanguage(language === "pt" ? "en" : "pt")}>{language === "pt" ? "EN-US" : "PT-BR"}</Button>
              </div>
            </div>
          </div>
        )}
      </header>
      <main key={location.pathname} className="relative z-10 animate-route-in">
        <Outlet />
      </main>
      <footer className="relative z-10 border-t border-border/70 bg-card/60 px-4 py-8 text-sm text-muted-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <strong className="font-display text-foreground">{t.footer.brand}</strong>
          <span>{t.footer.disclaimer}</span>
        </div>
      </footer>
      <Dialog open={showFavoriteModal} onOpenChange={setShowFavoriteModal}>
        <DialogContent className="border-border bg-card text-card-foreground w-[calc(100vw-2rem)] max-w-2xl rounded-xl p-0 gap-0 overflow-hidden flex flex-col max-h-[90vh]">
          <DialogHeader className="px-5 pt-5 pb-4 border-b border-border shrink-0">
            <DialogTitle className="font-display text-2xl sm:text-3xl">{t.modal.title}</DialogTitle>
            <DialogDescription className="text-sm">{t.modal.subtitle}</DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {teams.map((team) => (
                <button key={team.id} onClick={() => saveFavoriteTeam(team.id)} className={cn("group rounded-lg border border-border bg-muted/50 p-4 text-left transition-grid-theme hover:-translate-y-1 hover:border-primary active:scale-95", activeTeam.id === team.id && "border-primary bg-accent") }>
                  <span className="mb-3 block h-2 rounded-full" style={{ background: `linear-gradient(90deg, hsl(${team.primary}), hsl(${team.secondary}))` }} />
                  <span className="block font-display text-lg sm:text-xl font-bold">{team.name}</span>
                  <span className="text-sm text-muted-foreground">{team.fullName}</span>
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
