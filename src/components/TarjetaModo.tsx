import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

interface Props {
  icono: LucideIcon;
  titulo: string;
  descripcion: string;
  onClick: () => void;
}

export function TarjetaModo({ icono: Icono, titulo, descripcion, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="vellum focus-gold group flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-[transform,border-color] duration-200 ease-vellum active:scale-[0.985] active:border-gold/50"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-card border border-line/25 bg-bg/40 text-gold">
        <Icono size={20} strokeWidth={1.6} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-serif text-[1.22rem] font-medium leading-tight text-ink">
          {titulo}
        </span>
        <span className="mt-0.5 block font-sans text-[0.83rem] leading-snug text-ink-soft text-pretty">
          {descripcion}
        </span>
      </span>
      <ChevronRight
        size={18}
        strokeWidth={1.7}
        className="shrink-0 text-ink-faint transition-transform duration-200 group-active:translate-x-0.5"
      />
    </button>
  );
}
