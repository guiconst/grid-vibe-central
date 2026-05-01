import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGrid } from "@/context/GridContext";
import { drivers, standings, teamById } from "@/lib/gridData";

export default function Standings() {
  const { t } = useGrid();

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-center font-display text-4xl font-black sm:text-5xl">
        {t.standings.title}
      </h1>

      <Tabs defaultValue="drivers" className="mt-8">
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
                {standings.drivers.map((row) => {
                  const driver = drivers.find((item) => item.id === row.driverId)!;
                  const team = teamById(driver.teamId);
                  const teamName = team.id === "red-bull" ? "Red Bull Racing" : team.name;
                  return (
                    <tr key={row.driverId} className="border-t border-border transition-grid-theme hover:bg-accent">
                      <td className="p-3 sm:p-4 font-black">{row.position}</td>
                      <td className="p-3 sm:p-4 font-semibold">
                        <Link
                          to={`/pilotos/${driver.id}`}
                          className="text-white underline-offset-4 hover:underline"
                        >
                          {driver.name}
                        </Link>
                      </td>
                      <td className="p-3 sm:p-4">
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
                      </td>
                      <td className="p-3 sm:p-4">{row.points}</td>
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
                </tr>
              </thead>
              <tbody>
                {standings.constructors.map((row) => {
                  const team = teamById(row.teamId);
                  const teamName = team.id === "red-bull" ? "Red Bull Racing" : team.name;
                  return (
                    <tr key={row.teamId} className="border-t border-border transition-grid-theme hover:bg-accent">
                      <td className="p-3 sm:p-4 font-black">{row.position}</td>
                      <td className="p-3 sm:p-4 font-semibold">
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
                      </td>
                      <td className="p-3 sm:p-4">{row.points}</td>
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
