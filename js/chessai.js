// IA de ajedrez — puerto de ai.py (Chesslord) con 3 niveles
// Autor: ALEJANDRO QUINTERO RUIZ
import { VALOR_PIEZAS, PST, BLANCO, NEGRO } from './chessconstants.js';

const DIFICULTADES = {
  BASICO: 2,
  MEDIO: 4,
  MAESTRO: 6
};

export class ChessEngine {
  constructor(board, difficulty = 'MEDIO') {
    this.board = board;
    this.depth = DIFICULTADES[difficulty] || DIFICULTADES.MEDIO;
    this.colorIA = BLANCO; // la IA juega con las blancas por defecto
  }

  setColorIA(color) {
    this.colorIA = color;
  }

  getBestMove() {
    let bestMove = null;
    let bestValue = -99999;
    let alpha = -100000;
    let beta = 100000;

    const moves = this.board.getLegalMoves(this.colorIA);
    // Ordenamiento de jugadas: priorizar capturas para poda alfa-beta
    moves.sort((a, b) => this._scoreMove(b) - this._scoreMove(a));

    for (const move of moves) {
      const memo = this.board.makeMove(move);
      const boardValue = this._minimax(this.depth - 1, alpha, beta, false);
      this.board.undoMove(memo);
      if (boardValue > bestValue) {
        bestValue = boardValue;
        bestMove = move;
      }
      alpha = Math.max(alpha, bestValue);
    }
    return bestMove;
  }

  _scoreMove(move) {
    // Priorizar capturas para optimizar poda alfa-beta
    const [[, fO], [cD, fD]] = move;
    const target = this.board.grid[fD][cD];
    if (target !== ' ') {
      return VALOR_PIEZAS[target.toLowerCase()];
    }
    return 0;
  }

  _minimax(depth, alpha, beta, isMax) {
    if (depth === 0) {
      return this.evaluateBoard();
    }

    const color = isMax ? this.colorIA : (this.colorIA === BLANCO ? NEGRO : BLANCO);
    const moves = this.board.getLegalMoves(color);

    if (isMax) {
      let value = -100000;
      for (const move of moves) {
        const memo = this.board.makeMove(move);
        value = Math.max(value, this._minimax(depth - 1, alpha, beta, false));
        this.board.undoMove(memo);
        alpha = Math.max(alpha, value);
        if (beta <= alpha) break;
      }
      return value;
    } else {
      let value = 100000;
      for (const move of moves) {
        const memo = this.board.makeMove(move);
        value = Math.min(value, this._minimax(depth - 1, alpha, beta, true));
        this.board.undoMove(memo);
        beta = Math.min(beta, value);
        if (beta <= alpha) break;
      }
      return value;
    }
  }

  evaluateBoard() {
    let total = 0;
    for (let f = 0; f < 8; f++) {
      for (let c = 0; c < 8; c++) {
        const ficha = this.board.grid[f][c];
        if (ficha !== ' ') {
          const tipo = ficha.toUpperCase();
          const val = VALOR_PIEZAS[ficha.toLowerCase()];

          // Aplicar Piece-Square Tables para posicionamiento estratégico
          if (tipo in PST) {
            const filaPst = ficha === ficha.toUpperCase() ? f : 7 - f;
            total += PST[tipo][filaPst][c];
          }

          total += ficha === ficha.toUpperCase() ? val : -val;
        }
      }
    }
    return total;
  }
}

export { DIFICULTADES };
