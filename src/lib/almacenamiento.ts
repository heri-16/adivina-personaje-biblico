import type { Estadisticas, PartidaResumen } from '@/types';

const PREFIJO = 'apb.v1.';
const K_STATS = PREFIJO + 'estadisticas';
const K_HISTORIAL = PREFIJO + 'historial';
const K_TEMA = PREFIJO + 'tema';

export const estadisticasIniciales: Estadisticas = {
  partidas: 0,
  aciertos: 0,
  intentos: 0,
  pistasEnAciertos: 0,
  mejorPuntaje: 0,
  dominados: [],
  racha: { actual: 0, mejor: 0, ultimoDia: null },
};

function leer<T>(clave: string, porDefecto: T): T {
  try {
    const crudo = localStorage.getItem(clave);
    if (!crudo) return porDefecto;
    return { ...porDefecto, ...(JSON.parse(crudo) as object) } as T;
  } catch {
    return porDefecto;
  }
}

function escribir(clave: string, valor: unknown): void {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    /* almacenamiento lleno o no disponible: seguimos sin persistir */
  }
}

export function cargarEstadisticas(): Estadisticas {
  const s = leer<Estadisticas>(K_STATS, estadisticasIniciales);
  return {
    ...estadisticasIniciales,
    ...s,
    racha: { ...estadisticasIniciales.racha, ...s.racha },
    dominados: Array.isArray(s.dominados) ? s.dominados : [],
  };
}

export function guardarEstadisticas(s: Estadisticas): void {
  escribir(K_STATS, s);
}

export function cargarHistorial(): PartidaResumen[] {
  try {
    const crudo = localStorage.getItem(K_HISTORIAL);
    if (!crudo) return [];
    const arr = JSON.parse(crudo) as PartidaResumen[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function agregarAlHistorial(p: PartidaResumen): void {
  const previo = cargarHistorial();
  previo.unshift(p);
  escribir(K_HISTORIAL, previo.slice(0, 50));
}

export function borrarTodo(): void {
  try {
    [K_STATS, K_HISTORIAL].forEach((k) => localStorage.removeItem(k));
  } catch {
    /* nada */
  }
}

export type PreferenciaTema = 'oscuro' | 'claro';

export function cargarTema(): PreferenciaTema {
  try {
    const t = localStorage.getItem(K_TEMA);
    return t === 'claro' ? 'claro' : 'oscuro';
  } catch {
    return 'oscuro';
  }
}

export function guardarTema(t: PreferenciaTema): void {
  try {
    localStorage.setItem(K_TEMA, t);
  } catch {
    /* nada */
  }
}
