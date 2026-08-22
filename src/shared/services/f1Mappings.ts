/**
 * Mapeamento de IDs da API Ergast → IDs usados internamente pelo app.
 * Atualizar aqui sempre que um piloto ou equipe novo entrar na temporada.
 */

// Ergast constructorId → app teamId
const CONSTRUCTOR_MAP: Record<string, string> = {
  mercedes: "mercedes",
  ferrari: "ferrari",
  mclaren: "mclaren",
  red_bull: "red-bull",
  alpine: "alpine",
  haas: "haas",
  williams: "williams",
  rb: "racing-bulls",
  racing_bulls: "racing-bulls",
  aston_martin: "aston-martin",
  kick_sauber: "audi",
  sauber: "audi",
  audi: "audi",
  cadillac: "cadillac",
  andretti: "cadillac",
};

// Ergast driverId → app driverId (cobre diferenças de nomenclatura)
const DRIVER_MAP: Record<string, string> = {
  antonelli: "antonelli",
  russell: "russell",
  leclerc: "leclerc",
  hamilton: "hamilton",
  norris: "norris",
  piastri: "piastri",
  bearman: "bearman",
  gasly: "gasly",
  verstappen: "verstappen",
  lawson: "lawson",
  hadjar: "hadjar",
  bortoleto: "bortoleto",
  sainz: "sainz",
  ocon: "ocon",
  colapinto: "colapinto",
  hulkenberg: "hulkenberg",
  albon: "albon",
  bottas: "bottas",
  perez: "perez",
  alonso: "alonso",
  stroll: "stroll",
  lindblad: "lindblad",
};

export function mapDriverId(ergastId: string): string {
  return DRIVER_MAP[ergastId] ?? ergastId;
}

export function mapConstructorId(ergastId: string): string {
  return CONSTRUCTOR_MAP[ergastId] ?? ergastId;
}
