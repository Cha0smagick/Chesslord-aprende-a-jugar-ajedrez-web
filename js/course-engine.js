// Motor de lecciones interactivas — Chesslord
// Gestiona la navegación, renderizado y validación de lecciones del curso.
// Autor: ALEJANDRO QUINTERO RUIZ
import { Board } from './chesslogic.js';
import { BLANCO, NEGRO } from './chessconstants.js';

const PROGRESS_KEY = 'chesslord_course_progress';

export class CourseEngine {
  constructor(modulos, onStateChange) {
    this.modulos = modulos;
    this.onStateChange = onStateChange;
    this.moduloIdx = 0;
    this.leccionIdx = 0;
    this.board = new Board();
    this.leccionSel = null; // {c,f}
    this.estado = 'idle'; // idle | correcto | incorrecto | ilegal
    this.mensaje = '';
    this.explicacionVisible = false;
    this.cargado = false;
    this._cargarProgreso();
  }

  _cargarProgreso() {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      this.progreso = raw ? JSON.parse(raw) : {};
    } catch (e) {
      this.progreso = {};
    }
  }

  _guardarProgreso() {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(this.progreso));
    } catch (e) {
      // localStorage no disponible en este entorno
    }
  }

  _leccionActual() {
    const mod = this.modulos[this.moduloIdx];
    if (!mod) return null;
    return mod.lecciones[this.leccionIdx];
  }

  cargarLeccion(moduloIdx, leccionIdx) {
    this.moduloIdx = moduloIdx;
    this.leccionIdx = leccionIdx;
    const leccion = this._leccionActual();
    if (!leccion) return false;

    this.board = new Board();
    this.board.grid = leccion.grid.map((row) => [...row]);
    this.leccionSel = null;
    this.estado = 'idle';
    this.mensaje = '';
    this.explicacionVisible = false;
    leccion.completada = !!this.progreso[leccion.id];
    this.cargado = true;

    if (this.onStateChange) this.onStateChange(this.getState());
    return true;
  }

  getState() {
    const leccion = this._leccionActual();
    const mod = this.modulos[this.moduloIdx];
    const totalLecciones = this.modulos.reduce((sum, m) => sum + m.lecciones.length, 0);
    const completadas = Object.values(this.progreso).filter(Boolean).length;

    return {
      leccion,
      modulo: mod,
      moduloIdx: this.moduloIdx,
      leccionIdx: this.leccionIdx,
      board: this.board,
      leccionSel: this.leccionSel,
      estado: this.estado,
      mensaje: this.mensaje,
      explicacionVisible: this.explicacionVisible,
      cargado: this.cargado,
      completada: leccion ? leccion.completada : false,
      progreso: { completadas, total: totalLecciones },
      tieneSiguiente: this._tieneSiguiente(),
      tieneAnterior: this.moduloIdx > 0 || this.leccionIdx > 0
    };
  }

  _tieneSiguiente() {
    const leccion = this._leccionActual();
    const mod = this.modulos[this.moduloIdx];
    if (!leccion || !mod) return false;
    if (this.leccionIdx < mod.lecciones.length - 1) return true;
    if (this.moduloIdx < this.modulos.length - 1) return true;
    return false;
  }

  seleccionar(c, f) {
    const leccion = this._leccionActual();
    if (!leccion || this.estado !== 'idle') return;

    const grid = this.board.grid;
    const ficha = grid[f][c];
    const esPropia = ficha !== ' ' && this.board.getColor(ficha) === leccion.turno;

    if (this.leccionSel) {
      const origen = this.leccionSel;
      const destino = [c, f];
      const esCorrecto =
        origen.c === leccion.jugadaEsperada[0][0] &&
        origen.f === leccion.jugadaEsperada[0][1] &&
        c === leccion.jugadaEsperada[1][0] &&
        f === leccion.jugadaEsperada[1][1];

      const esLegal = this.board.isValidMove([[origen.c, origen.f], [c, f]], leccion.turno);

      if (esCorrecto) {
        this.estado = 'correcto';
        this.mensaje = '✅ ¡Correcto! Has encontrado la jugada clave.';
        this.board.makeMove([[origen.c, origen.f], [c, f]]);
        this.progreso[leccion.id] = true;
        leccion.completada = true;
        this._guardarProgreso();
      } else if (esLegal) {
        this.estado = 'incorrecto';
        this.mensaje = '⚠️ Movimiento legal, pero no es la jugada clave que buscamos.';
      } else {
        this.estado = 'ilegal';
        this.mensaje = '❌ Movimiento ilegal.';
      }

      this.leccionSel = null;
    } else if (esPropia) {
      this.leccionSel = { c, f };
    }

    if (this.onStateChange) this.onStateChange(this.getState());
  }

  mostrarPista() {
    const leccion = this._leccionActual();
    if (!leccion) return '';
    const [[cO, fO], [cD, fD]] = leccion.jugadaEsperada;
    const cols = 'abcdefgh';
    this.mensaje = `💡 Pista: mueve de ${cols[cO]}${8 - fO} a ${cols[cD]}${8 - fD}.`;
    this.estado = 'idle';
    if (this.onStateChange) this.onStateChange(this.getState());
    return this.mensaje;
  }

  mostrarSolucion() {
    const leccion = this._leccionActual();
    if (!leccion) return '';
    this.explicacionVisible = true;
    this.mensaje = '🔎 Solución revelada.';
    this.estado = 'idle';
    if (this.onStateChange) this.onStateChange(this.getState());
  }

  ocultarExplicacion() {
    this.explicacionVisible = false;
    if (this.onStateChange) this.onStateChange(this.getState());
  }

  siguienteLeccion() {
    if (!this._tieneSiguiente()) return false;
    const mod = this.modulos[this.moduloIdx];
    if (this.leccionIdx < mod.lecciones.length - 1) {
      this.leccionIdx++;
    } else {
      this.moduloIdx++;
      this.leccionIdx = 0;
    }
    return this.cargarLeccion(this.moduloIdx, this.leccionIdx);
  }

  leccionAnterior() {
    if (this.leccionIdx > 0) {
      this.leccionIdx--;
    } else if (this.moduloIdx > 0) {
      this.moduloIdx--;
      this.leccionIdx = this.modulos[this.moduloIdx].lecciones.length - 1;
    } else {
      return false;
    }
    return this.cargarLeccion(this.moduloIdx, this.leccionIdx);
  }

  reiniciarProgreso() {
    this.progreso = {};
    this._guardarProgreso();
    this.cargarLeccion(this.moduloIdx, this.leccionIdx);
  }
}

export { PROGRESS_KEY };
