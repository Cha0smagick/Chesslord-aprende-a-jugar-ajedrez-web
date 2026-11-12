// Ejercicio interactivo — Chesslord
// Una posición, una jugada ganadora. La solución se resuelve con el motor,
// así que unas coordenadas mal escritas no pueden pasar desapercibidas.
// Autor: ALEJANDRO QUINTERO RUIZ
import { cargarPosicion, buscarSan } from './posicion.js';

export class Puzzle {
  constructor(def) {
    this.def = def;
    const { board, turno } = cargarPosicion(def);
    this.board = board;
    this.turno = turno;
    this.solucion = buscarSan(board, def.jugada, turno);
    if (!this.solucion) {
      throw new Error(`Jugada «${def.jugada}» ilegal en el ejercicio ${def.id || def.tema}`);
    }
    this.sel = null;
    this.estado = 'info';
    this.mensaje = '';
    this.resuelto = false;
    this.revelada = false;
  }

  get grid() { return this.board.grid; }

  seleccionar(c, f) {
    if (this.resuelto || this.revelada) return;
    if (this.sel && this.sel.c === c && this.sel.f === f) {
      this.sel = null;
      return;
    }

    const pieza = this.board.grid[f][c];
    const propia = pieza !== ' ' && this.board.getColor(pieza) === this.turno;

    if (!this.sel) {
      if (propia) this.sel = { c, f };
      return;
    }

    const origen = this.sel;
    this.sel = null;
    const [[cO, fO], [cD, fD]] = this.solucion;

    if (origen.c === cO && origen.f === fO && c === cD && f === fD) {
      this.board.makeMove(this.solucion);
      this.resuelto = true;
      this.estado = 'exito';
      this.mensaje = '✅ Jugada correcta.';
      return;
    }

    const legal = this.board.isValidMove([[origen.c, origen.f], [c, f]], this.turno);
    this.estado = legal ? 'aviso' : 'error';
    this.mensaje = legal
      ? '⚠️ Movimiento legal, pero no es la jugada que buscamos.'
      : '❌ Ese movimiento no es legal.';
  }

  pista() {
    this.estado = 'info';
    this.mensaje = `💡 ${this.def.pista}`;
  }

  revelar() {
    if (!this.revelada) {
      this.board.makeMove(this.solucion);
      this.revelada = true;
    }
    this.sel = null;
    this.estado = 'info';
    this.mensaje = '🔎 Solución mostrada en el tablero.';
  }
}
