import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const EASE = [0.22, 0.61, 0.36, 1] as const;

interface Props {
  pistas: string[];
  visibles: number;
}

/**
 * Pistas como capas apiladas de pergamino. Cada nueva pista se despliega
 * desde arriba (opacity + translateY, sin rebote) y la vista baja hasta ella.
 */
export function PilaPistas({ pistas, visibles }: Props) {
  const finRef = useRef<HTMLDivElement>(null);
  const primeraCarga = useRef(true);

  useEffect(() => {
    if (primeraCarga.current) {
      primeraCarga.current = false;
      return;
    }
    finRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [visibles]);

  return (
    <ol className="flex flex-col gap-2.5">
      <AnimatePresence initial={false}>
        {pistas.slice(0, visibles).map((texto, i) => {
          const esUltima = i === visibles - 1;
          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.46, ease: EASE }}
              className={[
                'vellum relative overflow-hidden px-4 py-3.5',
                esUltima ? 'shadow-leaf' : 'opacity-[0.86]',
              ].join(' ')}
              style={{ marginTop: i === 0 ? 0 : -2 }}
            >
              <span
                aria-hidden
                className={[
                  'absolute inset-y-0 left-0 w-[3px]',
                  esUltima ? 'bg-gold/80' : 'bg-line/25',
                ].join(' ')}
              />
              <p className="mb-1 font-sans text-[0.68rem] font-medium uppercase tracking-[0.22em] text-gold/85">
                Pista {i + 1}
              </p>
              <p className="font-serif text-[1.28rem] leading-snug text-ink text-pretty">
                {texto}
              </p>
            </motion.li>
          );
        })}
      </AnimatePresence>
      <div ref={finRef} />
    </ol>
  );
}
