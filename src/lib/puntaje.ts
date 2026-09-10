/** Puntos segun cuantas pistas se hayan revelado al acertar. */
export const PUNTOS_POR_PISTAS: Record<number, number> = {
  1: 100,
  2: 80,
  3: 60,
  4: 40,
  5: 20,
};

export const MAX_PISTAS = 5;

export function puntosPara(pistasUsadas: number): number {
  return PUNTOS_POR_PISTAS[Math.min(Math.max(pistasUsadas, 1), MAX_PISTAS)] ?? 0;
}
