import { motion } from 'framer-motion';
import type { SeleccionCategoria } from '@/hooks/useJuego';

const OPCIONES: { id: SeleccionCategoria; etiqueta: string }[] = [
  { id: 'profeta', etiqueta: 'Profetas' },
  { id: 'rey', etiqueta: 'Reyes' },
  { id: 'mujer', etiqueta: 'Mujeres' },
  { id: 'apostol', etiqueta: 'Apóstoles' },
  { id: 'NT', etiqueta: 'Nuevo Testamento' },
];

interface Props {
  onElegir: (seleccion: SeleccionCategoria) => void;
}

export function SelectorCategoria({ onElegir }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
      className="overflow-hidden"
    >
      <div className="flex flex-wrap gap-2 px-1 pt-2.5">
        {OPCIONES.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onElegir(o.id)}
            className="focus-gold rounded-pill border border-line/30 bg-surface px-3.5 py-2 font-sans text-[0.85rem] text-ink transition-colors active:border-gold active:text-gold"
          >
            {o.etiqueta}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
