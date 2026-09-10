import { useState } from 'react';
import {
  BarChart3,
  BookOpenText,
  Flame,
  Instagram,
  Layers,
  Signal,
  Sparkles,
  Timer,
} from 'lucide-react';
import type { Dificultad } from '@/types';
import type { PreferenciaTema } from '@/lib/almacenamiento';
import type { EstadisticasDerivadas } from '@/hooks/useEstadisticas';
import type { ConfigJuego, SeleccionCategoria } from '@/hooks/useJuego';
import { personajes } from '@/data/personajes';
import { BotonTema } from '@/components/BotonTema';
import { TarjetaModo } from '@/components/TarjetaModo';
import { SelectorCategoria } from '@/components/SelectorCategoria';
import { SelectorNivel } from '@/components/SelectorNivel';

interface Props {
  stats: EstadisticasDerivadas;
  tema: PreferenciaTema;
  onAlternarTema: () => void;
  onIniciar: (config: ConfigJuego) => void;
  onEstudio: () => void;
  onEstadisticas: () => void;
}

export function Inicio({
  stats,
  tema,
  onAlternarTema,
  onIniciar,
  onEstudio,
  onEstadisticas,
}: Props) {
  const [catAbierta, setCatAbierta] = useState(false);
  const [nivelAbierto, setNivelAbierto] = useState(false);

  const elegirCategoria = (seleccion: SeleccionCategoria) =>
    onIniciar({ modo: 'categoria', seleccion });

  const elegirNivel = (nivel: Dificultad) => onIniciar({ modo: 'nivel', nivel });

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-[540px] flex-col px-5">
      <div className="safe-top flex items-center justify-between pb-2 pt-3">
        <span className="font-sans text-[0.7rem] uppercase tracking-[0.3em] text-gold">
          Manuscrito
        </span>
        <BotonTema tema={tema} onAlternar={onAlternarTema} />
      </div>

      <header className="pb-6 pt-4">
        <h1 className="font-serif text-[2.7rem] font-medium leading-[1.05] tracking-tight text-ink text-balance">
          Adivina el Personaje Bíblico
        </h1>
        <div className="gold-rule my-4 w-28" />
        <p className="max-w-[36ch] font-serif text-[1.05rem] leading-snug text-ink-soft text-pretty">
          Cinco pistas, de la más vaga a la más clara. Cuanto antes lo nombres,
          más vale.
        </p>
      </header>

      <button
        type="button"
        onClick={onEstadisticas}
        className="focus-gold mb-6 flex items-center justify-between rounded-card border border-line/20 bg-surface/50 px-4 py-3 text-left transition-colors active:border-gold/40"
      >
        <span className="inline-flex items-center gap-2 font-sans text-[0.86rem] text-ink-soft">
          <Flame size={16} strokeWidth={1.8} className="text-terracotta" />
          Racha{' '}
          <span className="font-semibold text-ink">{stats.racha.actual}</span>
          {stats.racha.actual === 1 ? ' día' : ' días'}
        </span>
        <span className="font-sans text-[0.86rem] text-ink-soft">
          Dominados{' '}
          <span className="font-semibold text-ink">
            {stats.totalDominados}
          </span>
          <span className="text-ink-faint"> / {personajes.length}</span>
        </span>
      </button>

      <div className="flex flex-col gap-2.5">
        <TarjetaModo
          icono={Sparkles}
          titulo="Clásico"
          descripcion="10 personajes al azar. Sin prisa."
          onClick={() => onIniciar({ modo: 'clasico' })}
        />
        <TarjetaModo
          icono={Timer}
          titulo="Contrarreloj"
          descripcion="60 segundos. Los que puedas."
          onClick={() => onIniciar({ modo: 'contrarreloj' })}
        />
        <div>
          <TarjetaModo
            icono={Signal}
            titulo="Por nivel"
            descripcion="Elige Fácil, Medio o Difícil."
            onClick={() => setNivelAbierto((v) => !v)}
          />
          {nivelAbierto && <SelectorNivel onElegir={elegirNivel} />}
        </div>
        <div>
          <TarjetaModo
            icono={Layers}
            titulo="Por categoría"
            descripcion="Profetas, reyes, mujeres, apóstoles o NT."
            onClick={() => setCatAbierta((v) => !v)}
          />
          {catAbierta && <SelectorCategoria onElegir={elegirCategoria} />}
        </div>
        <TarjetaModo
          icono={BookOpenText}
          titulo="Estudio"
          descripcion="Repasa todas las fichas, con grupo de jóvenes."
          onClick={onEstudio}
        />
      </div>

      <div className="flex-1" />

      <footer className="flex items-center justify-between gap-4 py-6 font-sans text-[0.78rem] text-ink-faint">
        <button
          type="button"
          onClick={onEstadisticas}
          className="focus-gold inline-flex items-center gap-1.5 transition-colors hover:text-gold active:text-gold"
        >
          <BarChart3 size={14} strokeWidth={1.7} />
          Estadísticas
        </button>
        <a
          href="https://www.instagram.com/heri_gh27"
          target="_blank"
          rel="noopener noreferrer"
          className="focus-gold inline-flex items-center gap-1.5 transition-colors hover:text-gold active:text-gold"
        >
          <Instagram size={13} strokeWidth={1.7} />
          Developer Herí
        </a>
      </footer>
    </div>
  );
}
