// Controlador de partida — une motor de reglas + IA + niveles
// Autor: ALEJANDRO QUINTERO RUIZ
import { Board } from './chesslogic.js';
import { ChessEngine } from './chessai.js';
import { BLANCO, NEGRO } from './chessconstants.js';

const rival = (color) => (color === BLANCO ? NEGRO : BLANCO);
const espera = (ms) => new Promise((res) => setTimeout(res, ms));

export class ChessGame {
  constructor(onStateChange) {
    this.onStateChange = onStateChange;
    this.humanColor = NEGRO; // el humano juega con negras por defecto
    this.level = 'MEDIO';    // BASICO | MEDIO | MAESTRO
    this._gen = 0;           // generación de partida: invalida tareas de la IA antiguas
    this._iaOcupada = false;
    this._iniciar();
    if (this.onStateChange) this.onStateChange(this.getState());
    this._moverIA();
  }

  _iniciar() {
    this.board = new Board();
    this.engine = new ChessEngine(this.board, this.level);
    this.engine.setColorIA(rival(this.humanColor));
    this.turn = BLANCO; // las blancas mueven primero
    this.gameOver = false;
    this.result = null; // 'mate' | 'ahogado' | 'repeticion' | 'cincuenta' | 'material'
    this.winner = null;
    this.moveHistory = [];
    this._medioMovimientos = 0; // regla de 50 movimientos (100 semijugadas)
    const clave = this.board.positionKey(this.turn);
    this._claves = [clave];
    this._repeticiones = new Map([[clave, 1]]);
  }

  setLevel(level) {
    this.level = level;
    this.engine.setDifficulty(level); // se aplica al instante, sin reiniciar
  }

  setHumanColor(color) {
    this.humanColor = color;
    this.reiniciar();
  }

  getState() {
    return {
      grid: this.board.grid.map((fila) => [...fila]),
      turn: this.turn,
      humanColor: this.humanColor,
      gameOver: this.gameOver,
      result: this.result,
      winner: this.winner,
      level: this.level,
      thinking: this._iaOcupada,
      moveHistory: [...this.moveHistory],
      inCheck: this.board.isInCheck(this.turn)
    };
  }

  // Intenta ejecutar un movimiento del humano. Devuelve true si se ejecutó.
  tryMove(move) {
    if (this.gameOver || this.turn !== this.humanColor) return false;
    if (!this.board.isValidMove(move, this.turn)) return false;
    return this._executeMove(move);
  }

  _executeMove(move) {
    const color = this.turn;
    const [[cO, fO], [cD, fD]] = move;
    const ficha = this.board.grid[fO][cO];
    const esPeon = ficha.toLowerCase() === 'p';
    // captura incluye al paso (destino vacío)
    const captura = this.board.grid[fD][cD] !== ' ' || (esPeon && cO !== cD);

    const san = this.board.san(move);
    const memo = this.board.makeMove(move);
    this.turn = rival(color);

    this._medioMovimientos = esPeon || captura ? 0 : this._medioMovimientos + 1;

    this.moveHistory.push({
      move, memo, san, color,
      medio: this._medioMovimientos
    });

    const clave = this.board.positionKey(this.turn);
    this._claves.push(clave);
    this._repeticiones.set(clave, (this._repeticiones.get(clave) || 0) + 1);

    this._evaluarFin();
    if (this.onStateChange) this.onStateChange(this.getState());
    this._moverIA();
    return true;
  }

  _evaluarFin() {
    const legales = this.board.getLegalMoves(this.turn);
    if (legales.length === 0) {
      this.gameOver = true;
      if (this.board.isInCheck(this.turn)) {
        this.result = 'mate';
        this.winner = rival(this.turn);
      } else {
        this.result = 'ahogado';
      }
      return;
    }

    const clave = this._claves[this._claves.length - 1];
    if ((this._repeticiones.get(clave) || 0) >= 3) {
      this.result = 'repeticion';
    } else if (this._medioMovimientos >= 100) {
      this.result = 'cincuenta';
    } else if (this._materialInsuficiente()) {
      this.result = 'material';
    }
    this.gameOver = this.result !== null;
  }

  // Tablas por material insuficiente: rey solo, rey + pieza menor, o dos alfiles del mismo color.
  _materialInsuficiente() {
    const piezas = [];
    for (let f = 0; f < 8; f++) {
      for (let c = 0; c < 8; c++) {
        const ficha = this.board.grid[f][c];
        if (ficha === ' ') continue;
        const tipo = ficha.toLowerCase();
        if (tipo !== 'k') piezas.push({ tipo, f, c });
      }
    }
    if (piezas.length === 0) return true;
    if (piezas.length === 1) return piezas[0].tipo === 'b' || piezas[0].tipo === 'n';
    if (piezas.length === 2 && piezas.every((p) => p.tipo === 'b')) {
      return (piezas[0].f + piezas[0].c) % 2 === (piezas[1].f + piezas[1].c) % 2;
    }
    return false;
  }

  // Turno de la IA: piensa y juega. Devuelve true si movió.
  async iaMove(gen = this._gen) {
    if (this.gameOver || this.turn !== this.engine.colorIA) return false;

    await espera(350); // deja ver el movimiento del humano
    if (gen !== this._gen || this.gameOver) return false;

    const move = await this.engine.getBestMove();
    if (gen !== this._gen || this.gameOver) return false;
    if (!move) return false;

    return this._executeMove(move);
  }

  _moverIA() {
    if (this.gameOver || this.turn === this.humanColor || this._iaOcupada) return;
    const gen = this._gen;
    this._iaOcupada = true;
    if (this.onStateChange) this.onStateChange(this.getState());

    this.iaMove(gen).finally(() => {
      if (gen !== this._gen) return; // la partida cambió mientras pensaba
      this._iaOcupada = false;
      if (this.onStateChange) this.onStateChange(this.getState());
    });
  }

  reiniciar() {
    this._gen++;
    this.engine.cancelar(); // suelta la CPU de una búsqueda en vuelo
    this._iaOcupada = false;
    this._iniciar();
    if (this.onStateChange) this.onStateChange(this.getState());
    this._moverIA();
  }

  // Retrocede hasta devolverle el turno al humano. Un movimiento si la IA no respondió,
  // dos si ya respondió (el suyo y el del humano).
  deshacer() {
    if (this.moveHistory.length === 0) return false;
    const cuantos = this.turn === this.humanColor ? 2 : 1;
    if (this.moveHistory.length < cuantos) return false;

    this._gen++; // cancela una jugada de la IA en vuelo
    this.engine.cancelar();
    this._iaOcupada = false;

    for (let i = 0; i < cuantos; i++) {
      const ultimo = this.moveHistory.pop();
      this.board.undoMove(ultimo.memo);
      this.turn = ultimo.color;
      const fuera = this._claves.pop();
      this._repeticiones.set(fuera, (this._repeticiones.get(fuera) || 0) - 1);
    }
    this._medioMovimientos = this.moveHistory.length
      ? this.moveHistory[this.moveHistory.length - 1].medio
      : 0;

    this.gameOver = false;
    this.result = null;
    this.winner = null;
    if (this.onStateChange) this.onStateChange(this.getState());
    return true;
  }
}
