import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookMarked, Check, X } from 'lucide-react';
import type { Personaje } from '@/types';
import { CATEGORIAS } from '@/data/personajes';
import { puntosPara } from '@/lib/puntaje';
import { lanzarConfeti } from '@/lib/confeti';
import type { EstadoRonda } from '@/hooks/useJuego';

const EASE = [0.22, 0.61, 0.36, 1] as const;

interface Props {
  personaje: Personaje;
  resultado: EstadoRonda;
  pistasUsadas: number;
  esUltimaRonda: boolean;
  esContrarreloj: boolean;
  onSiguiente: () => void;
}

function etiquetaCategoria(id: Personaje['categoria']): string {
  return CATEGORIAS.find((c) => c.id === id)?.etiqueta ?? id;
}

export function ResultadoRonda({
  personaje,
  resultado,
  pistasUsadas,
  esUltimaRonda,
  esContrarreloj,
  onSiguiente,
}: Props) {
  const { acertado, aproximado } = resultado;

  useEffect(() => {
    if (acertado) lanzarConfeti();
  }, [acertado]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: EASE }}
      className="border-t border-line/15 bg-raised/97 backdrop-blur-sm"
    >
      <div className="safe-bottom mx-auto w-full max-w-[540px] px-4 pb-2 pt-4">
        <div className="flex items-center gap-2">
          <span
            className={[
              'grid h-6 w-6 shrink-0 place-items-center rounded-full',
              acertado ? 'bg-olive/20 text-olive' : 'bg-terracotta/15 text-terracotta',
            ].join(' ')}
          >
            {acertado ? <Check size={15} strokeWidth={2.4} /> : <X size={15} strokeWidth={2.4} />}
          </span>
          <p className="font-sans text-[0.8rem] text-ink-soft">
            {acertado ? (
              <>
                {aproximado && 'Casi… lo damos por bueno. '}
                {pistasUsadas} {pistasUsadas === 1 ? 'pista' : 'pistas'} ·{' '}
                <span className="font-semibold text-olive">+{puntosPara(pistasUsadas)} pts</span>
              </>
            ) : (
              'No esta vez. Era…'
            )}
          </p>
        </div>

        <h2 className="mt-1.5 font-serif text-[2rem] font-medium leading-tight text-ink">
          {personaje.nombre}
        </h2>
        <p className="mt-0.5 font-sans text-[0.75rem] uppercase tracking-[0.16em] text-ink-faint">
          {etiquetaCategoria(personaje.categoria)} ·{' '}
          {personaje.testamento === 'AT' ? 'Antiguo Testamento' : 'Nuevo Testamento'}
        </p>

        <div className="mt-3 flex items-start gap-2 rounded-card border border-line/20 bg-surface/60 px-3 py-2.5">
          <BookMarked size={15} strokeWidth={1.7} className="mt-0.5 shrink-0 text-gold" />
          <div className="min-w-0">
            <p className="font-serif text-[1.02rem] text-ink">
              {personaje.cita}
              <span className="ml-1.5 font-sans text-[0.68rem] uppercase tracking-[0.08em] text-ink-faint">
                {personaje.version}
              </span>
            </p>
            <p className="mt-1 font-sans text-[0.86rem] leading-relaxed text-ink-soft text-pretty">
              {personaje.dato}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onSiguiente}
          autoFocus
          className="focus-gold tap mt-3 flex w-full items-center justify-center gap-2 rounded-card bg-gold py-3 font-sans text-[0.95rem] font-medium text-bg transition-[filter] active:brightness-90"
        >
          {esContrarreloj || !esUltimaRonda ? (
            <>
              Siguiente <ArrowRight size={18} strokeWidth={2} />
            </>
          ) : (
            <>
              Ver resumen <ArrowRight size={18} strokeWidth={2} />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
