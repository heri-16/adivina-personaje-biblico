/**
 * Comprobaciones sobre src/data/personajes.ts:
 *  - al menos 100 personajes, ids unicos
 *  - cada pistas tiene exactamente 5 entradas no vacias
 *  - el nombre del personaje no aparece en sus propias pistas
 *  - cita con formato de referencia y version = Reina-Valera 1909
 *  - se mantienen los minimos de reparto de la version original
 * Ejecutar:  node --experimental-strip-types scripts/validar-datos.ts
 */
import { personajes } from '../src/data/personajes.ts';

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

let errores = 0;
const fail = (msg: string) => {
  errores++;
  console.error('  ✗ ' + msg);
};

// Total.
if (personajes.length < 100) fail(`total = ${personajes.length}, se esperaban >= 100`);
console.log(`Total de personajes: ${personajes.length}`);

// Ids unicos.
const ids = new Set<string>();
for (const p of personajes) {
  if (ids.has(p.id)) fail(`id duplicado: ${p.id}`);
  ids.add(p.id);
}

for (const p of personajes) {
  if (p.pistas.length !== 5) fail(`${p.id}: ${p.pistas.length} pistas`);
  p.pistas.forEach((pi, i) => {
    if (!pi || pi.trim().length < 15) fail(`${p.id}: pista ${i + 1} demasiado corta`);
  });
  if (!/\d/.test(p.cita)) fail(`${p.id}: cita sin numero -> "${p.cita}"`);
  if (!/^[1-3]?\s?[A-Za-zÁÉÍÓÚáéíóúñ]+(?: [A-Za-zÁÉÍÓÚáéíóúñ]+)? \d+(?::\d+)?$/.test(p.cita))
    fail(`${p.id}: formato de cita inusual -> "${p.cita}"`);
  if (p.version !== 'Reina-Valera 1909') fail(`${p.id}: version = "${p.version}"`);
  if (!p.dato || p.dato.length < 20) fail(`${p.id}: dato demasiado corto`);

  // El nombre propio (y palabras del nombre de 4+ letras) no debe salir en las pistas.
  const tokens = norm(p.nombre)
    .split(' ')
    .filter((w) => w.length >= 4 && !['hijo', 'mayor'].includes(w));
  const blob = norm(p.pistas.join(' '));
  for (const t of tokens) {
    if (new RegExp(`\\b${t}\\b`).test(blob)) {
      fail(`${p.id}: la pista contiene el nombre "${t}"`);
    }
  }
}

// Distribucion.
const cuenta = (f: (p: (typeof personajes)[number]) => boolean) =>
  personajes.filter(f).length;

const atNoProfetaNoMujer = cuenta(
  (p) => p.testamento === 'AT' && p.categoria !== 'profeta' && p.categoria !== 'mujer',
);
const profetas = cuenta((p) => p.categoria === 'profeta');
const nt = cuenta((p) => p.testamento === 'NT' && p.categoria !== 'mujer');
const mujeres = cuenta((p) => p.categoria === 'mujer');

console.log('\nDistribucion:');
console.log(`  AT (patriarca/juez/rey/otro): ${atNoProfetaNoMujer}  (minimo 40)`);
console.log(`  Profetas:                     ${profetas}  (minimo 20)`);
console.log(`  NT (no mujer):                ${nt}  (minimo 25)`);
console.log(`  Mujeres:                      ${mujeres}  (minimo 15)`);
if (atNoProfetaNoMujer < 40) fail('AT patriarca/juez/rey < 40');
if (profetas < 20) fail('profetas < 20');
if (nt < 25) fail('NT < 25');
if (mujeres < 15) fail('mujeres < 15');

const dif = { 1: 0, 2: 0, 3: 0 } as Record<number, number>;
for (const p of personajes) dif[p.dificultad]++;
console.log(`  Dificultad 1/2/3:              ${dif[1]} / ${dif[2]} / ${dif[3]}`);

if (errores === 0) {
  console.log('\n✓ Todos los datos son validos.\n');
  process.exit(0);
} else {
  console.error(`\n✗ ${errores} problema(s) encontrados.\n`);
  process.exit(1);
}
