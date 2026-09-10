import { Clock, Flame, Trophy } from 'lucide-react';
import { SEGUNDOS_CONTRARRELOJ } from '@/hooks/useJuego';

interface Props {
  esContrarreloj: boolean;
  numeroRonda: number;
  objetivoRondas: number;
  puntosTotal: number;
  aciertos: number;
  segundos: number;
}

export function Marcador({
  esContrarreloj,
  numeroRonda,
  objetivoRondas,
  puntosTotal,
  aciertos,
  segundos,
}: Props) {
  const restanteFrac = Math.max(0, Math.min(1, segundos / SEGUNDOS_CONTRARRELOJ));
  const urgente = esContrarreloj && segundos <= 10;

  return (
    <div className="mx-auto w-full max-w-[540px] px-4 pt-3">
      <div className="flex items-center justify-between font-sans text-[0.8rem] text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          {esContrarreloj ? (
            <>
              <Flame size={14} strokeWidth={1.8} className="text-terracotta" />
              <span>
                <span className="tabular-nums font-medium text-ink">{aciertos}</span> aciertos
              </span>
            </>
          ) : (
            <span>
              Ronda{' '}
              <span className="tabular-nums font-medium text-ink">{numeroRonda}</span>
              <span className="text-ink-faint"> / {objetivoRondas}</span>
            </span>
          )}
        </span>

        <span className="inline-flex items-center gap-3">
          {esContrarreloj && (
            <span
              className={[
                'inline-flex items-center gap-1 tabular-nums',
                urgente ? 'font-semibold text-terracotta' : 'text-ink',
              ].join(' ')}
            >
              <Clock size={14} strokeWidth={1.8} />
              {segundos}s
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Trophy size={14} strokeWidth={1.8} className="text-gold" />
            <span className="tabular-nums font-medium text-ink">{puntosTotal}</span>
          </span>
        </span>
      </div>

      <div className="mt-2 h-px w-full bg-line/15">
        <div
          className="h-px bg-gold/60 transition-[width] duration-500 ease-linear"
          style={{
            width: esContrarreloj
              ? `${restanteFrac * 100}%`
              : `${objetivoRondas === Infinity ? 0 : ((numeroRonda - 1) / objetivoRondas) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
