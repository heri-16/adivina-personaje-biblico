# Adivina el Personaje Bíblico

Juego web **mobile-first** y **offline-first** para adivinar personajes bíblicos a
partir de cinco pistas que van de la más vaga a la más concreta. Cuanto antes
aciertes, más puntos. Sin backend, sin API externa: todo corre en el navegador y
funciona sin conexión una vez instalado.

Dirección estética: _manuscrito iluminado moderno_ — pergamino profundo, dorado
envejecido, tinta sepia, tipografía serif con carácter (Fraunces) y sans
geométrica (Inter). Modo oscuro por defecto, con toggle a claro.

---

## Requisitos

- Node.js 18+ (probado con Node 24)
- npm

## Desarrollo

```bash
npm install
npm run dev
```

Abre la URL que imprime Vite (por defecto `http://localhost:5173`).

> Si tu `npm` usa `allow-scripts`, aprueba el script de instalación de esbuild:
> `npm approve-scripts esbuild` (ya queda registrado en `package.json`).

## Build de producción

```bash
npm run build      # comprueba tipos (tsc -b) y genera dist/
npm run preview    # sirve dist/ localmente para probar la PWA
```

El build genera el service worker y el manifest (via `vite-plugin-pwa`), y
precachea el HTML, el JS/CSS y las fuentes `.woff2`, de modo que la app abre y se
juega **sin red**. Para instalarla, ábrela en Chrome/Safari móvil y usa
"Añadir a pantalla de inicio".

## Otros scripts

| Script | Qué hace |
| --- | --- |
| `npm run typecheck` | Solo comprobación de tipos |
| `npm run validar-datos` | Verifica `src/data/personajes.ts` (nº de fichas, formato de citas, versión RV1909, que ninguna pista nombre al personaje, etc.) |
| `npm run iconos` | Regenera los PNG del PWA en `public/icons/` (sin dependencias) |

---

## Cómo se juega

1. Aparece **una** pista. Escribe tu respuesta en el campo inferior.
2. **Otra pista** revela la siguiente (máximo 5).
3. Puntos según cuántas pistas hayan hecho falta: **100 / 80 / 60 / 40 / 20**.
4. La respuesta se normaliza (minúsculas, sin tildes, sin espacios de sobra) y se
   compara contra el nombre y sus alias, tolerando **distancia de Levenshtein ≤ 2**
   para erratas.
5. Acierto → confeti + cita bíblica y dato curioso. Fallo → sacudida sutil y
   puedes reintentar o pedir pista.

### Modos

- **Clásico** — 10 personajes al azar.
- **Contrarreloj** — 60 segundos, los que puedas.
- **Por nivel** — 10 personajes de dificultad Fácil, Medio o Difícil. La
  dificultad está fijada personaje a personaje según lo conocido que sea (Adán,
  Moisés, David… son Fácil; Onésimo, Jael, Habacuc… son Difícil).
- **Por categoría** — profetas, reyes, mujeres, apóstoles o Nuevo Testamento.
- **Estudio** — todas las fichas, con buscador y filtros. Incluye el filtro
  **"Grupo de jóvenes"**: personajes cuya historia de joven o de niño es lo más
  recordado de ellos (David, Timoteo, Samuel, José, Daniel, Ester, Rut…).

### Progreso

`localStorage` guarda racha diaria, mejores puntajes, precisión, promedio de
pistas por acierto, historial de partidas y qué personajes tienes "dominados"
(acertados al menos una vez). Todo se puede borrar desde _Estadísticas_.

---

## Estructura del proyecto

```
ADIVINA-PERSONAJE/
├─ index.html                 # entrada; data-theme + meta theme-color
├─ vite.config.ts             # React + PWA (manifest, workbox, precache de fuentes)
├─ tailwind.config.js         # tokens: colores pergamino/dorado/oliva/terracota, serif/sans
├─ postcss.config.js
├─ tsconfig*.json             # TS estricto (noUncheckedIndexedAccess, etc.)
├─ scripts/
│  ├─ gen-icons.mjs           # genera los PNG del PWA sin dependencias
│  └─ validar-datos.ts        # comprobaciones sobre el dataset
├─ public/
│  ├─ favicon.svg
│  └─ icons/                  # icon-192 / icon-512 / icon-512-maskable
└─ src/
   ├─ main.tsx                # bootstrap React + registro del service worker
   ├─ App.tsx                 # navegación entre pantallas (con botón atrás)
   ├─ index.css               # tokens CSS, textura de papel (noise SVG), utilidades
   ├─ types.ts                # Personaje, Modo, Estadisticas, RondaResultado…
   ├─ data/
   │  └─ personajes.ts        # ~250 personajes (base 40/20/25/15 + ampliación);
   │                          #   citas y frases según Reina-Valera 1909
   ├─ lib/
   │  ├─ texto.ts             # normalizar() + levenshtein() + validarRespuesta()
   │  ├─ puntaje.ts           # 100/80/60/40/20
   │  ├─ aleatorio.ts         # barajar() / muestra()
   │  ├─ fecha.ts             # claveDia() / diasEntre()  (racha diaria)
   │  ├─ confeti.ts           # confeti sobrio (canvas-confetti)
   │  └─ almacenamiento.ts    # wrapper de localStorage (stats, historial, tema)
   ├─ hooks/
   │  ├─ useTema.ts           # oscuro/claro persistente; ajusta data-theme y theme-color
   │  ├─ useEstadisticas.ts   # stats derivadas + racha + registro de partidas
   │  ├─ useJuego.ts          # máquina de estado de la partida (rondas, pistas, timer)
   │  └─ useAlturaVisual.ts   # visualViewport: el input sube con el teclado
   ├─ components/
   │  ├─ Encabezado.tsx       # cabecera sticky con botón atrás + toggle de tema
   │  ├─ BotonTema.tsx
   │  ├─ Marcador.tsx         # ronda / puntos / cronómetro + barra fina
   │  ├─ PilaPistas.tsx       # pistas como capas apiladas de pergamino (framer-motion)
   │  ├─ CampoRespuesta.tsx   # barra inferior fija: input 16px, "otra pista", "me rindo"
   │  ├─ ResultadoRonda.tsx   # acierto/fallo + cita + dato + confeti
   │  ├─ TarjetaModo.tsx
   │  ├─ SelectorCategoria.tsx
   │  └─ FichaEstudio.tsx     # ficha desplegable del modo estudio
   └─ pantallas/
      ├─ Inicio.tsx           # portada: hero, racha, selección de modo
      ├─ Juego.tsx            # pantalla de partida (layout que se adapta al teclado)
      ├─ Resumen.tsx          # fin de partida: puntuación y desglose por ronda
      ├─ Estudio.tsx          # todas las fichas con buscador y filtros
      └─ Estadisticas.tsx     # racha, métricas, historial y borrado de datos
```

## Notas de diseño móvil

- Diseñado a 375 px, verificado hasta 430 px; sin scroll horizontal.
- `env(safe-area-inset-*)` en cabecera y barra inferior (utilidades `.safe-top` /
  `.safe-bottom`).
- Objetivos táctiles ≥ 48×48 px (`.tap`); nada depende solo de `hover`.
- Inputs a 16px como mínimo para evitar el zoom automático de iOS.
- Animaciones solo con `transform` / `opacity`, easing suave sin rebote; se
  respeta `prefers-reduced-motion`.
- El campo de respuesta sube con el teclado usando `visualViewport`
  (`useAlturaVisual`), sin tapar la última pista.
