import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { Categoria } from '@/types';
import type { PreferenciaTema } from '@/lib/almacenamiento';
import { CATEGORIAS, personajes } from '@/data/personajes';
import { normalizar } from '@/lib/texto';
import { Encabezado } from '@/components/Encabezado';
import { FichaEstudio } from '@/components/FichaEstudio';

type FiltroTestamento = 'todos' | 'AT' | 'NT';

interface Props {
  dominados: string[];
  tema: PreferenciaTema;
  onAlternarTema: () => void;
  onVolver: () => void;
}

const CHIPS_CATEGORIA: (Categoria | 'todas')[] = [
  'todas',
  'patriarca',
  'juez',
  'rey',
  'profeta',
  'apostol',
  'mujer',
  'otro',
];

export function Estudio({ dominados, tema, onAlternarTema, onVolver }: Props) {
  const [testamento, setTestamento] = useState<FiltroTestamento>('todos');
  const [categoria, setCategoria] = useState<Categoria | 'todas'>('todas');
  const [busqueda, setBusqueda] = useState('');

  const dominadosSet = useMemo(() => new Set(dominados), [dominados]);

  const lista = useMemo(() => {
    const q = normalizar(busqueda);
    return personajes
      .filter((p) => testamento === 'todos' || p.testamento === testamento)
      .filter((p) => categoria === 'todas' || p.categoria === categoria)
      .filter((p) => {
        if (!q) return true;
        return [p.nombre, ...p.alias].some((n) => normalizar(n).includes(q));
      })
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  }, [testamento, categoria, busqueda]);

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Encabezado
        titulo="Estudio"
        tema={tema}
        onAlternarTema={onAlternarTema}
        onVolver={onVolver}
      />

      <div className="sticky top-14 z-10 border-b border-line/15 bg-bg/90 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-[540px] px-4 py-3">
          <div className="flex items-center gap-2 rounded-card border border-line/25 bg-surface px-3 py-2">
            <Search size={16} strokeWidth={1.7} className="shrink-0 text-ink-faint" />
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre"
              autoCorrect="off"
              autoCapitalize="off"
              className="min-w-0 flex-1 bg-transparent font-sans text-ink placeholder:text-ink-faint focus:outline-none"
            />
          </div>

          <div className="mt-2.5 flex gap-1.5">
            {(['todos', 'AT', 'NT'] as FiltroTestamento[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTestamento(t)}
                className={[
                  'flex-1 rounded-pill border px-3 py-1.5 font-sans text-[0.8rem] transition-colors',
                  testamento === t
                    ? 'border-gold/60 bg-gold/12 text-gold'
                    : 'border-line/25 text-ink-soft',
                ].join(' ')}
              >
                {t === 'todos' ? 'Todos' : t}
              </button>
            ))}
          </div>

          <div className="-mx-4 mt-2 overflow-x-auto px-4">
            <div className="flex w-max gap-1.5 pb-0.5">
              {CHIPS_CATEGORIA.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategoria(c)}
                  className={[
                    'whitespace-nowrap rounded-pill border px-3 py-1.5 font-sans text-[0.78rem] transition-colors',
                    categoria === c
                      ? 'border-gold/60 bg-gold/12 text-gold'
                      : 'border-line/25 text-ink-soft',
                  ].join(' ')}
                >
                  {c === 'todas'
                    ? 'Todas'
                    : CATEGORIAS.find((x) => x.id === c)?.plural ?? c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-[540px] flex-1 px-4 py-4">
        <p className="mb-3 font-sans text-[0.78rem] text-ink-faint">
          {lista.length} {lista.length === 1 ? 'ficha' : 'fichas'}
        </p>
        <div className="flex flex-col gap-2">
          {lista.map((p) => (
            <FichaEstudio
              key={p.id}
              personaje={p}
              dominado={dominadosSet.has(p.id)}
            />
          ))}
          {lista.length === 0 && (
            <p className="py-10 text-center font-serif text-lg text-ink-faint">
              Nada por aquí.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
