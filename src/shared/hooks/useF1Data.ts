/**
 * React Query hooks for F1 live data
 * Fallback robusto para dados locais quando a API não responde.
 */

import { useQuery } from "@tanstack/react-query";
import {
  fetchDriverStandings,
  fetchConstructorStandings,
  fetchCalendar,
  fetchLastRaceResults,
  fetchOpenF1Drivers,
  fetchLatestSession,
  fetchLivePositions,
  fetchDriverCareerStats,
} from "@/shared/services/f1Api";
import { ergastDriverId } from "@/shared/services/f1Mappings";
import standingsJson from "@/data/standings.json";
import driversJson from "@/features/drivers/data/drivers.json";
import calendarJson from "@/features/calendar/data/calendar.json";

// ─── Fallback data bem formado (mesmo shape que a API retorna) ────────────────

const DRIVER_FALLBACK = standingsJson.drivers.map((d) => {
  const localDriver = driversJson.find((dr) => dr.id === d.driverId);
  return {
    position: d.position,
    driverId: d.driverId,
    points: d.points,
    wins: d.wins,
    driverName: localDriver?.name ?? d.driverId,
    teamId: localDriver?.teamId ?? "",
    nationality: "",
  };
});

const CONSTRUCTOR_FALLBACK = standingsJson.constructors.map((c) => ({
  position: c.position,
  teamId: c.teamId,
  teamName: c.teamId,
  points: c.points,
  wins: (c as any).wins ?? 0,
}));

// ─── Standings ────────────────────────────────────────────────────────────────

export function useDriverStandings() {
  return useQuery({
    queryKey: ["f1", "driver-standings"],
    queryFn: () => fetchDriverStandings(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    // initialData: dados síncronos que aparecem imediatamente e não mostram loading
    // (placeholderData causava re-render duplo que crashava o componente)
    initialData: DRIVER_FALLBACK,
    initialDataUpdatedAt: 0, // força revalidação imediata
  });
}

export function useConstructorStandings() {
  return useQuery({
    queryKey: ["f1", "constructor-standings"],
    queryFn: () => fetchConstructorStandings(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    initialData: CONSTRUCTOR_FALLBACK,
    initialDataUpdatedAt: 0,
  });
}

export function useStandings() {
  const driversQuery = useDriverStandings();
  const constructorsQuery = useConstructorStandings();
  return {
    drivers: driversQuery.data ?? DRIVER_FALLBACK,
    constructors: constructorsQuery.data ?? CONSTRUCTOR_FALLBACK,
    isLoading: driversQuery.isFetching || constructorsQuery.isFetching,
    isError: driversQuery.isError && constructorsQuery.isError,
    lastUpdated: driversQuery.dataUpdatedAt,
  };
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

export function useCalendar() {
  return useQuery({
    queryKey: ["f1", "calendar"],
    queryFn: () => fetchCalendar(),
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    retry: 2,
    initialData: calendarJson as any,
    initialDataUpdatedAt: 0,
  });
}

export function useNextRace() {
  const { data: calendar, isFetching } = useCalendar();
  const races = calendar ?? [];
  const nextRace =
    races.find((r: any) => r.status === "next") ||
    races.find((r: any) => r.status === "upcoming") ||
    races[0];
  return { nextRace, isLoading: isFetching };
}

// ─── Last race results ────────────────────────────────────────────────────────

export function useLastRaceResults() {
  return useQuery({
    queryKey: ["f1", "last-race-results"],
    queryFn: () => fetchLastRaceResults(),
    staleTime: 30 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    retry: 2,
  });
}

// ─── OpenF1 live ──────────────────────────────────────────────────────────────

export function useLatestSession() {
  return useQuery({
    queryKey: ["openf1", "latest-session"],
    queryFn: fetchLatestSession,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
}

export function useOpenF1Drivers() {
  return useQuery({
    queryKey: ["openf1", "drivers"],
    queryFn: fetchOpenF1Drivers,
    staleTime: 60 * 60 * 1000,
    gcTime: 6 * 60 * 60 * 1000,
    retry: 1,
  });
}

export function useLivePositions() {
  const { data: session } = useLatestSession();
  const isLive = session?.status === "started";

  return useQuery({
    queryKey: ["openf1", "live-positions"],
    queryFn: fetchLivePositions,
    enabled: isLive,
    refetchInterval: isLive ? 5_000 : false,
    staleTime: 4_000,
    retry: 1,
  });
}

export function useDriverCareerStats(appDriverId: string) {
  const ergastId = ergastDriverId(appDriverId);
  return useQuery({
    queryKey: ["f1", "career-stats", ergastId],
    queryFn: () => fetchDriverCareerStats(ergastId),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 48 * 60 * 60 * 1000,
    retry: 2,
    enabled: !!appDriverId,
  });
}
