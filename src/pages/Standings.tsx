import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGrid } from "@/context/GridContext";
import { drivers, teamById } from "@/lib/gridData";
import { useStandings } from "@/hooks/useF1Data";
import { RefreshCw } from "lucide-react";

export default function Standings() {
  const { t } = useGrid();
  const { drivers: driverRows, constructors: constructorRows, isLoading, lastUpdated } = useStandings();

  const lastUpdatedStr = lastUpdated
    ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(
        new Date(lastUpdated)
      )
    : null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center gap-3 mb-2">
        <h1 className="text-center font-display text-4xl font-black sm:text-5xl">
          {t.standings.title}
        </h1>
        {isLoading && (
          <RefreshCw className="h-5 w-5 animate-spin text-primary" />
        )}
      </div>
      {lastUpdatedStr && (
        <p className="text-center text-xs text-muted-foreground mb-6">
          Atualizado via API Ergast · {lastUpdatedStr}
        </p>
      )}

      <Tabs defaultValue="drivers" className="mt-4">
        <div className="flex justify-center">
          <TabsList className="bg-muted">
            <TabsTrigger value="drivers">{t.common.drivers}</TabsTrigger>
            <TabsTrigger value="constructors">{t.common.constructors}</TabsTrigger>
          </TabsList>
        </div>

        {/* Pilotos */}
        <TabsContent value="drivers" className="mt-5 overflow-hidden rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left">
              <thead className="bg-muted text-sm text-muted-foreground">
                <tr>
                  <th className="p-3 sm:p-4">{t.standings.position}</th>
                  <th className="p-3 sm:p-4">{t.standings.name}</th>
                  <th className="p-3 sm:p-4">{t.common.team}</th>
                  <th className="p-3 sm:p-4">{t.standings.points}</th>
                  <th className="p-3 sm:p-4">{t.standings.wins}</th>
                </tr>
              </thead>
              <tbody>
                {driverRows.map((row) => {
                  // Try to find local driver data for links/colors; fall back to API name
                  const localDriver = drivers.find((d) => d.id === row.driverId);
                  const team = localDriver
                    ? teamById(localDriver.teamId)
                    : row.teamId
                    ? teamById(row.teamId)
                    : null;
                  const teamName = team
                    ? team.id === "red-bull"
                      ? "Red Bull Racing"
                      : team.name
                    : row.teamId;
                  const displayName = localDriver?.name ?? row.driverName;

                  return (
                    <tr
                      key={row.driverId}
                      className="border-t border-border transition-grid-theme hover:bg-accent"
                    >
                      <td className="p-3 sm:p-4 font-black">{row.position}</td>
                      <td className="p-3 sm:p-4 font-semibold">
                        {localDriver ? (
                          <Link
                            to={`/pilotos/${localDriver.id}`}
                            className="text-white underline-offset-4 hover:underline"
                          >
                            {displayName}
                          </Link>
                        ) : (
                          <span>{displayName}</span>
                        )}
                      </td>
                      <td className="p-3 sm:p-4">
                        {team ? (
                          <Link
                            to={`/equipes/${team.id}`}
                            className="inline-flex items-center gap-2 underline-offset-4 hover:underline"
                          >
                            <span
                              className="inline-block h-3 w-3 rounded-full"
                              style={{ backgroundColor: `hsl(${team.primary})` }}
                            />
                            {teamName}
                          </Link>
                        ) : (
                          <span>{teamName}</span>
                        )}
                      </td>
                      <td className="p-3 sm:p-4 font-bold text-primary">{row.points}</td>
                      <td className="p-3 sm:p-4">{row.wins}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Construtores */}
        <TabsContent value="constructors" className="mt-5 overflow-hidden rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[320px] text-left">
              <thead className="bg-muted text-sm text-muted-foreground">
                <tr>
                  <th className="p-3 sm:p-4">{t.standings.position}</th>
                  <th className="p-3 sm:p-4">{t.common.team}</th>
                  <th className="p-3 sm:p-4">{t.standings.points}</th>
                  <th className="p-3 sm:p-4">{t.standings.wins}</th>
                </tr>
              </thead>
              <tbody>
                {constructorRows.map((row) => {
                  const team = teamById(row.teamId);
                  const teamName =
                    team?.id === "red-bull" ? "Red Bull Racing" : team?.name ?? row.teamName;
                  return (
                    <tr
                      key={row.teamId}
                      className="border-t border-border transition-grid-theme hover:bg-accent"
                    >
                      <td className="p-3 sm:p-4 font-black">{row.position}</td>
                      <td className="p-3 sm:p-4 font-semibold">
                        {team ? (
                          <Link
                            to={`/equipes/${team.id}`}
                            className="inline-flex items-center gap-2 underline-offset-4 hover:underline"
                          >
                            <span
                              className="inline-block h-3 w-3 rounded-full"
                              style={{ backgroundColor: `hsl(${team.primary})` }}
                            />
                            {teamName}
                          </Link>
                        ) : (
                          <span>{teamName}</span>
                        )}
                      </td>
                      <td className="p-3 sm:p-4 font-bold text-primary">{row.points}</td>
                      <td className="p-3 sm:p-4">{row.wins}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
