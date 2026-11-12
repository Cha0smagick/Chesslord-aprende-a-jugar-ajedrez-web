// Utilidades de posición — Chesslord
// FEN → tablero, SAN → movimiento legal, secuencia de jugadas → tablero.
// Autor: ALEJANDRO QUINTERO RUIZ
import { Board } from './chesslogic.js';
import { BLANCO, NEGRO } from './chessconstants.js';

const PIEZAS = 'pnbrqkPNBRQK';

// Convierte la parte de piezas de un FEN en grid[fila][columna] (fila 0 = rango 8).
export function gridDesdeFen(fen) {
  const campo = String(fen).trim().split(/\s+/)[0];
  const filas = campo.split('/');
  if (filas.length !== 8) throw new Error(`FEN inválido: ${fen}`);

  return filas.map((fila) => {
    const out = [];
    for (const ch of fila) {
      if (ch >= '1' && ch <= '8') {
        for (let i = 0; i < Number(ch); i++) out.push(' ');
      } else if (PIEZAS.includes(ch)) {
        out.push(ch);
      } else {
        throw new Error(`FEN inválido: ${fen}`);
      }
    }
    if (out.length !== 8) throw new Error(`Fila inválida en FEN «${fen}»: ${fila}`);
    return out;
  });
}

// Busca el movimiento legal cuya notación coincide con `san` (ignora +, #, !, ?).
export function buscarSan(board, san, color) {
  const limpio = (s) => s.replace(/[+#!?]/g, '');
  const objetivo = limpio(san);
  return board.getLegalMoves(color).find((m) => limpio(board.san(m)) === objetivo) || null;
}

// Construye la posición de un ejercicio: por FEN o por una secuencia SAN desde el inicio.
export function cargarPosicion({ fen, previas = [], turno }) {
  const board = new Board();
  let color = BLANCO;

  if (fen) {
    board.grid = gridDesdeFen(fen);
    color = String(fen).trim().split(/\s+/)[1] === 'b' ? NEGRO : BLANCO;
  } else {
    for (const san of previas) {
      const move = buscarSan(board, san, color);
      if (!move) throw new Error(`Jugada ilegal «${san}» en la secuencia previa`);
      board.makeMove(move);
      color = color === BLANCO ? NEGRO : BLANCO;
    }
  }

  return { board, turno: turno || color };
}
