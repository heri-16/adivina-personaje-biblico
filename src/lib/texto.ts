/**
 * Normalizacion y comparacion de respuestas.
 */

/** minusculas, sin tildes, sin puntuacion, sin espacios de sobra. */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // diacriticos
    .replace(/[^a-z0-9ñ\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Distancia de Levenshtein iterativa con una sola fila. */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const fila = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) fila[j] = j;

  for (let i = 1; i <= a.length; i++) {
    let anterior = fila[0]!;
    fila[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = fila[j]!;
      const coste = a[i - 1] === b[j - 1] ? 0 : 1;
      fila[j] = Math.min(
        fila[j]! + 1, // borrado
        fila[j - 1]! + 1, // insercion
        anterior + coste, // sustitucion
      );
      anterior = temp;
    }
  }
  return fila[b.length]!;
}

/**
 * Tolerancia de tipeo. El enunciado pide aceptar Levenshtein <= 2;
 * en nombres muy cortos (<=3) se baja a 1 para no confundir personajes.
 */
function toleranciaPara(objetivo: string): number {
  return objetivo.length <= 3 ? 1 : 2;
}

export interface ResultadoValidacion {
  acierto: boolean;
  /** true si se acepto por cercania (Levenshtein) y no por coincidencia exacta. */
  aproximado: boolean;
}

/**
 * Compara la respuesta del jugador contra el nombre canonico y los alias.
 * Acepta coincidencia exacta normalizada o Levenshtein <= tolerancia.
 */
export function validarRespuesta(
  entrada: string,
  nombre: string,
  alias: string[],
): ResultadoValidacion {
  const intento = normalizar(entrada);
  if (!intento) return { acierto: false, aproximado: false };

  const candidatos = [nombre, ...alias].map(normalizar).filter(Boolean);

  for (const c of candidatos) {
    if (intento === c) return { acierto: true, aproximado: false };
  }

  for (const c of candidatos) {
    const tol = Math.min(toleranciaPara(c), 2);
    if (levenshtein(intento, c) <= tol) {
      return { acierto: true, aproximado: true };
    }
    // Tambien aceptamos que acierte solo el apellido/ultima palabra larga.
    const ultima = c.split(' ').filter((w) => w.length >= 4).at(-1);
    if (ultima && ultima !== c) {
      if (intento === ultima || levenshtein(intento, ultima) <= Math.min(toleranciaPara(ultima), 2)) {
        return { acierto: true, aproximado: intento !== ultima };
      }
    }
  }

  return { acierto: false, aproximado: false };
}
