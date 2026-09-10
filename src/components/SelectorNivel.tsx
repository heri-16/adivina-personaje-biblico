import { motion } from 'framer-motion';
import type { Dificultad } from '@/types';
import { NIVELES } from '@/types';

interface Props {
  onElegir: (nivel: Dificultad) => void;
}

export function SelectorNivel({ onElegir }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
      className="overflow-hidden"
    >
      <div className="flex flex-wrap gap-2 px-1 pt-2.5">
        {NIVELES.map((n) => (
          <button
            key={n.valor}
            type="button"
            onClick={() => onElegir(n.valor)}
            className="focus-gold rounded-pill border border-line/30 bg-surface px-3.5 py-2 font-sans text-[0.85rem] text-ink transition-colors active:border-gold active:text-gold"
          >
            {n.etiqueta}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
