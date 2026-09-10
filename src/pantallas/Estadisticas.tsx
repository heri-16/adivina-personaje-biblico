import { useState } from 'react';
import { Flame, Trash2 } from 'lucide-react';
import type { Modo, PartidaResumen } from '@/types';
import type { PreferenciaTema } from '@/lib/almacenamiento';
import type { EstadisticasDerivadas } from '@/hooks/useEstadisticas';
import { personajes } from '@/data/personajes';
import { Encabezado } from '@/components/Encabezado';

const NOMBRE_MODO: Record<Modo, string> = {
  clasico: 'Clásico',
  contrarreloj: 'Contrarreloj',
  categoria: 'Categoría',
  estudio: 'Estudio',
};

interface Props {
  stats: EstadisticasDerivadas;
  historial: PartidaResumen[];
  tema: PreferenciaTema;
  onAlternarTema: () => void;
  onVolver: () => void;
  onReiniciar: () => void;
}

function fechaCorta(ts: number): string {
  const d = new Date(ts);
  const hoy = new Date();
  const ayer = new Date(hoy);
  ayer.setDate(hoy.getDate() - 1);
  const mismaFecha = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  if (mismaFecha(d, hoy)) return 'Hoy';
  if (mismaFecha(d, ayer)) return 'Ayer';
  return d.toLocaleDateString('es', { day: 'numeric', month: 'short' });
}

export function Estadisticas({
  stats,
  historial,
  tema,
  onAlternarTema,
  onVolver,
  onReiniciar,
}: Props) {
  const [confirmando, setConfirmando] = useState(false);
  const fracDominados = stats.totalDominados / personajes.length;

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Encabezado
        titulo="Estadísticas"
        tema={tema}
        onAlternarTema={onAlternarTema}
        onVolver={onVolver}
      />

      <main className="mx-auto w-full max-w-[540px] flex-1 px-5 pb-12 pt-6">
        <div className="vellum flex items-center justify-between px-4 py-4">
          <div className="inline-flex items-center gap-2.5">
            <Flame size={22} strokeWidth={1.6} className="text-terracotta" />
            <div>
              <p className="font-serif text-[1.9rem] font-medium leading-none tabular-nums text-ink">
                {stats.racha.actual}
              </p>
              <p className="mt-1 font-sans text-[0.7rem] uppercase tracking-[0.14em] text-ink-faint">
                {stats.racha.actual === 1 ? 'día seguido' : 'días seguidos'}
              </p>
            </div>
          </div>
          <div className="text-right font-sans text-[0.8rem] text-ink-soft">
            Mejor racha
            <br />
            <span className="font-serif text-[1.3rem] text-ink">
              {stats.racha.mejor}
            </span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <Celda valor={stats.partidas} etiqueta="Partidas" />
          <Celda valor={stats.aciertos} etiqueta="Aciertos totales" />
          <Celda
            valor={`${Math.round(stats.precision * 100)}%`}
            etiqueta="Precisión"
          />
          <Celda
            valor={stats.promedioPistas > 0 ? stats.promedioPistas.toFixed(1) : '—'}
            etiqueta="Pistas por acierto"
          />
          <Celda valor={stats.mejorPuntaje} etiqueta="Mejor puntaje" />
          <Celda
            valor={`${stats.totalDominados}/${personajes.length}`}
            etiqueta="Personajes dominados"
          />
        </div>

        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-pill bg-line/15">
            <div
              className="h-full rounded-pill bg-gold/70 transition-[width] duration-500"
              style={{ width: `${fracDominados * 100}%` }}
            />
          </div>
        </div>

        {historial.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-2.5 font-sans text-[0.72rem] uppercase tracking-[0.2em] text-ink-faint">
              Últimas partidas
            </h2>
            <ol className="flex flex-col divide-y divide-line/12 overflow-hidden rounded-card border border-line/18">
              {historial.slice(0, 12).map((p, i) => (
                <li
                  key={`${p.fecha}-${i}`}
                  className="flex items-center gap-3 bg-surface/40 px-3.5 py-2.5"
                >
                  <span className="flex-1 font-serif text-[1.02rem] text-ink">
                    {NOMBRE_MODO[p.modo]}
                  </span>
                  <span className="font-sans text-[0.76rem] text-ink-faint">
                    {fechaCorta(p.fecha)}
                  </span>
                  <span className="font-sans text-[0.78rem] text-ink-soft">
                    {p.aciertos}/{p.total}
                  </span>
                  <span className="w-12 text-right font-sans text-[0.85rem] font-medium tabular-nums text-ink">
                    {p.puntosTotal}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}

        <div className="mt-10">
          {confirmando ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onReiniciar();
                  setConfirmando(false);
                }}
                className="focus-gold tap flex-1 rounded-card border border-terracotta bg-terracotta/10 py-2.5 font-sans text-[0.85rem] font-medium text-terracotta"
              >
                Sí, borrar todo
              </button>
              <button
                type="button"
                onClick={() => setConfirmando(false)}
                className="focus-gold tap flex-1 rounded-card border border-line/25 py-2.5 font-sans text-[0.85rem] text-ink-soft"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmando(true)}
              className="focus-gold inline-flex items-center gap-2 py-2 font-sans text-[0.82rem] text-ink-faint transition-colors hover:text-terracotta active:text-terracotta"
            >
              <Trash2 size={15} strokeWidth={1.7} />
              Borrar progreso y estadísticas
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

function Celda({ valor, etiqueta }: { valor: string | number; etiqueta: string }) {
  return (
    <div className="rounded-card border border-line/18 bg-surface/40 px-3.5 py-3.5">
      <p className="font-serif text-[1.65rem] font-medium leading-none tabular-nums text-ink">
        {valor}
      </p>
      <p className="mt-1.5 font-sans text-[0.7rem] uppercase tracking-[0.1em] text-ink-faint">
        {etiqueta}
      </p>
    </div>
  );
}
