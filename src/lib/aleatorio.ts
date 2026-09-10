/** Baraja Fisher-Yates sobre una copia. */
export function barajar<T>(entrada: readonly T[]): T[] {
  const arr = entrada.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

/** n elementos al azar, sin repetir. Si n >= length, devuelve todo barajado. */
export function muestra<T>(entrada: readonly T[], n: number): T[] {
  return barajar(entrada).slice(0, Math.max(0, n));
}
