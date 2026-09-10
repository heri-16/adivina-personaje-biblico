import { useCallback, useEffect, useState } from 'react';
import type { PartidaResumen } from '@/types';
import { useTema } from '@/hooks/useTema';
import { useEstadisticas } from '@/hooks/useEstadisticas';
import type { ConfigJuego } from '@/hooks/useJuego';
import { Inicio } from '@/pantallas/Inicio';
import { Juego } from '@/pantallas/Juego';
import { Resumen } from '@/pantallas/Resumen';
import { Estudio } from '@/pantallas/Estudio';
import { Estadisticas } from '@/pantallas/Estadisticas';

type Vista =
  | { nombre: 'inicio' }
  | { nombre: 'juego'; config: ConfigJuego }
  | { nombre: 'resumen'; resumen: PartidaResumen; config: ConfigJuego }
  | { nombre: 'estudio' }
  | { nombre: 'estadisticas' };

export default function App() {
  const { tema, alternar } = useTema();
  const { stats, historial, registrarPartida, reiniciar } = useEstadisticas();

  const [vista, setVista] = useState<Vista>({ nombre: 'inicio' });
  const [claveJuego, setClaveJuego] = useState(0);

  // Boton "atras" del navegador / Android -> volver al inicio.
  useEffect(() => {
    const alPop = () => setVista({ nombre: 'inicio' });
    window.addEventListener('popstate', alPop);
    return () => window.removeEventListener('popstate', alPop);
  }, []);

  const irA = useCallback((v: Vista, reemplazar = false) => {
    setVista(v);
    if (typeof history === 'undefined') return;
    if (v.nombre === 'inicio') return;
    if (reemplazar) history.replaceState({ v: v.nombre }, '');
    else history.pushState({ v: v.nombre }, '');
  }, []);

  const iniciarPartida = useCallback(
    (config: ConfigJuego) => {
      setClaveJuego((k) => k + 1);
      irA({ nombre: 'juego', config });
    },
    [irA],
  );

  const alTerminar = useCallback(
    (resumen: PartidaResumen) => {
      registrarPartida(resumen);
      setVista((prev) => {
        const config = prev.nombre === 'juego' ? prev.config : { modo: 'clasico' as const };
        return { nombre: 'resumen', resumen, config };
      });
      if (typeof history !== 'undefined') history.replaceState({ v: 'resumen' }, '');
    },
    [registrarPartida],
  );

  const volverInicio = useCallback(() => {
    setVista({ nombre: 'inicio' });
    if (typeof history !== 'undefined') history.replaceState({ v: 'inicio' }, '');
  }, []);

  switch (vista.nombre) {
    case 'juego':
      return (
        <Juego
          key={claveJuego}
          config={vista.config}
          tema={tema}
          onAlternarTema={alternar}
          onSalir={volverInicio}
          onTerminar={alTerminar}
        />
      );

    case 'resumen': {
      const configResumen = vista.config;
      return (
        <Resumen
          resumen={vista.resumen}
          tema={tema}
          onAlternarTema={alternar}
          onReintentar={() => iniciarPartida(configResumen)}
          onInicio={volverInicio}
        />
      );
    }

    case 'estudio':
      return (
        <Estudio
          dominados={stats.dominados}
          tema={tema}
          onAlternarTema={alternar}
          onVolver={volverInicio}
        />
      );

    case 'estadisticas':
      return (
        <Estadisticas
          stats={stats}
          historial={historial}
          tema={tema}
          onAlternarTema={alternar}
          onVolver={volverInicio}
          onReiniciar={reiniciar}
        />
      );

    default:
      return (
        <Inicio
          stats={stats}
          tema={tema}
          onAlternarTema={alternar}
          onIniciar={iniciarPartida}
          onEstudio={() => irA({ nombre: 'estudio' })}
          onEstadisticas={() => irA({ nombre: 'estadisticas' })}
        />
      );
  }
}
