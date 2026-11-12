// Motor de reglas de ajedrez (Chesslord)
// Tablero: grid[fila][columna], fila 0 = rango 8, fila 7 = rango 1.
// Mayúsculas = blancas, minúsculas = negras.
// Autor: ALEJANDRO QUINTERO RUIZ
import { BLANCO, NEGRO } from './chessconstants.js';

const COLS = 'abcdefgh';
const CABALLO = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
const DIAGONAL = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const RECTA = [[0, 1], [0, -1], [1, 0], [-1, 0]];
const REY = [...DIAGONAL, ...RECTA];
const DESLIZA = { b: DIAGONAL, r: RECTA, q: REY };

export class Board {
  constructor() {
    this.grid = [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];
    // Derechos de enroque disponibles (true = todavía puede enrocar por ese lado).
    this.castling = { K: true, Q: true, k: true, q: true };
    // Última jugada: { from:[c,f], to:[c,f], ep:[c,f]|null }
    this.lastMove = null;
  }

  getColor(ficha) {
    if (ficha === ' ') return null;
    return ficha === ficha.toLowerCase() ? NEGRO : BLANCO;
  }

  /* ---------------- generación de movimientos ---------------- */

  _genPieza(c, f, out) {
    const ficha = this.grid[f][c];
    const color = this.getColor(ficha);
    const tipo = ficha.toLowerCase();

    if (tipo === 'p') {
      const dir = color === BLANCO ? -1 : 1;
      const filaInicial = color === BLANCO ? 6 : 1;
      const ultima = color === BLANCO ? 0 : 7;
      const f1 = f + dir;
      if (f1 < 0 || f1 > 7) return;
      // La promoción genera las cuatro piezas; move[2] indica la elegida.
      const añadir = (cc) => {
        if (f1 === ultima) for (const p of ['q', 'r', 'b', 'n']) out.push([[c, f], [cc, f1], p]);
        else out.push([[c, f], [cc, f1]]);
      };
      if (this.grid[f1][c] === ' ') {
        añadir(c);
        const f2 = f + 2 * dir;
        if (f === filaInicial && this.grid[f2][c] === ' ') out.push([[c, f], [c, f2]]);
      }
      for (const dc of [-1, 1]) {
        const cc = c + dc;
        if (cc < 0 || cc > 7) continue;
        const objetivo = this.grid[f1][cc];
        if (objetivo !== ' ' && this.getColor(objetivo) !== color) {
          añadir(cc);
        } else if (objetivo === ' ' && this.lastMove && this.lastMove.ep &&
                   this.lastMove.ep[0] === cc && this.lastMove.ep[1] === f1) {
          añadir(cc);
        }
      }
      return;
    }

    if (tipo === 'n' || tipo === 'k') {
      const dirs = tipo === 'n' ? CABALLO : REY;
      for (const [dc, df] of dirs) {
        const cc = c + dc, ff = f + df;
        if (cc < 0 || cc > 7 || ff < 0 || ff > 7) continue;
        const objetivo = this.grid[ff][cc];
        if (objetivo === ' ' || this.getColor(objetivo) !== color) out.push([[c, f], [cc, ff]]);
      }
      if (tipo === 'k') this._genEnroques(c, f, color, out);
      return;
    }

    for (const [dc, df] of DESLIZA[tipo]) {
      let cc = c + dc, ff = f + df;
      while (cc >= 0 && cc <= 7 && ff >= 0 && ff <= 7) {
        const objetivo = this.grid[ff][cc];
        if (objetivo === ' ') {
          out.push([[c, f], [cc, ff]]);
        } else {
          if (this.getColor(objetivo) !== color) out.push([[c, f], [cc, ff]]);
          break;
        }
        cc += dc;
        ff += df;
      }
    }
  }

  _genEnroques(c, f, color, out) {
    const fila = color === BLANCO ? 7 : 0;
    if (f !== fila || c !== 4) return;
    const torre = color === BLANCO ? 'R' : 'r';
    const rival = color === BLANCO ? NEGRO : BLANCO;
    const permiso = (k) => (color === BLANCO ? this.castling[k.toUpperCase()] : this.castling[k]);

    // No se puede enrocar saliendo de jaque, ni atravesando o aterrizando en casilla atacada.
    if (this.isInCheck(color)) return;

    if (permiso('k') && this.grid[fila][7] === torre &&
        this.grid[fila][5] === ' ' && this.grid[fila][6] === ' ' &&
        !this._isSquareAttacked([5, fila], rival) && !this._isSquareAttacked([6, fila], rival)) {
      out.push([[4, fila], [6, fila]]);
    }
    if (permiso('q') && this.grid[fila][0] === torre &&
        this.grid[fila][1] === ' ' && this.grid[fila][2] === ' ' && this.grid[fila][3] === ' ' &&
        !this._isSquareAttacked([3, fila], rival) && !this._isSquareAttacked([2, fila], rival)) {
      out.push([[4, fila], [2, fila]]);
    }
  }

  getLegalMoves(color) {
    const pseudo = [];
    for (let f = 0; f < 8; f++) {
      for (let c = 0; c < 8; c++) {
        const ficha = this.grid[f][c];
        if (ficha !== ' ' && this.getColor(ficha) === color) this._genPieza(c, f, pseudo);
      }
    }
    const legales = [];
    for (const move of pseudo) {
      const memo = this.makeMove(move);
      if (!this.isInCheck(color)) legales.push(move);
      this.undoMove(memo);
    }
    return legales;
  }

  isValidMove(move, color) {
    if (!move || !move[0] || !move[1]) return false;
    const [[cO, fO], [cD, fD]] = move;
    if ([cO, fO, cD, fD].some(n => !Number.isInteger(n) || n < 0 || n > 7)) return false;
    if (cO === cD && fO === fD) return false;
    const ficha = this.grid[fO][cO];
    if (ficha === ' ' || this.getColor(ficha) !== color) return false;
    if (this.getColor(this.grid[fD][cD]) === color) return false;

    const pseudo = [];
    this._genPieza(cO, fO, pseudo);
    const jugada = pseudo.find(m => m[1][0] === cD && m[1][1] === fD &&
      (!move[2] || (m[2] || 'q') === move[2].toLowerCase()));
    if (!jugada) return false;

    const memo = this.makeMove(jugada);
    const seguro = !this.isInCheck(color);
    this.undoMove(memo);
    return seguro;
  }

  /* ---------------- ejecución ---------------- */

  makeMove(move) {
    const [[cO, fO], [cD, fD]] = move;
    const ficha = this.grid[fO][cO];
    const capturada = this.grid[fD][cD];
    const color = this.getColor(ficha);
    const tipo = ficha.toLowerCase();

    const memo = {
      move,
      piece: ficha,
      captured: capturada,
      castling: { ...this.castling },
      lastMove: this.lastMove,
      epCaptured: null
    };

    if (tipo === 'k' && Math.abs(cD - cO) === 2) {
      if (cD > cO) { this.grid[fO][5] = this.grid[fO][7]; this.grid[fO][7] = ' '; }
      else { this.grid[fO][3] = this.grid[fO][0]; this.grid[fO][0] = ' '; }
    } else if (tipo === 'p' && cO !== cD && capturada === ' ') {
      // captura al paso: el peón capturado está en la fila de origen
      memo.epCaptured = [cD, fO];
      this.grid[fO][cD] = ' ';
    }

    this.grid[fD][cD] = ficha;
    this.grid[fO][cO] = ' ';

    // Promoción (por defecto dama; move[2] permite subpromoción).
    if (tipo === 'p' && (fD === 0 || fD === 7)) {
      const eleccion = (move[2] || 'q').toLowerCase();
      this.grid[fD][cD] = color === BLANCO ? eleccion.toUpperCase() : eleccion;
    }

    // Derechos de enroque: rey que se mueve, torre que se mueve o torre capturada.
    if (tipo === 'k') {
      if (color === BLANCO) { this.castling.K = this.castling.Q = false; }
      else { this.castling.k = this.castling.q = false; }
    } else if (tipo === 'r') {
      if (fO === 7 && cO === 0) this.castling.Q = false;
      else if (fO === 7 && cO === 7) this.castling.K = false;
      else if (fO === 0 && cO === 0) this.castling.q = false;
      else if (fO === 0 && cO === 7) this.castling.k = false;
    }
    if (capturada !== ' ' && capturada.toLowerCase() === 'r') {
      if (fD === 7 && cD === 0) this.castling.Q = false;
      else if (fD === 7 && cD === 7) this.castling.K = false;
      else if (fD === 0 && cD === 0) this.castling.q = false;
      else if (fD === 0 && cD === 7) this.castling.k = false;
    }

    let ep = null;
    if (tipo === 'p' && Math.abs(fD - fO) === 2) ep = [cO, (fO + fD) / 2];
    this.lastMove = { from: [cO, fO], to: [cD, fD], ep };

    return memo;
  }

  undoMove(memo) {
    const [[cO, fO], [cD, fD]] = memo.move;
    this.grid[fO][cO] = memo.piece;
    this.grid[fD][cD] = memo.captured;
    this.castling = { ...memo.castling };
    this.lastMove = memo.lastMove;

    if (memo.epCaptured) {
      const [epC, epF] = memo.epCaptured;
      this.grid[epF][epC] = memo.piece === memo.piece.toUpperCase() ? 'p' : 'P';
    }

    if (memo.piece.toLowerCase() === 'k' && Math.abs(cD - cO) === 2) {
      if (cD > cO) { this.grid[fO][7] = this.grid[fO][5]; this.grid[fO][5] = ' '; }
      else { this.grid[fO][0] = this.grid[fO][3]; this.grid[fO][3] = ' '; }
    }
  }

  /* ---------------- ataques y jaque ---------------- */

  _isSquareAttacked(sq, porColor) {
    const [c, f] = sq;

    // Peones: el atacante está una fila por delante de su propia dirección.
    const filaPeon = f + (porColor === BLANCO ? 1 : -1);
    if (filaPeon >= 0 && filaPeon <= 7) {
      for (const dc of [-1, 1]) {
        const cc = c + dc;
        if (cc < 0 || cc > 7) continue;
        const p = this.grid[filaPeon][cc];
        if (p !== ' ' && p.toLowerCase() === 'p' && this.getColor(p) === porColor) return true;
      }
    }

    for (const [dc, df] of CABALLO) {
      const cc = c + dc, ff = f + df;
      if (cc < 0 || cc > 7 || ff < 0 || ff > 7) continue;
      const p = this.grid[ff][cc];
      if (p !== ' ' && p.toLowerCase() === 'n' && this.getColor(p) === porColor) return true;
    }

    for (const [dc, df] of REY) {
      const cc = c + dc, ff = f + df;
      if (cc < 0 || cc > 7 || ff < 0 || ff > 7) continue;
      const p = this.grid[ff][cc];
      if (p !== ' ' && p.toLowerCase() === 'k' && this.getColor(p) === porColor) return true;
    }

    for (const [dc, df] of RECTA) {
      let cc = c + dc, ff = f + df;
      while (cc >= 0 && cc <= 7 && ff >= 0 && ff <= 7) {
        const p = this.grid[ff][cc];
        if (p !== ' ') {
          if (this.getColor(p) === porColor) {
            const t = p.toLowerCase();
            if (t === 'r' || t === 'q') return true;
          }
          break;
        }
        cc += dc;
        ff += df;
      }
    }

    for (const [dc, df] of DIAGONAL) {
      let cc = c + dc, ff = f + df;
      while (cc >= 0 && cc <= 7 && ff >= 0 && ff <= 7) {
        const p = this.grid[ff][cc];
        if (p !== ' ') {
          if (this.getColor(p) === porColor) {
            const t = p.toLowerCase();
            if (t === 'b' || t === 'q') return true;
          }
          break;
        }
        cc += dc;
        ff += df;
      }
    }

    return false;
  }

  _findKing(color) {
    const rey = color === BLANCO ? 'K' : 'k';
    for (let f = 0; f < 8; f++) {
      for (let c = 0; c < 8; c++) {
        if (this.grid[f][c] === rey) return [c, f];
      }
    }
    return null;
  }

  isInCheck(color) {
    const pos = this._findKing(color);
    if (!pos) return false;
    return this._isSquareAttacked(pos, color === BLANCO ? NEGRO : BLANCO);
  }

  /* ---------------- notación y repetición ---------------- */

  // Notación algebraica abreviada (SAN) del movimiento, calculada sobre la posición actual.
  san(move) {
    const [[cO, fO], [cD, fD]] = move;
    const ficha = this.grid[fO][cO];
    const tipo = ficha.toLowerCase();
    const color = this.getColor(ficha);
    const captura = this.grid[fD][cD] !== ' ' || (tipo === 'p' && cO !== cD);
    let texto;

    if (tipo === 'k' && Math.abs(cD - cO) === 2) {
      texto = cD > cO ? 'O-O' : 'O-O-O';
    } else if (tipo === 'p') {
      texto = (captura ? COLS[cO] + 'x' : '') + COLS[cD] + (8 - fD);
      if (fD === 0 || fD === 7) texto += '=' + (move[2] || 'q').toUpperCase();
    } else {
      texto = ficha.toUpperCase() + this._desambiguar(move, ficha) +
              (captura ? 'x' : '') + COLS[cD] + (8 - fD);
    }

    const rival = color === BLANCO ? NEGRO : BLANCO;
    const memo = this.makeMove(move);
    if (this.isInCheck(rival)) texto += this.getLegalMoves(rival).length === 0 ? '#' : '+';
    this.undoMove(memo);
    return texto;
  }

  _desambiguar(move, ficha) {
    const [cO, fO] = move[0];
    const [cD, fD] = move[1];
    const otros = this.getLegalMoves(this.getColor(ficha)).filter(m => {
      if (m[0][0] === cO && m[0][1] === fO) return false;
      return this.grid[m[0][1]][m[0][0]] === ficha && m[1][0] === cD && m[1][1] === fD;
    });
    if (otros.length === 0) return '';
    const mismoArchivo = otros.some(m => m[0][0] === cO);
    const mismaFila = otros.some(m => m[0][1] === fO);
    if (!mismoArchivo) return COLS[cO];
    if (!mismaFila) return String(8 - fO);
    return COLS[cO] + (8 - fO);
  }

  _hayCapturaAlPaso(color) {
    if (!this.lastMove || !this.lastMove.ep) return false;
    const [ce, fe] = this.lastMove.ep;
    const filaPeon = color === BLANCO ? fe + 1 : fe - 1;
    if (filaPeon < 0 || filaPeon > 7) return false;
    for (const dc of [-1, 1]) {
      const cc = ce + dc;
      if (cc < 0 || cc > 7) continue;
      const p = this.grid[filaPeon][cc];
      if (p !== ' ' && p.toLowerCase() === 'p' && this.getColor(p) === color) return true;
    }
    return false;
  }

  // Clave de posición para repetición triple (FIDE: la casilla de al paso sólo cuenta si es capturable).
  positionKey(turn) {
    const piezas = this.grid.map(fila => fila.join('')).join('/');
    const derechos = ['K', 'Q', 'k', 'q'].filter(k => this.castling[k]).join('') || '-';
    const ep = this._hayCapturaAlPaso(turn)
      ? COLS[this.lastMove.ep[0]] + (8 - this.lastMove.ep[1])
      : '-';
    return `${piezas} ${turn === BLANCO ? 'w' : 'b'} ${derechos} ${ep}`;
  }
}
