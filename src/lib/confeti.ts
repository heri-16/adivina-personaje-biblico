import confetti from 'canvas-confetti';

/** Confeti sobrio en tonos de manuscrito: dorado, oliva, sepia. */
export function lanzarConfeti(): void {
  if (typeof window === 'undefined') return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

  const colores = ['#c9a227', '#8a9860', '#b8a888', '#a9861a', '#6b7a3a'];
  const base: confetti.Options = {
    colors: colores,
    disableForReducedMotion: true,
    scalar: 0.9,
    ticks: 160,
    gravity: 1.1,
  };

  confetti({ ...base, particleCount: 40, spread: 55, origin: { x: 0.5, y: 0.7 }, startVelocity: 38 });
  window.setTimeout(() => {
    confetti({ ...base, particleCount: 20, angle: 60, spread: 65, origin: { x: 0, y: 0.75 } });
    confetti({ ...base, particleCount: 20, angle: 120, spread: 65, origin: { x: 1, y: 0.75 } });
  }, 120);
}
