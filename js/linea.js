// Línea de apertura interactiva — Chesslord
// El usuario juega las jugadas de las blancas; las negras responden solas
// con el comentario de su jugada. Toda la línea se valida con el motor.
// Autor: ALEJANDRO QUINTERO RUIZ
import { Board } from './chesslogic.js';
import { buscarSan } from './posicion.js';
import { BLANCO, NEGRO } from './chessconstants.js';

export class Linea {
  constructor(op) {
    this.op = op;
    this.board = new Board();
    this.turno = BLANCO;
    this.idx = 0;
    this.sel = null;
    this.estado = 'info';
    this.mensaje = '';
    this.comentario = '';
    this.revelada = false;
    this._autoNegras();
  }

  get grid() { return this.board.grid; }
  get terminada() { return this.idx >= this.op.jugadas.length; }
  get actual() { return this.terminada ? null : this.op.jugadas[this.idx]; }

  _aplicar() {
    const jugada = this.op.jugadas[this.idx];
    const move = buscarSan(this.board, jugada.san, this.turno);
    if (!move) throw new Error(`Jugada «${jugada.san}» ilegal en ${this.op.id}`);
    this.board.makeMove(move);
    this.turno = this.turno === BLANCO ? NEGRO : BLANCO;
    this.idx++;
    this.comentario = `${jugada.san}: ${jugada.comentario}`;
  }

  _autoNegras() {
    while (!this.terminada && this.turno === NEGRO) this._aplicar();
  }

  seleccionar(c, f) {
    if (this.terminada || this.turno !== BLANCO) return;
    if (this.sel && this.sel.c === c && this.sel.f === f) {
      this.sel = null;
      return;
    }

    const pieza = this.board.grid[f][c];
    const propia = pieza !== ' ' && this.board.getColor(pieza) === BLANCO;

    if (!this.sel) {
      if (propia) this.sel = { c, f };
      return;
    }

    const origen = this.sel;
    this.sel = null;
    const esperada = buscarSan(this.board, this.actual.san, BLANCO);
    const [[cO, fO], [cD, fD]] = esperada;

    if (origen.c === cO && origen.f === fO && c === cD && f === fD) {
      this._aplicar();
      this._autoNegras();
      this.estado = 'exito';
      this.mensaje = this.terminada
        ? '✅ Línea completada. Las piezas están donde deben.'
        : '✅ Correcto. Las negras han respondido.';
      return;
    }

    const legal = this.board.isValidMove([[origen.c, origen.f], [c, f]], BLANCO);
    this.estado = legal ? 'aviso' : 'error';
    this.mensaje = legal
      ? '⚠️ Es legal, pero esta apertura juega otra cosa.'
      : '❌ Ese movimiento no es legal.';
  }

  pista() {
    this.estado = 'info';
    this.mensaje = `💡 ${this.actual.comentario}`;
  }

  verJugada() {
    if (this.terminada) return;
    this._aplicar();
    this._autoNegras();
    this.revelada = true;
    this.estado = 'info';
    this.mensaje = this.terminada ? '🔎 Línea mostrada hasta el final.' : '🔎 Jugada mostrada.';
  }
}
