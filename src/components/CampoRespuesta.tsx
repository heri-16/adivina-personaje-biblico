import { useEffect, useRef, useState } from 'react';
import { CornerDownLeft, Eye, ScrollText } from 'lucide-react';
import { MAX_PISTAS, puntosPara } from '@/lib/puntaje';

interface Props {
  pistasVisibles: number;
  errorTic: number;
  onEnviar: (texto: string) => void;
  onOtraPista: () => void;
  onRendirse: () => void;
}

export function CampoRespuesta({
  pistasVisibles,
  errorTic,
  onEnviar,
  onOtraPista,
  onRendirse,
}: Props) {
  const [valor, setValor] = useState('');
  const [sacudir, setSacudir] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hayMasPistas = pistasVisibles < MAX_PISTAS;

  useEffect(() => {
    if (errorTic === 0) return;
    setSacudir(true);
    inputRef.current?.select();
    const id = window.setTimeout(() => setSacudir(false), 420);
    return () => window.clearTimeout(id);
  }, [errorTic]);

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valor.trim()) return;
    onEnviar(valor);
  };

  return (
    <div className="border-t border-line/15 bg-raised/95 backdrop-blur-sm">
      <div className="safe-bottom mx-auto w-full max-w-[540px] px-4 pt-3">
        {errorTic > 0 && (
          <p
            key={errorTic}
            role="status"
            className="mb-2 text-center font-sans text-[0.8rem] text-terracotta"
          >
            No es. Prueba otra vez o pide una pista.
          </p>
        )}

        <form onSubmit={enviar} className="flex items-stretch gap-2">
          <input
            ref={inputRef}
            type="text"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="¿Quién es?"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="words"
            spellCheck={false}
            enterKeyHint="done"
            aria-label="Escribe tu respuesta"
            className={[
              'focus-gold min-w-0 flex-1 rounded-card border bg-surface px-3.5 py-3 font-sans text-ink placeholder:text-ink-faint',
              sacudir ? 'animate-shake border-terracotta' : 'border-line/25',
            ].join(' ')}
          />
          <button
            type="submit"
            aria-label="Comprobar respuesta"
            className="focus-gold tap grid shrink-0 place-items-center rounded-card bg-gold px-4 text-bg transition-[filter] active:brightness-90"
          >
            <CornerDownLeft size={19} strokeWidth={2} />
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onOtraPista}
            disabled={!hayMasPistas}
            className="focus-gold inline-flex items-center gap-1.5 py-2 font-sans text-[0.82rem] text-ink-soft transition-colors enabled:hover:text-gold enabled:active:text-gold disabled:opacity-40"
          >
            <ScrollText size={15} strokeWidth={1.7} />
            {hayMasPistas ? (
              <>
                Otra pista{' '}
                <span className="text-ink-faint">
                  · {puntosPara(pistasVisibles + 1)} pts
                </span>
              </>
            ) : (
              'No quedan pistas'
            )}
          </button>

          <button
            type="button"
            onClick={onRendirse}
            className="focus-gold inline-flex items-center gap-1.5 py-2 font-sans text-[0.82rem] text-ink-faint transition-colors hover:text-terracotta active:text-terracotta"
          >
            <Eye size={15} strokeWidth={1.7} />
            Me rindo
          </button>
        </div>
      </div>
    </div>
  );
}
