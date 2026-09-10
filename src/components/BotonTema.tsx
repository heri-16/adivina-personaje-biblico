import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PreferenciaTema } from '@/lib/almacenamiento';

interface Props {
  tema: PreferenciaTema;
  onAlternar: () => void;
}

export function BotonTema({ tema, onAlternar }: Props) {
  const esOscuro = tema === 'oscuro';
  return (
    <button
      type="button"
      onClick={onAlternar}
      aria-label={esOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className="tap focus-gold grid place-items-center rounded-pill border border-line/25 text-ink-soft transition-colors hover:text-gold active:text-gold"
    >
      <motion.span
        key={tema}
        initial={{ rotate: -35, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
        className="grid place-items-center"
      >
        {esOscuro ? <Moon size={19} strokeWidth={1.6} /> : <Sun size={19} strokeWidth={1.6} />}
      </motion.span>
    </button>
  );
}
