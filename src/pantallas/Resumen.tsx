import { motion } from 'framer-motion';
import { Check, RotateCcw, X } from 'lucide-react';
import type { PartidaResumen } from '@/types';
import type { PreferenciaTema } from '@/lib/almacenamiento';
import { buscarPersonaje } from '@/data/personajes';
import { Encabezado } from '@/components/Encabezado';

const EASE = [0.22, 0.61, 0.36, 1] as const;

interface Props {
  resumen: PartidaResumen;
  tema: PreferenciaTema;
  onAlternarTema: () => void;
  onReintentar: () => void;
  onInicio: () => void;
}

export function Resumen({
  resumen,
  tema,
  onAlternarTema,
  onReintentar,
  onInicio,
}: Props) {
  const acertadas = resumen.rondas.filter((r) => r.acertado);
  const promedioPistas =
    acertadas.length > 0
      ? acertadas.reduce((n, r) => n + r.pistasUsadas, 0) / acertadas.length
      : 0;

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Encabezado
        titulo="Fin de la partida"
        tema={tema}
        onAlternarTema={onAlternarTema}
        onVolver={onInicio}
      />

      <main className="mx-auto w-full max-w-[540px] flex-1 px-5 pb-10 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: EASE }}
          className="text-center"
        >
          <p className="font-sans text-[0.72rem] uppercase tracking-[0.28em] text-gold">
            Puntuación
          </p>
          <p className="mt-1 font-serif text-[4rem] font-medium leading-none tabular-nums text-ink">
            {resumen.puntosTotal}
          </p>
        </motion.div>

        <div className="mt-6 grid grid-cols-3 gap-2 text-center">
          <Metrica valor={`${resumen.aciertos}/${resumen.total}`} etiqueta="Aciertos" />
          <Metrica
            valor={promedioPistas > 0 ? promedioPistas.toFixed(1) : '—'}
            etiqueta="Pistas / acierto"
          />
          <Metrica
            valor={
              resumen.total > 0
                ? `${Math.round((resumen.aciertos / resumen.total) * 100)}%`
                : '—'
            }
            etiqueta="Precisión"
          />
        </div>

        <ol className="mt-7 flex flex-col divide-y divide-line/12 overflow-hidden rounded-card border border-line/18">
          {resumen.rondas.map((r, i) => {
            const p = buscarPersonaje(r.personajeId);
            return (
              <li
                key={`${r.personajeId}-${i}`}
                className="flex items-center gap-3 bg-surface/40 px-3.5 py-2.5"
              >
                <span
                  className={[
                    'grid h-5 w-5 shrink-0 place-items-center rounded-full',
                    r.acertado
                      ? 'bg-olive/20 text-olive'
                      : 'bg-terracotta/15 text-terracotta',
                  ].join(' ')}
                >
                  {r.acertado ? (
                    <Check size={13} strokeWidth={2.6} />
                  ) : (
                    <X size={13} strokeWidth={2.6} />
                  )}
                </span>
                <span className="min-w-0 flex-1 truncate font-serif text-[1.05rem] text-ink">
                  {p?.nombre ?? r.personajeId}
                </span>
                <span className="shrink-0 font-sans text-[0.78rem] text-ink-faint">
                  {r.acertado ? `${r.pistasUsadas}p` : '—'}
                </span>
                <span className="w-10 shrink-0 text-right font-sans text-[0.82rem] font-medium tabular-nums text-ink-soft">
                  {r.puntos}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="mt-7 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onReintentar}
            className="focus-gold tap flex w-full items-center justify-center gap-2 rounded-card bg-gold py-3 font-sans text-[0.95rem] font-medium text-bg transition-[filter] active:brightness-90"
          >
            <RotateCcw size={17} strokeWidth={2} />
            Jugar otra vez
          </button>
          <button
            type="button"
            onClick={onInicio}
            className="focus-gold tap w-full rounded-card border border-line/25 py-3 font-sans text-[0.95rem] text-ink-soft transition-colors active:border-gold/40"
          >
            Volver al inicio
          </button>
        </div>
      </main>
    </div>
  );
}

function Metrica({ valor, etiqueta }: { valor: string; etiqueta: string }) {
  return (
    <div className="rounded-card border border-line/18 bg-surface/40 px-2 py-3">
      <p className="font-serif text-[1.4rem] font-medium leading-none tabular-nums text-ink">
        {valor}
      </p>
      <p className="mt-1.5 font-sans text-[0.68rem] uppercase tracking-[0.1em] text-ink-faint">
        {etiqueta}
      </p>
    </div>
  );
}
