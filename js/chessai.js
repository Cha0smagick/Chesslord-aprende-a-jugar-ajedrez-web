// IA de ajedrez (Chesslord) — negamax con poda alfa-beta, ordenación de jugadas,
// búsqueda de capturas (quiescence) y profundización iterativa con límite de tiempo.
// Autor: ALEJANDRO QUINTERO RUIZ
import { VALOR_PIEZAS, PST, BLANCO, NEGRO } from './chessconstants.js';

const DIFICULTADES = {
  // BASICO juega a un nivel débil de verdad: poca profundidad y errores deliberados.
  BASICO: { depth: 1, timeMs: 400, random: 0.3, quiesce: false },
  MEDIO: { depth: 3, timeMs: 1200, random: 0, quiesce: true },
  MAESTRO: { depth: 6, timeMs: 4000, random: 0, quiesce: true }
};

const MATE = 100000;
const INF = 1e9;
const ABORT = Symbol('abort');

const rival = (color) => (color === BLANCO ? NEGRO : BLANCO);
const ahora = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

export class ChessEngine {
  constructor(board, difficulty = 'MEDIO') {
    this.board = board;
    this.nivel = DIFICULTADES[difficulty] ? difficulty : 'MEDIO';
    this.cfg = DIFICULTADES[this.nivel];
    this.colorIA = BLANCO;
    this._limite = 0;
    this._nodos = 0;
    this._token = 0; // cada búsqueda nueva invalida la anterior
  }

  setColorIA(color) {
    this.colorIA = color;
  }

  setDifficulty(difficulty) {
    this.nivel = DIFICULTADES[difficulty] ? difficulty : 'MEDIO';
    this.cfg = DIFICULTADES[this.nivel];
  }

  // Marca como obsoleta la búsqueda en curso (su resultado se descarta).
  cancelar() {
    this._token++;
  }

  async getBestMove() {
    const movimientos = this.board.getLegalMoves(this.colorIA);
    if (movimientos.length === 0) return null;

    // Nivel básico: a veces juega una jugada al azar, como un principiante.
    if (this.cfg.random > 0 && Math.random() < this.cfg.random) {
      return movimientos[Math.floor(Math.random() * movimientos.length)];
    }

    const token = ++this._token;
    this._limite = ahora() + this.cfg.timeMs;
    this._nodos = 0;
    let mejor = movimientos[0];

    for (let profundidad = 1; profundidad <= this.cfg.depth; profundidad++) {
      let resultado;
      try {
        resultado = this._raiz(profundidad, token);
      } catch (e) {
        if (e === ABORT) break;
        throw e;
      }
      if (resultado.mejor) mejor = resultado.mejor;
      if (resultado.valor >= MATE - 100) break;
      // Cede el hilo para que la interfaz pinte el estado "pensando".
      await new Promise((res) => setTimeout(res, 0));
      if (token !== this._token || ahora() > this._limite) break;
    }
    return mejor;
  }

  _raiz(profundidad, token) {
    const movimientos = this._ordenar(this.board.getLegalMoves(this.colorIA));
    const yo = this.colorIA;
    let alpha = -INF;
    let mejor = null;
    let valorMejor = -INF;

    for (const movimiento of movimientos) {
      const memo = this.board.makeMove(movimiento);
      let valor;
      try {
        valor = -this._negamax(profundidad - 1, -INF, -alpha, rival(yo), 1, token);
      } finally {
        this.board.undoMove(memo);
      }
      if (valor > valorMejor) {
        valorMejor = valor;
        mejor = movimiento;
      }
      if (valor > alpha) alpha = valor;
    }
    return { mejor, valor: valorMejor };
  }

  _negamax(profundidad, alpha, beta, color, ply, token) {
    if ((++this._nodos & 1023) === 0 && (token !== this._token || ahora() > this._limite)) throw ABORT;

    if (profundidad <= 0) {
      return this.cfg.quiesce
        ? this._quiescence(alpha, beta, color, 0, token)
        : this._evaluar(color);
    }

    const movimientos = this._ordenar(this.board.getLegalMoves(color));
    if (movimientos.length === 0) {
      return this.board.isInCheck(color) ? -(MATE - ply) : 0;
    }

    let mejor = -INF;
    for (const movimiento of movimientos) {
      const memo = this.board.makeMove(movimiento);
      let valor;
      try {
        valor = -this._negamax(profundidad - 1, -beta, -alpha, rival(color), ply + 1, token);
      } finally {
        this.board.undoMove(memo);
      }
      if (valor > mejor) mejor = valor;
      if (mejor > alpha) alpha = mejor;
      if (alpha >= beta) break;
    }
    return mejor;
  }

  // Sólo capturas y coronaciones, para no evaluar posiciones con material colgando.
  _quiescence(alpha, beta, color, qdepth, token) {
    if ((++this._nodos & 1023) === 0 && (token !== this._token || ahora() > this._limite)) throw ABORT;

    const reposo = this._evaluar(color);
    if (reposo >= beta) return beta;
    if (reposo > alpha) alpha = reposo;
    if (qdepth >= 4) return alpha;

    const tacticas = this.board.getLegalMoves(color).filter((m) => {
      const objetivo = this.board.grid[m[1][1]][m[1][0]];
      return objetivo !== ' ' || m[2];
    });

    for (const movimiento of this._ordenar(tacticas)) {
      const memo = this.board.makeMove(movimiento);
      let valor;
      try {
        valor = -this._quiescence(-beta, -alpha, rival(color), qdepth + 1, token);
      } finally {
        this.board.undoMove(memo);
      }
      if (valor >= beta) return beta;
      if (valor > alpha) alpha = valor;
    }
    return alpha;
  }

  _evaluar(color) {
    return color === BLANCO ? this.evaluateBoard() : -this.evaluateBoard();
  }

  // Ordena por valor de captura menos valor del atacante (MVV-LVA) y coronaciones.
  _ordenar(movimientos) {
    for (const m of movimientos) m.score = this._scoreMove(m);
    return movimientos.sort((a, b) => b.score - a.score);
  }

  _scoreMove(movimiento) {
    const [[cO, fO], [cD, fD]] = movimiento;
    const atacante = this.board.grid[fO][cO];
    const objetivo = this.board.grid[fD][cD];
    let score = 0;
    if (objetivo !== ' ') {
      score = 10 * VALOR_PIEZAS[objetivo.toLowerCase()] - VALOR_PIEZAS[atacante.toLowerCase()];
    }
    const tipo = atacante.toLowerCase();
    if (tipo === 'p' && (fD === 0 || fD === 7)) score += 9000;
    return score;
  }

  // Puntuación desde el punto de vista de las blancas (positivo = mejores blancas).
  evaluateBoard() {
    let total = 0;
    for (let f = 0; f < 8; f++) {
      const fila = this.board.grid[f];
      for (let c = 0; c < 8; c++) {
        const ficha = fila[c];
        if (ficha === ' ') continue;
        const blanca = ficha === ficha.toUpperCase();
        const tipo = ficha.toLowerCase();
        const tabla = PST[tipo.toUpperCase()];
        // Las tablas están escritas desde el lado blanco: se reflejan para negras.
        const posicional = tabla ? tabla[blanca ? f : 7 - f][c] : 0;
        const valor = VALOR_PIEZAS[tipo] + posicional;
        total += blanca ? valor : -valor;
      }
    }
    return total;
  }
}

export { DIFICULTADES };
