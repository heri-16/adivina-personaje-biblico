import { useEffect, useState } from 'react';

/**
 * Altura real del viewport visible (descuenta el teclado virtual en móvil).
 * Se usa para que la barra de respuesta suba con el teclado sin tapar contenido.
 */
export function useAlturaVisual(): number | null {
  const [altura, setAltura] = useState<number | null>(null);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const actualizar = () => setAltura(Math.round(vv.height));
    actualizar();
    vv.addEventListener('resize', actualizar);
    vv.addEventListener('scroll', actualizar);
    return () => {
      vv.removeEventListener('resize', actualizar);
      vv.removeEventListener('scroll', actualizar);
    };
  }, []);

  return altura;
}
