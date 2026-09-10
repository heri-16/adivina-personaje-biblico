import { useCallback, useEffect, useState } from 'react';
import {
  cargarTema,
  guardarTema,
  type PreferenciaTema,
} from '@/lib/almacenamiento';

const COLOR_BARRA: Record<PreferenciaTema, string> = {
  oscuro: '#1a1614',
  claro: '#faf6ef',
};

export function useTema() {
  const [tema, setTema] = useState<PreferenciaTema>(() =>
    typeof window === 'undefined' ? 'oscuro' : cargarTema(),
  );

  useEffect(() => {
    const raiz = document.documentElement;
    raiz.dataset.theme = tema === 'oscuro' ? 'dark' : 'light';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', COLOR_BARRA[tema]);
    guardarTema(tema);
  }, [tema]);

  const alternar = useCallback(() => {
    setTema((t) => (t === 'oscuro' ? 'claro' : 'oscuro'));
  }, []);

  return { tema, alternar } as const;
}
