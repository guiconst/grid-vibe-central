/**
 * React Query hooks for F1 live data
 * Cada hook faz fallback automático para os dados locais se a API falhar.
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
} from "@/services/f1Api";
import standingsJson from "@/data/standings.json";
import calendarJson from "@/data/calendar.json";

// ─── Standings ───────────────────────────────────────────────────────────────

/** Driver standings — atualiza a cada 5 min */
export function useDriverStandings() {
  return useQuery({
    queryKey: ["f1", "driver-standings"],
    queryFn: fetchDriverStandings,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    placeholderData: standingsJson.drivers.map((d) => ({
      position: d.position,
      driverId: d.driverId,
      points: d.points,
      wins: d.wins,
      driverName: d.driverId,
      teamId: "",
      nationality: "",
    })),
  });
}

/** Constructor standings — atualiza a cada 5 min */
export function useConstructorStandings() {
  return useQuery({
    queryKey: ["f1", "constructor-standings"],
    queryFn: fetchConstructorStandings,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    placeholderData: standingsJson.constructors.map((c) => ({
      position: c.position,
      teamId: c.teamId,
      teamName: c.teamId,
      points: c.points,
      wins: 0,
    })),
  });
}

/** Combined standings (drivers + constructors) */
export function useStandings() {
  const drivers = useDriverStandings();
  const constructors = useConstructorStandings();
  return {
    drivers: drivers.data ?? [],
    constructors: constructors.data ?? [],
    isLoading: drivers.isLoading || constructors.isLoading,
    isError: drivers.isError && constructors.isError,
    lastUpdated: drivers.dataUpdatedAt,
  };
}

// ─── Calendar ────────────────────────────────────────────────────────────────

/** Full season calendar — atualiza a cada hora */
export function useCalendar() {
  return useQuery({
    queryKey: ["f1", "calendar"],
    queryFn: () => fetchCalendar("current"),
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    retry: 2,
    placeholderData: calendarJson as any,
  });
}

/** Next upcoming race */
export function useNextRace() {
  const { data: calendar, isLoading } = useCalendar();
  const nextRace =
    calendar?.find((r: any) => r.status === "next") ||
    calendar?.find((r: any) => r.status === "upcoming") ||
    calendar?.[0];
  return { nextRace, isLoading };
}

// ─── Last race results ───────────────────────────────────────────────────────

/** Results of the most recent race — atualiza a cada 30 min */
export function useLastRaceResults() {
  return useQuery({
    queryKey: ["f1", "last-race-results"],
    queryFn: () => fetchLastRaceResults("current"),
    staleTime: 30 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    retry: 2,
  });
}

// ─── OpenF1 live data ────────────────────────────────────────────────────────

/** Latest session info from OpenF1 */
export function useLatestSession() {
  return useQuery({
    queryKey: ["openf1", "latest-session"],
    queryFn: fetchLatestSession,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
}

/** Driver headshots & team colours from OpenF1 */
export function useOpenF1Drivers() {
  return useQuery({
    queryKey: ["openf1", "drivers"],
    queryFn: fetchOpenF1Drivers,
    staleTime: 60 * 60 * 1000,
    gcTime: 6 * 60 * 60 * 1000,
    retry: 1,
  });
}

/** Live race positions — polls every 5 seconds during a session */
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
