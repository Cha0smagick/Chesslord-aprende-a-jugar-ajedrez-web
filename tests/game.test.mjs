// Pruebas del controlador de partida (sin navegador).
// Ejecutar:  node tests/game.test.mjs
import { ChessGame } from '../js/game.js';
import { BLANCO, NEGRO } from '../js/chessconstants.js';

let fallos = 0;
let pruebas = 0;
function ok(nombre, condicion, extra = '') {
  pruebas++;
  if (!condicion) { fallos++; console.log(`  ✗ ${nombre} ${extra}`); }
}
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function esperarIA(game, limite = 8000) {
  const t0 = Date.now();
  await espera(400); // deja pasar la pausa de "pensando"
  while (game._iaOcupada && Date.now() - t0 < limite) await espera(20);
}

// Convierte "g1f3" en move del motor.
const COLS = 'abcdefgh';
function m(desde, hasta) {
  return [[COLS.indexOf(desde[0]), 8 - Number(desde[1])],
          [COLS.indexOf(hasta[0]), 8 - Number(hasta[1])]];
}

console.log('\nControlador de partida');

/* 1. La IA abre sola cuando el humano juega negras */
{
  const game = new ChessGame(() => {});
  ok('turno inicial blancas', game.turn === BLANCO);
  ok('humano por defecto negras', game.humanColor === NEGRO);
  await esperarIA(game);
  ok('la IA abrió automáticamente', game.moveHistory.length === 1, `→ ${game.moveHistory.length}`);
  ok('tras abrir la IA mueve el humano', game.turn === NEGRO);
  ok('la jugada tiene notación', /^[a-hNBRQKO]/.test(game.moveHistory[0].san || ''),
    `→ ${game.moveHistory[0] && game.moveHistory[0].san}`);
  game.reiniciar();
  await esperarIA(game);
  ok('al reiniciar la IA vuelve a abrir', game.moveHistory.length === 1);
}

/* 2. Deshacer devuelve el turno al humano y no congela la partida */
{
  const game = new ChessGame(() => {});
  await esperarIA(game); // 1 jugada de la IA

  const legales = game.board.getLegalMoves(NEGRO);
  const jugada = legales.find((mv) => mv[0][1] === 6 && mv[1][1] === 4) || legales[0];
  ok('humano puede mover', game.tryMove(jugada));
  await esperarIA(game); // la IA responde -> 3 jugadas
  ok('la IA respondió', game.moveHistory.length === 3, `→ ${game.moveHistory.length}`);
  ok('turno del humano', game.turn === NEGRO);

  ok('deshacer funciona', game.deshacer());
  ok('deshacer deja 1 jugada', game.moveHistory.length === 1, `→ ${game.moveHistory.length}`);
  ok('deshacer devuelve el turno al humano', game.turn === NEGRO);
  ok('el humano puede volver a mover tras deshacer',
    game.board.getLegalMoves(NEGRO).length > 0 && game.turn === game.humanColor);

  // Sin jugada propia que retirar no se puede deshacer
  ok('no deshace si no hay nada propio', !game.deshacer());
  game.reiniciar();
}

/* 3. Cambiar de color reinicia y no dispara la IA si abre el humano */
{
  const game = new ChessGame(() => {});
  await esperarIA(game);
  game.setHumanColor(BLANCO);
  await espera(700);
  ok('cambio de color reinicia', game.moveHistory.length === 0);
  ok('con blancas abre el humano', game.turn === BLANCO);
  ok('la IA no mueve en turno del humano', !game._iaOcupada);
}

/* 4. Cambiar el nivel no reinicia la partida */
{
  const game = new ChessGame(() => {});
  game._moverIA = () => {}; // aislamos la IA
  game._executeMove(m('e2', 'e4'));
  const antes = game.moveHistory.length;
  game.setLevel('MAESTRO');
  ok('cambiar nivel conserva la posición', game.moveHistory.length === antes && game.level === 'MAESTRO');
}

/* 5. Detección de resultados */
{
  const game = new ChessGame(() => {});
  game._moverIA = () => {};
  // Mate del pastor simplificado: blancas dan mate en una
  game.board.grid = [
    [' ', ' ', ' ', ' ', 'k', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', 'p', 'p', 'p'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', 'P', 'P', 'P'],
    [' ', ' ', ' ', ' ', ' ', ' ', 'K', ' ']
  ];
  game.turn = BLANCO;
  ok('no hay tablas por material con peones', !game._materialInsuficiente());

  // Repetición triple: caballos ida y vuelta
  const g2 = new ChessGame(() => {});
  g2._moverIA = () => {};
  const ciclo = [m('g1', 'f3'), m('g8', 'f6'), m('f3', 'g1'), m('f6', 'g8')];
  for (let i = 0; i < 8; i++) g2._executeMove(ciclo[i % 4]);
  ok('tablas por repetición triple', g2.gameOver && g2.result === 'repeticion', `→ ${g2.result}`);
}

/* 6. Material insuficiente */
{
  const game = new ChessGame(() => {});
  game.board.grid = [
    [' ', ' ', ' ', ' ', 'k', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', 'K', ' ', ' ', ' ']
  ];
  ok('rey contra rey son tablas', game._materialInsuficiente());

  game.board.grid[5][5] = 'B'; // alfil blanco
  ok('rey y alfil contra rey son tablas', game._materialInsuficiente());

  game.board.grid[3][2] = 'b'; // alfil negro en otra diagonal (distinto color de casilla)
  ok('dos alfiles de distinto color no son tablas', !game._materialInsuficiente());

  game.board.grid[3][2] = ' ';
  game.board.grid[3][3] = 'n'; // caballo negro
  ok('alfil contra caballo no son tablas', !game._materialInsuficiente());
}

console.log(`\n${fallos === 0 ? '✅' : '❌'} ${pruebas - fallos}/${pruebas} pruebas correctas`);
process.exit(fallos === 0 ? 0 : 1);
