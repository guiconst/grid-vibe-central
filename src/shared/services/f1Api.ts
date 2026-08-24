/**
 * F1 API Service
 *
 * Fontes gratuitas (sem chave):
 *   - Ergast Mirror  → https://api.jolpi.ca/ergast/f1/   (standings, calendar, results)
 *   - OpenF1         → https://api.openf1.org/v1/        (live session data, drivers)
 *
 * Fallback automático para os dados locais em caso de falha.
 */

// ─── Ergast (via jolpi.ca mirror) ───────────────────────────────────────────

const ERGAST = "https://api.jolpi.ca/ergast/f1";

export interface ErgastDriverStanding {
  position: string;
  points: string;
  wins: string;
  Driver: {
    driverId: string;
    givenName: string;
    familyName: string;
    nationality: string;
    dateOfBirth: string;
    permanentNumber?: string;
  };
  Constructors: Array<{ constructorId: string; name: string; nationality: string }>;
}

export interface ErgastConstructorStanding {
  position: string;
  points: string;
  wins: string;
  Constructor: { constructorId: string; name: string; nationality: string };
}

export interface ErgastRace {
  season: string;
  round: string;
  raceName: string;
  Circuit: { circuitId: string; circuitName: string; Location: { country: string; locality: string } };
  date: string;
  time?: string;
  Results?: ErgastResult[];
}

export interface ErgastResult {
  position: string;
  points: string;
  grid: string;
  Driver: { driverId: string; givenName: string; familyName: string };
  Constructor: { constructorId: string; name: string };
  status: string;
  FastestLap?: { rank: string; Time: { time: string } };
}

// Map Ergast constructorId/driverId → app IDs (mantidos em arquivo próprio
// porque crescem a cada temporada com entradas de pilotos/equipes novas)
import { mapConstructorId, mapDriverId } from "@/shared/services/f1Mappings";

// Ano atual da temporada F1 — atualizar quando mudar de temporada
const CURRENT_SEASON = "2026";

/** Fetch driver standings for a given season (defaults to current) */
export async function fetchDriverStandings(season = CURRENT_SEASON) {
  // Tenta a season solicitada; se vier vazia, tenta "current" como fallback
  const tryFetch = async (s: string) => {
    const res = await fetch(`${ERGAST}/${s}/driverStandings/`);
    if (!res.ok) throw new Error(`Ergast standings: ${res.status}`);
    const json = await res.json();
    return (json.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? []) as ErgastDriverStanding[];
  };

  let list = await tryFetch(season);
  // Se a API não tiver dados para a season explícita, tenta "current"
  if (list.length === 0 && season !== "current") {
    list = await tryFetch("current");
  }
  if (list.length === 0) throw new Error("Ergast standings: lista vazia");

  return list.map((s) => ({
    position: Number(s.position),
    driverId: mapDriverId(s.Driver.driverId),
    points: Number(s.points),
    wins: Number(s.wins),
    driverName: `${s.Driver.givenName} ${s.Driver.familyName}`,
    teamId: mapConstructorId(s.Constructors[0]?.constructorId ?? ""),
    nationality: s.Driver.nationality,
  }));
}

/** Fetch constructor standings for a given season */
export async function fetchConstructorStandings(season = CURRENT_SEASON) {
  const tryFetch = async (s: string) => {
    const res = await fetch(`${ERGAST}/${s}/constructorStandings/`);
    if (!res.ok) throw new Error(`Ergast constructor standings: ${res.status}`);
    const json = await res.json();
    return (json.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ?? []) as ErgastConstructorStanding[];
  };

  let list = await tryFetch(season);
  if (list.length === 0 && season !== "current") {
    list = await tryFetch("current");
  }
  if (list.length === 0) throw new Error("Ergast constructor standings: lista vazia");

  return list.map((s) => ({
    position: Number(s.position),
    teamId: mapConstructorId(s.Constructor.constructorId),
    teamName: s.Constructor.name,
    points: Number(s.points),
    wins: Number(s.wins),
  }));
}

/** Fetch full race calendar for a season */
export async function fetchCalendar(season = CURRENT_SEASON) {
  const res = await fetch(`${ERGAST}/${season}/`);
  if (!res.ok) throw new Error(`Ergast calendar: ${res.status}`);
  const json = await res.json();
  const races: ErgastRace[] = json.MRData?.RaceTable?.Races ?? [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fetch last completed round to mark "completed"
  let lastCompletedRound = 0;
  try {
    const lastRes = await fetch(`${ERGAST}/${season}/last/results/`);
    if (lastRes.ok) {
      const lastJson = await lastRes.json();
      lastCompletedRound = Number(lastJson.MRData?.RaceTable?.Races?.[0]?.round ?? 0);
    }
  } catch {
    // ignore
  }

  return races.map((r) => {
    const round = Number(r.round);
    const raceDate = new Date(`${r.date}T12:00:00`);
    let status: "completed" | "next" | "upcoming";
    if (round <= lastCompletedRound) {
      status = "completed";
    } else if (round === lastCompletedRound + 1) {
      status = "next";
    } else {
      status = "upcoming";
    }

    return {
      id: r.Circuit.circuitId,
      name: {
        pt: r.raceName.replace("Grand Prix", "GP"),
        en: r.raceName,
      },
      circuit: r.Circuit.circuitName,
      date: r.date,
      time: r.time ?? null,
      round,
      status,
      country: r.Circuit.Location.country,
      locality: r.Circuit.Location.locality,
    };
  });
}

/** Fetch last race results */
export async function fetchLastRaceResults(season = CURRENT_SEASON) {
  const res = await fetch(`${ERGAST}/${season}/last/results/`);
  if (!res.ok) throw new Error(`Ergast last results: ${res.status}`);
  const json = await res.json();
  const race: ErgastRace = json.MRData?.RaceTable?.Races?.[0];
  if (!race) return null;

  return {
    raceName: race.raceName,
    date: race.date,
    circuit: race.Circuit.circuitName,
    results: (race.Results ?? []).slice(0, 10).map((r) => ({
      position: Number(r.position),
      driverId: mapDriverId(r.Driver.driverId),
      driverName: `${r.Driver.givenName} ${r.Driver.familyName}`,
      teamId: mapConstructorId(r.Constructor.constructorId),
      points: Number(r.points),
      status: r.status,
      fastestLap: r.FastestLap?.rank === "1" ? r.FastestLap.Time.time : null,
    })),
  };
}

/** Fetch driver season stats from Ergast */
export async function fetchDriverSeasonStats(season = CURRENT_SEASON) {
  const res = await fetch(`${ERGAST}/${season}/driverStandings/`);
  if (!res.ok) throw new Error(`Ergast driver stats: ${res.status}`);
  const json = await res.json();
  const list: ErgastDriverStanding[] =
    json.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? [];

  const stats: Record<string, { position: number; points: number; wins: number }> = {};
  for (const s of list) {
    const id = mapDriverId(s.Driver.driverId);
    stats[id] = {
      position: Number(s.position),
      points: Number(s.points),
      wins: Number(s.wins),
    };
  }
  return stats;
}

// ─── Carreira completa do piloto ───────────────────────────────────────────

export interface DriverCareerStats {
  starts: number;
  wins: number;
  podiums: number;
  poles: number;
  dnfs: number;
}

export async function fetchDriverCareerStats(ergastDriverId: string): Promise<DriverCareerStats> {
  const pageSize = 1000;
  let offset = 0;
  let total = Infinity;
  const allResults: ErgastResult[] = [];

  while (offset < total) {
    const res = await fetch(`${ERGAST}/drivers/${ergastDriverId}/results/?limit=${pageSize}&offset=${offset}`);
    if (!res.ok) throw new Error(`Ergast career results: ${res.status}`);
    const json = await res.json();
    total = Number(json.MRData?.total ?? 0);
    const effectiveLimit = Number(json.MRData?.limit ?? pageSize) || pageSize;
    const races: ErgastRace[] = json.MRData?.RaceTable?.Races ?? [];
    for (const race of races) {
      if (race.Results) allResults.push(...race.Results);
    }
    if (races.length === 0) break;
    offset += effectiveLimit;
  }
  
let wins = 0;
let podiums = 0;
let poles = 0;
let dnfs = 0;

for (const r of allResults) {
  const pos = Number(r.position);
  const finishedClassified =
    r.status === "Finished" || r.status === "Lapped" || (r.status?.startsWith("+") ?? false);

  if (finishedClassified) {
    if (pos === 1) wins++;
    if (pos >= 1 && pos <= 3) podiums++;
  }
  if (r.grid === "1") poles++;
  if (!finishedClassified) dnfs++;
}

return { starts: allResults.length, wins, podiums, poles, dnfs };
}

// ─── OpenF1 ─────────────────────────────────────────────────────────────────

const OPENF1 = "https://api.openf1.org/v1";

export interface OpenF1Session {
  session_key: number;
  session_name: string;
  session_type: string;
  status: string;
  date_start: string;
  date_end: string;
  circuit_short_name: string;
  meeting_name: string;
  country_name: string;
  year: number;
}

export interface OpenF1Driver {
  driver_number: number;
  broadcast_name: string;
  full_name: string;
  name_acronym: string;
  team_name: string;
  team_colour: string;
  country_code: string;
  headshot_url: string;
  session_key: number;
}

/** Get the latest/current session info */
export async function fetchLatestSession(): Promise<OpenF1Session | null> {
  try {
    const res = await fetch(`${OPENF1}/sessions?session_key=latest`);
    if (!res.ok) return null;
    const data: OpenF1Session[] = await res.json();
    return data[0] ?? null;
  } catch {
    return null;
  }
}

/** Get drivers from the latest session (includes headshots & team colors) */
export async function fetchOpenF1Drivers(): Promise<OpenF1Driver[]> {
  try {
    const res = await fetch(`${OPENF1}/drivers?session_key=latest`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

/** Get live race positions (only during a session) */
export async function fetchLivePositions() {
  try {
    const res = await fetch(`${OPENF1}/position?session_key=latest`);
    if (!res.ok) return [];
    const data = await res.json();
    // Return most recent position for each driver
    const latest: Record<number, { position: number; date: string }> = {};
    for (const item of data) {
      if (!latest[item.driver_number] || item.date > latest[item.driver_number].date) {
        latest[item.driver_number] = { position: item.position, date: item.date };
      }
    }
    return Object.entries(latest).map(([num, val]) => ({
      driverNumber: Number(num),
      position: val.position,
    }));
  } catch {
    return [];
  }
}

/** Get current year schedule from OpenF1 meetings */
export async function fetchOpenF1Meetings(year = new Date().getFullYear()) {
  try {
    const res = await fetch(`${OPENF1}/meetings?year=${year}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}
