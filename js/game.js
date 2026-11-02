// Controlador de partida — une motor de reglas + IA + niveles
// Autor: ALEJANDRO QUINTERO RUIZ
import { Board } from './chesslogic.js';
import { ChessEngine, DIFICULTADES } from './chessai.js';
import { BLANCO, NEGRO } from './chessconstants.js';

export class ChessGame {
  constructor(onStateChange) {
    this.board = new Board();
    this.engine = new ChessEngine(this.board, 'MEDIO');
    this.turn = BLANCO; // blancas mueven primero
    this.onStateChange = onStateChange; // callback para notificar a la UI
    this.gameOver = false;
    this.result = null; // 'mate', 'ahogado', null
    this.winner = null; // 'blanco', 'negro', null
    this.moveHistory = [];
    this.level = 'MEDIO'; // BASICO | MEDIO | MAESTRO
    this.humanColor = NEGRO; // el humano juega con negras por defecto
  }

  setLevel(level) {
    this.level = level;
    this.engine = new ChessEngine(this.board, level);
    this.engine.setColorIA(this.humanColor === BLANCO ? NEGRO : BLANCO);
  }

  setHumanColor(color) {
    this.humanColor = color;
    this.engine.setColorIA(color === BLANCO ? NEGRO : BLANCO);
    this.turn = BLANCO;
  }

  getState() {
    return {
      grid: this.board.grid.map(row => [...row]),
      turn: this.turn,
      gameOver: this.gameOver,
      result: this.result,
      winner: this.winner,
      level: this.level,
      moveHistory: [...this.moveHistory],
      inCheck: this.board.isInCheck(this.turn),
      legalMoves: this.board.getLegalMoves(this.turn)
    };
  }

  // Intenta ejecutar un movimiento. Devuelve true si se ejecutó.
  tryMove(move) {
    if (this.gameOver) return false;
    if (this.turn !== this.humanColor) return false; // no es turno del humano

    if (!this.board.isValidMove(move, this.turn)) return false;

    return this._executeMove(move);
  }

  // Ejecuta un movimiento (humano o IA) y avanza el turno.
  _executeMove(move) {
    const memo = this.board.makeMove(move);
    this.moveHistory.push({ move, memo });
    this.turn = this.turn === BLANCO ? NEGRO : BLANCO;

    // Detectar fin de partida
    const legal = this.board.getLegalMoves(this.turn);
    if (legal.length === 0) {
      this.gameOver = true;
      if (this.board.isInCheck(this.turn)) {
        this.result = 'mate';
        this.winner = this.turn === BLANCO ? NEGRO : BLANCO;
      } else {
        this.result = 'ahogado';
        this.winner = null;
      }
    }

    if (this.onStateChange) this.onStateChange(this.getState());
    return true;
  }

  // Turno de la IA. Devuelve true si la IA movió.
  async iaMove() {
    if (this.gameOver) return false;
    if (this.turn !== this.engine.colorIA) return false;

    // Pequeña pausa para que se vea que la IA "piensa"
    await new Promise(resolve => setTimeout(resolve, 400));

    const move = this.engine.getBestMove();
    if (!move) {
      // La IA no tiene jugadas: fin de partida
      const legal = this.board.getLegalMoves(this.turn);
      if (legal.length === 0) {
        this.gameOver = true;
        this.result = this.board.isInCheck(this.turn) ? 'mate' : 'ahogado';
        this.winner = this.result === 'mate' ? (this.turn === BLANCO ? NEGRO : BLANCO) : null;
        if (this.onStateChange) this.onStateChange(this.getState());
      }
      return false;
    }

    return this._executeMove(move);
  }

  reiniciar() {
    this.board = new Board();
    this.engine = new ChessEngine(this.board, this.level);
    this.engine.setColorIA(this.humanColor === BLANCO ? NEGRO : BLANCO);
    this.turn = BLANCO;
    this.gameOver = false;
    this.result = null;
    this.winner = null;
    this.moveHistory = [];
    if (this.onStateChange) this.onStateChange(this.getState());
  }

  deshacer() {
    if (this.moveHistory.length === 0) return false;
    const last = this.moveHistory.pop();
    this.board.undoMove(last.memo);
    this.turn = this.turn === BLANCO ? NEGRO : BLANCO;
    this.gameOver = false;
    this.result = null;
    this.winner = null;
    if (this.onStateChange) this.onStateChange(this.getState());
    return true;
  }

  // Notación algebraica simple (coordenadas)
  static notacion(move) {
    const [[cO, fO], [cD, fD]] = move;
    const cols = 'abcdefgh';
    return cols[cO] + (8 - fO) + cols[cD] + (8 - fD);
  }
}
