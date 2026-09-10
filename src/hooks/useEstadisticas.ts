import { useCallback, useEffect, useState } from 'react';
import type { Estadisticas, PartidaResumen } from '@/types';
import {
  agregarAlHistorial,
  borrarTodo,
  cargarEstadisticas,
  cargarHistorial,
  estadisticasIniciales,
  guardarEstadisticas,
} from '@/lib/almacenamiento';
import { claveDia, diasEntre } from '@/lib/fecha';

export interface EstadisticasDerivadas extends Estadisticas {
  promedioPistas: number;
  precision: number;
  totalDominados: number;
}

function derivar(s: Estadisticas): EstadisticasDerivadas {
  return {
    ...s,
    promedioPistas: s.aciertos > 0 ? s.pistasEnAciertos / s.aciertos : 0,
    precision: s.intentos > 0 ? s.aciertos / s.intentos : 0,
    totalDominados: s.dominados.length,
  };
}

export function useEstadisticas() {
  const [stats, setStats] = useState<Estadisticas>(() =>
    typeof window === 'undefined' ? estadisticasIniciales : cargarEstadisticas(),
  );
  const [historial, setHistorial] = useState<PartidaResumen[]>(() =>
    typeof window === 'undefined' ? [] : cargarHistorial(),
  );

  useEffect(() => {
    guardarEstadisticas(stats);
  }, [stats]);

  /** Registra una partida terminada (no aplica al modo estudio). */
  const registrarPartida = useCallback((resumen: PartidaResumen) => {
    setStats((prev) => {
      const hoy = claveDia();
      let { actual, mejor, ultimoDia } = prev.racha;

      if (ultimoDia !== hoy) {
        const salto = ultimoDia ? diasEntre(ultimoDia, hoy) : Infinity;
        actual = salto === 1 ? actual + 1 : 1;
        mejor = Math.max(mejor, actual);
        ultimoDia = hoy;
      }

      const idsAcertados = resumen.rondas
        .filter((r) => r.acertado)
        .map((r) => r.personajeId);
      const dominados = Array.from(new Set([...prev.dominados, ...idsAcertados]));
      const pistasEnAciertosPartida = resumen.rondas
        .filter((r) => r.acertado)
        .reduce((n, r) => n + r.pistasUsadas, 0);

      return {
        partidas: prev.partidas + 1,
        aciertos: prev.aciertos + resumen.aciertos,
        intentos: prev.intentos + resumen.total,
        pistasEnAciertos: prev.pistasEnAciertos + pistasEnAciertosPartida,
        mejorPuntaje: Math.max(prev.mejorPuntaje, resumen.puntosTotal),
        dominados,
        racha: { actual, mejor, ultimoDia },
      };
    });

    agregarAlHistorial(resumen);
    setHistorial(cargarHistorial());
  }, []);

  const reiniciar = useCallback(() => {
    borrarTodo();
    setStats(estadisticasIniciales);
    setHistorial([]);
  }, []);

  return {
    stats: derivar(stats),
    historial,
    registrarPartida,
    reiniciar,
  } as const;
}
