/**
 * Indicador de status da API — só aparece quando está buscando dados
 * ou quando TODAS as queries falharam (não só uma).
 */
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { RefreshCw, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function ApiStatus() {
  const isFetching = useIsFetching({ queryKey: ["f1"] });
  const qc = useQueryClient();

  // Só considera erro se standings E calendar falharam
  const driverState = qc.getQueryState(["f1", "driver-standings"]);
  const calendarState = qc.getQueryState(["f1", "calendar"]);
  const isError =
    driverState?.status === "error" && calendarState?.status === "error";

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
