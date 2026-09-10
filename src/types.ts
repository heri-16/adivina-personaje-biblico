export type Testamento = 'AT' | 'NT';

export type Categoria =
  | 'patriarca'
  | 'juez'
  | 'rey'
  | 'profeta'
  | 'apostol'
  | 'mujer'
  | 'otro';

export type Dificultad = 1 | 2 | 3;

export interface Personaje {
  id: string;
  nombre: string;
  /** Formas alternativas aceptadas como respuesta (en minusculas, sin tildes). */
  alias: string[];
  testamento: Testamento;
  categoria: Categoria;
  dificultad: Dificultad;
  /** Cinco pistas, de la mas vaga (0) a la que casi lo delata (4). */
  pistas: [string, string, string, string, string];
  /** Referencia biblica, p. ej. "Jonas 1:17". */
  cita: string;
  /** Version biblica a la que corresponden la cita y las frases citadas. */
  version: string;
  /** Curiosidad que se revela al acertar. */
  dato: string;
}

export type Modo = 'clasico' | 'contrarreloj' | 'categoria' | 'estudio';

export interface RondaResultado {
  personajeId: string;
  acertado: boolean;
  pistasUsadas: number;
  puntos: number;
}

export interface PartidaResumen {
  modo: Modo;
  fecha: number;
  rondas: RondaResultado[];
  puntosTotal: number;
  aciertos: number;
  total: number;
}

export interface Estadisticas {
  partidas: number;
  aciertos: number;
  intentos: number;
  /** Suma de pistas usadas en rondas acertadas (para el promedio). */
  pistasEnAciertos: number;
  mejorPuntaje: number;
  /** ids de personajes con al menos un acierto. */
  dominados: string[];
  racha: {
    actual: number;
    mejor: number;
    /** Fecha (YYYY-MM-DD) del ultimo dia jugado. */
    ultimoDia: string | null;
  };
}
