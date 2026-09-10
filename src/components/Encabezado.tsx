import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { BotonTema } from './BotonTema';
import type { PreferenciaTema } from '@/lib/almacenamiento';

interface Props {
  titulo: string;
  tema: PreferenciaTema;
  onAlternarTema: () => void;
  onVolver?: () => void;
  derecha?: ReactNode;
}

export function Encabezado({ titulo, tema, onAlternarTema, onVolver, derecha }: Props) {
  return (
    <header className="safe-top sticky top-0 z-20 border-b border-line/15 bg-bg/85 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-[540px] items-center gap-1 px-2">
        {onVolver ? (
          <button
            type="button"
            onClick={onVolver}
            aria-label="Volver"
            className="tap focus-gold -ml-1 grid place-items-center rounded-pill text-ink-soft transition-colors hover:text-gold active:text-gold"
          >
            <ChevronLeft size={22} strokeWidth={1.7} />
          </button>
        ) : (
          <span className="w-2" aria-hidden />
        )}

        <h1 className="flex-1 truncate px-1 text-center font-serif text-[1.15rem] font-medium tracking-tight text-ink">
          {titulo}
        </h1>

        <div className="flex items-center gap-1">
          {derecha}
          <BotonTema tema={tema} onAlternar={onAlternarTema} />
        </div>
      </div>
    </header>
  );
}
