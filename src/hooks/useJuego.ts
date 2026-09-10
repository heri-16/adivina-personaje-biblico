import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Personaje, PartidaResumen, RondaResultado } from '@/types';
import {
  personajes,
  personajesPorCategoria,
  personajesPorTestamento,
} from '@/data/personajes';
import { barajar, muestra } from '@/lib/aleatorio';
import { MAX_PISTAS, puntosPara } from '@/lib/puntaje';
import { validarRespuesta } from '@/lib/texto';

export const RONDAS_CLASICO = 10;
export const RONDAS_CATEGORIA = 10;
export const SEGUNDOS_CONTRARRELOJ = 60;

export type SeleccionCategoria = 'profeta' | 'rey' | 'mujer' | 'apostol' | 'NT';

export type ConfigJuego =
  | { modo: 'clasico' }
  | { modo: 'contrarreloj' }
  | { modo: 'categoria'; seleccion: SeleccionCategoria };

function construirCola(config: ConfigJuego): Personaje[] {
  if (config.modo === 'clasico') return muestra(personajes, RONDAS_CLASICO);
  if (config.modo === 'contrarreloj') return barajar(personajes);
  const pool =
    config.seleccion === 'NT'
      ? personajesPorTestamento('NT')
      : personajesPorCategoria(config.seleccion);
  return muestra(pool, Math.min(RONDAS_CATEGORIA, pool.length));
}

export interface EstadoRonda {
  acertado: boolean;
  aproximado: boolean;
}

export function useJuego(config: ConfigJuego) {
  const cola = useMemo(() => construirCola(config), [config]);
  const esContrarreloj = config.modo === 'contrarreloj';

  const [indice, setIndice] = useState(0);
  const [pistasVisibles, setPistasVisibles] = useState(1);
  const [intentos, setIntentos] = useState(0);
  const [faseRonda, setFaseRonda] = useState<'adivinando' | 'resuelta'>('adivinando');
  const [resultadoRonda, setResultadoRonda] = useState<EstadoRonda | null>(null);
  const [errorTic, setErrorTic] = useState(0); // dispara el shake
  const [resultados, setResultados] = useState<RondaResultado[]>([]);
  const [terminado, setTerminado] = useState(false);
  const [segundos, setSegundos] = useState<number>(
    esContrarreloj ? SEGUNDOS_CONTRARRELOJ : 0,
  );

  const personaje = cola[Math.min(indice, cola.length - 1)]!;
  const objetivoRondas = esContrarreloj ? Infinity : cola.length;

  const puntosTotal = useMemo(
    () => resultados.reduce((n, r) => n + r.puntos, 0),
    [resultados],
  );
  const aciertos = useMemo(
    () => resultados.filter((r) => r.acertado).length,
    [resultados],
  );

  // -- Cronometro del modo contrarreloj -----------------------------------
  const timerActivo = esContrarreloj && !terminado && faseRonda === 'adivinando';
  const terminadoRef = useRef(terminado);
  terminadoRef.current = terminado;

  useEffect(() => {
    if (!timerActivo) return;
    const id = window.setInterval(() => {
      setSegundos((s) => {
        if (s <= 1) {
          window.clearInterval(id);
          if (!terminadoRef.current) setTerminado(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerActivo]);

  // -- Acciones ---------------------------------------------------------------
  const enviarRespuesta = useCallback(
    (texto: string) => {
      if (faseRonda !== 'adivinando' || terminado) return;
      const v = validarRespuesta(texto, personaje.nombre, personaje.alias);
      setIntentos((n) => n + 1);

      if (v.acierto) {
        const pistasUsadas = pistasVisibles;
        setResultados((prev) => [
          ...prev,
          {
            personajeId: personaje.id,
            acertado: true,
            pistasUsadas,
            puntos: puntosPara(pistasUsadas),
          },
        ]);
        setResultadoRonda({ acertado: true, aproximado: v.aproximado });
        setFaseRonda('resuelta');
      } else {
        setResultadoRonda({ acertado: false, aproximado: false });
        setErrorTic((n) => n + 1);
      }
    },
    [faseRonda, terminado, personaje, pistasVisibles],
  );

  const pedirOtraPista = useCallback(() => {
    if (faseRonda !== 'adivinando' || terminado) return;
    setPistasVisibles((n) => Math.min(n + 1, MAX_PISTAS));
    setResultadoRonda(null);
  }, [faseRonda, terminado]);

  const rendirse = useCallback(() => {
    if (faseRonda !== 'adivinando' || terminado) return;
    setResultados((prev) => [
      ...prev,
      {
        personajeId: personaje.id,
        acertado: false,
        pistasUsadas: pistasVisibles,
        puntos: 0,
      },
    ]);
    setResultadoRonda({ acertado: false, aproximado: false });
    setFaseRonda('resuelta');
  }, [faseRonda, terminado, personaje, pistasVisibles]);

  const siguienteRonda = useCallback(() => {
    const haySiguiente =
      indice + 1 < cola.length && resultados.length < objetivoRondas;
    if (!haySiguiente) {
      setTerminado(true);
      return;
    }
    setIndice((i) => i + 1);
    setPistasVisibles(1);
    setIntentos(0);
    setFaseRonda('adivinando');
    setResultadoRonda(null);
  }, [indice, cola.length, resultados.length, objetivoRondas]);

  const resumen: PartidaResumen = useMemo(
    () => ({
      modo: config.modo,
      fecha: Date.now(),
      rondas: resultados,
      puntosTotal,
      aciertos,
      total: resultados.length,
    }),
    [config.modo, resultados, puntosTotal, aciertos],
  );

  return {
    // datos de la ronda
    personaje,
    pistasVisibles,
    intentos,
    faseRonda,
    resultadoRonda,
    errorTic,
    // progreso
    numeroRonda: resultados.length + (faseRonda === 'resuelta' ? 0 : 1),
    rondasResueltas: resultados.length,
    objetivoRondas,
    puntosTotal,
    aciertos,
    segundos,
    esContrarreloj,
    esUltimaRonda: !esContrarreloj && indice + 1 >= cola.length,
    terminado,
    resumen,
    // acciones
    enviarRespuesta,
    pedirOtraPista,
    rendirse,
    siguienteRonda,
  } as const;
}
