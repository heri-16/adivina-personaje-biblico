import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { Personaje } from '@/types';
import { CATEGORIAS } from '@/data/personajes';

interface Props {
  personaje: Personaje;
  dominado: boolean;
}

export function FichaEstudio({ personaje, dominado }: Props) {
  const [abierta, setAbierta] = useState(false);
  const cat = CATEGORIAS.find((c) => c.id === personaje.categoria)?.etiqueta ?? '';

  return (
    <div className="vellum-hairline overflow-hidden bg-surface/40">
      <button
        type="button"
        onClick={() => setAbierta((v) => !v)}
        aria-expanded={abierta}
        className="focus-gold flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate font-serif text-[1.2rem] font-medium text-ink">
              {personaje.nombre}
            </span>
            {dominado && (
              <span
                aria-label="Dominado"
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-olive"
              />
            )}
          </span>
          <span className="mt-0.5 block font-sans text-[0.72rem] uppercase tracking-[0.14em] text-ink-faint">
            {cat} · {personaje.testamento} · {personaje.cita}
          </span>
        </span>
        <ChevronDown
          size={18}
          strokeWidth={1.7}
          className={[
            'shrink-0 text-ink-faint transition-transform duration-200',
            abierta ? 'rotate-180' : '',
          ].join(' ')}
        />
      </button>

      <AnimatePresence initial={false}>
        {abierta && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-line/15 px-4 py-3.5">
              <ol className="flex flex-col gap-2">
                {personaje.pistas.map((p, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="mt-0.5 font-sans text-[0.7rem] font-semibold tabular-nums text-gold/80">
                      {i + 1}
                    </span>
                    <span className="font-serif text-[1.02rem] leading-snug text-ink-soft text-pretty">
                      {p}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-3 border-t border-line/12 pt-2.5 font-sans text-[0.84rem] leading-relaxed text-ink-soft text-pretty">
                {personaje.dato}
              </p>
              <p className="mt-2 font-sans text-[0.68rem] uppercase tracking-[0.1em] text-ink-faint">
                {personaje.cita} · {personaje.version}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
