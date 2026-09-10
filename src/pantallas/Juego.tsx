import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { PartidaResumen } from '@/types';
import type { PreferenciaTema } from '@/lib/almacenamiento';
import { useJuego, type ConfigJuego } from '@/hooks/useJuego';
import { useAlturaVisual } from '@/hooks/useAlturaVisual';
import { Encabezado } from '@/components/Encabezado';
import { Marcador } from '@/components/Marcador';
import { PilaPistas } from '@/components/PilaPistas';
import { CampoRespuesta } from '@/components/CampoRespuesta';
import { ResultadoRonda } from '@/components/ResultadoRonda';

const TITULOS: Record<string, string> = {
  clasico: 'Modo clásico',
  contrarreloj: 'Contrarreloj',
  categoria: 'Por categoría',
};

interface Props {
  config: ConfigJuego;
  tema: PreferenciaTema;
  onAlternarTema: () => void;
  onSalir: () => void;
  onTerminar: (resumen: PartidaResumen) => void;
}

export function Juego({ config, tema, onAlternarTema, onSalir, onTerminar }: Props) {
  const juego = useJuego(config);
  const alturaVisual = useAlturaVisual();

  useEffect(() => {
    if (juego.terminado) onTerminar(juego.resumen);
  }, [juego.terminado, juego.resumen, onTerminar]);

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ height: alturaVisual ? `${alturaVisual}px` : '100dvh' }}
    >
      <Encabezado
        titulo={TITULOS[config.modo] ?? 'Partida'}
        tema={tema}
        onAlternarTema={onAlternarTema}
        onVolver={onSalir}
      />

      <Marcador
        esContrarreloj={juego.esContrarreloj}
        numeroRonda={juego.numeroRonda}
        objetivoRondas={juego.objetivoRondas}
        puntosTotal={juego.puntosTotal}
        aciertos={juego.aciertos}
        segundos={juego.segundos}
      />

      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6 pt-4">
        <div className="mx-auto w-full max-w-[540px]">
          <PilaPistas
            key={juego.personaje.id}
            pistas={juego.personaje.pistas}
            visibles={juego.pistasVisibles}
          />
        </div>
      </main>

      <AnimatePresence mode="wait" initial={false}>
        {juego.faseRonda === 'adivinando' ? (
          <div key="campo">
            <CampoRespuesta
              pistasVisibles={juego.pistasVisibles}
              errorTic={juego.errorTic}
              onEnviar={juego.enviarRespuesta}
              onOtraPista={juego.pedirOtraPista}
              onRendirse={juego.rendirse}
            />
          </div>
        ) : juego.resultadoRonda ? (
          <ResultadoRonda
            key="resultado"
            personaje={juego.personaje}
            resultado={juego.resultadoRonda}
            pistasUsadas={juego.pistasVisibles}
            esUltimaRonda={juego.esUltimaRonda}
            esContrarreloj={juego.esContrarreloj}
            onSiguiente={juego.siguienteRonda}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
