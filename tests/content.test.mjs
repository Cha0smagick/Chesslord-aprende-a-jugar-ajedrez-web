// Verificación del contenido — Chesslord.
// Cada lección, ejercicio y apertura se carga con el motor real: si una
// posición es ilegal o una jugada no existe, esta prueba falla.
// Ejecutar:  node tests/content.test.mjs
import { CURSO_MODULOS } from '../js/course-data.js';
import { EJERCICIOS, CATEGORIAS } from '../js/training-data.js';
import { APERTURAS } from '../js/openings-data.js';
import { Puzzle } from '../js/puzzle.js';
import { Linea } from '../js/linea.js';
import { cargarPosicion, gridDesdeFen } from '../js/posicion.js';

let fallos = 0;
let pruebas = 0;
const ok = (nombre, condicion, extra = '') => {
  pruebas++;
  if (!condicion) { fallos++; console.log(`  FALLO: ${nombre} ${extra}`); }
};

const cuentaReyes = (grid) => grid.flat().filter((p) => p === 'k' || p === 'K').length;

const verificarPuzzle = (def, etiqueta) => {
  ok(`${etiqueta}: jugada declarada`, typeof def.jugada === 'string' && def.jugada.length > 0);
  ok(`${etiqueta}: pista`, typeof def.pista === 'string' && def.pista.length > 0);
  ok(`${etiqueta}: explicación`, typeof def.explicacion === 'string' && def.explicacion.length > 0);
  try {
    const puzzle = new Puzzle(def);
    ok(`${etiqueta}: dos reyes`, cuentaReyes(puzzle.grid) === 2);
    ok(`${etiqueta}: solución resuelta`, !!puzzle.solucion);
    ok(`${etiqueta}: coordenadas dentro del tablero`,
      puzzle.solucion.slice(0, 2).every(([c, f]) => c >= 0 && c <= 7 && f >= 0 && f <= 7));
  } catch (e) {
    fallos++;
    pruebas++;
    console.log(`  FALLO: ${etiqueta} → ${e.message}`);
  }
};

console.log('Curso');
const idsCurso = new Set();
for (const modulo of CURSO_MODULOS) {
  ok(`módulo ${modulo.id}: libro y autor`, !!modulo.libro && !!modulo.autor);
  ok(`módulo ${modulo.id}: lecciones`, modulo.lecciones.length >= 1);
  for (const leccion of modulo.lecciones) {
    ok(`lección ${leccion.id}: id único`, !idsCurso.has(leccion.id) && !!leccion.id);
    idsCurso.add(leccion.id);
    verificarPuzzle(leccion, `lección ${leccion.id}`);
  }
}

console.log('Entrenamiento');
const idsEntreno = new Set();
for (const ej of EJERCICIOS) {
  ok(`ejercicio ${ej.id}: id único`, !idsEntreno.has(ej.id) && !!ej.id);
  idsEntreno.add(ej.id);
  ok(`ejercicio ${ej.id}: categoría válida`, CATEGORIAS.includes(ej.categoria), `(${ej.categoria})`);
  verificarPuzzle(ej, `ejercicio ${ej.id}`);
}

console.log('Aperturas');
const idsAperturas = new Set();
for (const op of APERTURAS) {
  ok(`apertura ${op.id}: id único`, !idsAperturas.has(op.id) && !!op.id);
  idsAperturas.add(op.id);
  ok(`apertura ${op.id}: jugadas`, op.jugadas.length >= 2);
  ok(`apertura ${op.id}: comentarios`,
    op.jugadas.every((j) => typeof j.san === 'string' && typeof j.comentario === 'string' && j.comentario.length > 0));
  try {
    const linea = new Linea(op);
    let guarda = 0;
    while (!linea.terminada && guarda++ < 100) linea.verJugada();
    ok(`apertura ${op.id}: línea completa`, linea.idx === op.jugadas.length, `(${linea.idx}/${op.jugadas.length})`);
    ok(`apertura ${op.id}: dos reyes`, cuentaReyes(linea.grid) === 2);
  } catch (e) {
    fallos++;
    pruebas++;
    console.log(`  FALLO: apertura ${op.id} → ${e.message}`);
  }
}

console.log('Utilidades');
try {
  const grid = gridDesdeFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  ok('FEN inicial: 8 filas', grid.length === 8);
  ok('FEN inicial: 64 casillas', grid.every((f) => f.length === 8));
  ok('FEN inicial: reyes', cuentaReyes(grid) === 2);
} catch (e) {
  fallos++;
  pruebas++;
  console.log(`  FALLO: FEN inicial → ${e.message}`);
}

const invalido = (fen) => {
  try { gridDesdeFen(fen); return false; } catch { return true; }
};
ok('FEN con 7 filas se rechaza', invalido('8/8/8/8/8/8/8'));
ok('FEN con fila corta se rechaza', invalido('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP w - - 0 1'));
ok('FEN con carácter raro se rechaza', invalido('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNX w - - 0 1'));

// La posición de un ejercicio debe ser alcanzable por la secuencia declarada.
try {
  const { board } = cargarPosicion({ previas: ['e4', 'e5', 'Nf3', 'Nc6'] });
  ok('secuencia previa: piezas colocadas', board.grid[4][4] === 'P' && board.grid[3][4] === 'p' && board.grid[5][5] === 'N');
} catch (e) {
  fallos++;
  pruebas++;
  console.log(`  FALLO: secuencia previa → ${e.message}`);
}

console.log(fallos === 0 ? `\n✅ ${pruebas}/${pruebas} pruebas correctas` : `\n❌ ${fallos} fallos de ${pruebas} pruebas`);
process.exit(fallos === 0 ? 0 : 1);
