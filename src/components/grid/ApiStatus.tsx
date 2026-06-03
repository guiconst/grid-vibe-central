/**
 * Pequeno indicador discreto de status da API — aparece no canto
 * quando os dados estão sendo carregados ou quando há erro.
 */
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { RefreshCw, WifiOff } from "lucide-react";
import { useDriverStandings } from "@/hooks/useF1Data";
import { cn } from "@/lib/utils";

export function ApiStatus() {
  const isFetching = useIsFetching();
  const { isError } = useDriverStandings();

  if (!isFetching && !isError) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold shadow-lg",
        isError
          ? "bg-destructive/90 text-destructive-foreground"
          : "bg-primary/90 text-primary-foreground"
      )}
    >
      {isError ? (
        <>
          <WifiOff className="h-3 w-3" />
          Usando dados locais
        </>
      ) : (
        <>
          <RefreshCw className="h-3 w-3 animate-spin" />
          Atualizando...
        </>
      )}
    </div>
  );
}
