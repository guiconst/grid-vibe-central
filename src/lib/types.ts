export type Lang = "pt" | "en";

export type Team = {
  id: string;
  name: string;
  fullName: string;
  primary: string;
  secondary: string;
  base: string;
  championships: number;
  car: string;
  country?: string;
  history: { pt: string; en: string };
  curiosities: { pt: string[]; en: string[] };
};

export type Driver = {
  id: string;
  name: string;
  number: number;
  teamId: string;
  flag?: string;
  nationality?: { pt: string; en: string };
  bio?: { pt: string; en: string };
  facts?: { pt: string[]; en: string[] };
  championships?: number;
  stats: { starts: number; wins: number; podiums: number; poles: number; dnfs?: number };
  season: { position: number; points: number; wins?: number; podiums?: number };
};

export type Race = {
  id: string;
  name: { pt: string; en: string };
  circuit: string;
  date: string;
  status: string;
  flag?: string;
};
