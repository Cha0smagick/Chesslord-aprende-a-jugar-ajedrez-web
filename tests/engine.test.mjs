// Pruebas del motor de ajedrez de Chesslord.
// Perft contra valores de referencia publicados + reglas especiales + IA.
// Ejecutar:  node tests/engine.test.mjs
import { Board } from '../js/chesslogic.js';
import { ChessEngine } from '../js/chessai.js';
import { BLANCO, NEGRO } from '../js/chessconstants.js';

let fallos = 0;
let pruebas = 0;
function ok(nombre, condicion, extra = '') {
  pruebas++;
  if (!condicion) { fallos++; console.log(`  ✗ ${nombre} ${extra}`); }
}
function seccion(t) { console.log(`\n${t}`); }

/* ---------- utilidades ---------- */
const COLS = 'abcdefgh';
function sq(c, f) { return COLS[c] + (8 - f); }

function fromFEN(fen) {
  const [placement, turn, castling] = fen.split(' ');
  const board = new Board();
  board.grid = Array.from({ length: 8 }, () => Array(8).fill(' '));
  let f = 0, c = 0;
  for (const ch of placement) {
    if (ch === '/') { f++; c = 0; }
    else if (/\d/.test(ch)) c += Number(ch);
    else board.grid[f][c++] = ch;
  }
  if (board.castling) {
    for (const k of 'KQkq') board.castling[k] = castling.includes(k);
  } else {
    // API antigua: cada clave guarda "esta pieza ya se movió"
    board.castlingRights.K = !castling.includes('K');
    board.castlingRights.Q = !castling.includes('Q');
    board.castlingRights.R_H8 = !castling.includes('K');
    board.castlingRights.R_A8 = !castling.includes('Q');
    board.castlingRights.k = !castling.includes('k');
    board.castlingRights.q = !castling.includes('q');
    board.castlingRights.r_h1 = !castling.includes('k');
    board.castlingRights.r_a1 = !castling.includes('q');
  }
  return { board, turn: turn === 'w' ? BLANCO : NEGRO };
}

function perft(board, color, depth) {
  if (depth === 0) return 1;
  const moves = board.getLegalMoves(color);
  if (depth === 1) return moves.length;
  let n = 0;
  const rival = color === BLANCO ? NEGRO : BLANCO;
  for (const move of moves) {
    const memo = board.makeMove(move);
    n += perft(board, rival, depth - 1);
    board.undoMove(memo);
  }
  return n;
}

function mover(board, desde, hasta, color) {
  const move = [[COLS.indexOf(desde[0]), 8 - Number(desde[1])],
                [COLS.indexOf(hasta[0]), 8 - Number(hasta[1])]];
  const valido = board.isValidMove(move, color);
  if (valido) board.makeMove(move);
  return valido;
}

/* ---------- 1. Perft ---------- */
seccion('Perft (valores de referencia)');
const POSICIONES = [
  ['inicial', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', [20, 400, 8902, 197281]],
  ['Kiwipete', 'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1', [48, 2039, 97862]],
  ['finales', '8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1', [14, 191, 2812, 43238]],
  ['promociones', 'r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1', [6, 264, 9467]],
  ['posición 5', 'rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8', [44, 1486, 62379]],
  ['posición 6', 'r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10', [46, 2079, 89890]]
];
for (const [nombre, fen, esperado] of POSICIONES) {
  const { board, turn } = fromFEN(fen);
  esperado.forEach((valor, i) => {
    const t0 = performance.now();
    const obtenido = perft(board, turn, i + 1);
    const ms = (performance.now() - t0).toFixed(0);
    ok(`perft ${nombre} d${i + 1}`, obtenido === valor, `→ ${obtenido} (esperado ${valor}, ${ms} ms)`);
  });
}

/* ---------- 2. Reglas especiales ---------- */
seccion('Reglas especiales');

// Promoción: no debe lanzar y debe coronar dama
{
  const { board } = fromFEN('8/P7/8/8/8/8/8/K6k w - - 0 1');
  let lanzo = false;
  try { mover(board, 'a7', 'a8', BLANCO); } catch (e) { lanzo = true; }
  ok('promoción no lanza excepción', !lanzo);
  ok('promoción corona dama', board.grid[0][0] === 'Q', `→ ${board.grid[0][0]}`);
}

// Enroque: sin torre no se puede enrocar (derechos huérfanos)
{
  const { board } = fromFEN('4k3/8/8/8/8/8/8/R3K3 w Q - 0 1');
  board.grid[7][0] = ' ';
  ok('no enroca sin torre', !mover(board, 'e1', 'c1', BLANCO));
}
{
  const { board } = fromFEN('4k3/8/8/8/8/8/8/R3K3 w Q - 0 1');
  ok('enroque largo válido', mover(board, 'e1', 'c1', BLANCO));
  ok('rey en c1', board.grid[7][2] === 'K');
  ok('torre en d1', board.grid[7][3] === 'R');
}

// Enroque a través de casilla atacada (f1) prohibido
{
  const { board } = fromFEN('4kr2/8/8/8/8/8/8/4K2R w K - 0 1');
  ok('no enroca pasando por casilla atacada', !mover(board, 'e1', 'g1', BLANCO));
}
// Enroque con la torre atacada sí es legal
{
  const { board } = fromFEN('4k3/8/8/8/8/8/7r/4K2R w K - 0 1');
  mover(board, 'e1', 'g1', BLANCO);
  ok('enroque con torre amenazada es legal', board.grid[7][6] === 'K');
}

// Pérdida de derechos al mover el rey y volver
{
  const { board } = fromFEN('4k3/8/8/8/8/8/8/R3K2R w KQ - 0 1');
  mover(board, 'e1', 'e2', BLANCO);
  mover(board, 'e8', 'e7', NEGRO);
  mover(board, 'e2', 'e1', BLANCO);
  mover(board, 'e7', 'e8', NEGRO);
  ok('rey que vuelve pierde el enroque', !mover(board, 'e1', 'g1', BLANCO));
}

// Captura al paso
{
  const { board } = fromFEN('4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1');
  board.lastMove = { from: [3, 1], to: [3, 3], ep: [3, 2] };
  ok('captura al paso disponible', mover(board, 'e5', 'd6', BLANCO));
  ok('peón capturado eliminado', board.grid[3][3] === ' ');
}
// Captura al paso sólo en la jugada inmediata
{
  const { board } = fromFEN('4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1');
  board.lastMove = { from: [0, 0], to: [0, 1], ep: null };
  ok('captura al paso caducada no vale', !mover(board, 'e5', 'd6', BLANCO));
}

// Pieza clavada no puede moverse
{
  const { board } = fromFEN('4k3/4r3/8/8/8/8/4B3/4K3 w - - 0 1');
  ok('alfil clavado no se mueve', !mover(board, 'e2', 'd3', BLANCO));
}
// Jaque mate y ahogado
{
  const { board } = fromFEN('7k/6Q1/6K1/8/8/8/8/8 b - - 0 1');
  ok('mate detectado', board.isInCheck(NEGRO) && board.getLegalMoves(NEGRO).length === 0);
}
{
  const { board } = fromFEN('7k/5Q2/5K2/8/8/8/8/8 b - - 0 1');
  ok('ahogado detectado', !board.isInCheck(NEGRO) && board.getLegalMoves(NEGRO).length === 0);
}

/* ---------- 3. Notación ---------- */
seccion('Notación algebraica');
{
  const { board } = fromFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const san = (d, h) => {
    const move = [[COLS.indexOf(d[0]), 8 - Number(d[1])], [COLS.indexOf(h[0]), 8 - Number(h[1])]];
    return board.san ? board.san(move) : '';
  };
  ok('e2e4 = e4', san('e2', 'e4') === 'e4', `→ ${san('e2', 'e4')}`);
  ok('g1f3 = Nf3', san('g1', 'f3') === 'Nf3', `→ ${san('g1', 'f3')}`);
}

/* ---------- 4. IA ---------- */
seccion('IA');
async function probarIA() {
  // Mate en 1 con negras: la IA debe verlo (eval con signo correcto)
  {
    const { board } = fromFEN('6k1/5ppp/8/8/8/r7/5PPP/6K1 b - - 0 1');
    const engine = new ChessEngine(board, 'MEDIO');
    engine.setColorIA(NEGRO);
    const move = await engine.getBestMove();
    ok('IA negra encuentra mate en 1', !!move && move[1][0] === 0 && move[1][1] === 7,
      `→ ${move ? sq(...move[1]) : 'null'}`);
  }
  // Mate en 1 con blancas (posición espejo de la anterior)
  {
    const { board } = fromFEN('6k1/5ppp/8/8/8/R7/8/6K1 w - - 0 1');
    const engine = new ChessEngine(board, 'MEDIO');
    engine.setColorIA(BLANCO);
    const move = await engine.getBestMove();
    ok('IA blanca encuentra mate en 1', !!move && move[1][0] === 0 && move[1][1] === 0,
      `→ ${move ? sq(...move[1]) : 'null'}`);
  }
  // La IA nunca devuelve una jugada ilegal en la posición inicial
  {
    const { board } = fromFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    const engine = new ChessEngine(board, 'MEDIO');
    const move = await engine.getBestMove();
    ok('IA devuelve jugada legal', !!move && board.isValidMove(move, BLANCO));
  }
  // Presupuesto de tiempo
  for (const nivel of ['BASICO', 'MEDIO', 'MAESTRO']) {
    const { board } = fromFEN('r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3');
    const engine = new ChessEngine(board, nivel);
    engine.setColorIA(NEGRO);
    const t0 = performance.now();
    await engine.getBestMove();
    const ms = performance.now() - t0;
    ok(`${nivel} responde en < 7s`, ms < 7000, `→ ${ms.toFixed(0)} ms`);
    console.log(`    ${nivel}: ${ms.toFixed(0)} ms`);
  }
  // La IA debe usar el turno que le toca: si es negra no puede mover blancas
  {
    const { board } = fromFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1');
    const engine = new ChessEngine(board, 'BASICO');
    engine.setColorIA(NEGRO);
    const move = await engine.getBestMove();
    ok('IA negra mueve pieza negra', !!move && board.getColor(board.grid[move[0][1]][move[0][0]]) === NEGRO);
  }
}

await probarIA();

console.log(`\n${fallos === 0 ? '✅' : '❌'} ${pruebas - fallos}/${pruebas} pruebas correctas`);
process.exit(fallos === 0 ? 0 : 1);
