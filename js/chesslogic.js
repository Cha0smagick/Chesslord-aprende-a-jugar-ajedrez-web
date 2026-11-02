// Motor de reglas de ajedrez — puerto de logic.py (Chesslord)
// Autor: ALEJANDRO QUINTERO RUIZ
import { BLANCO, NEGRO, VALOR_PIEZAS, PST } from './chessconstants.js';

export class Board {
  constructor() {
    this.grid = this._crearTableroInicial();
    this.castlingRights = {
      k: false, r_a1: false, r_h1: false,
      K: false, R_A8: false, R_H8: false
    };
    this.lastMove = null; // [[c, f], [c, d], epTarget]
  }

  _crearTableroInicial() {
    return [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];
  }

  getColor(ficha) {
    if (ficha === ' ') return null;
    return ficha === ficha.toLowerCase() ? NEGRO : BLANCO;
  }

  makeMove(move) {
    const [[cO, fO], [cD, fD]] = move;
    const ficha = this.grid[fO][cO];
    const captura = this.grid[fD][cD];
    const dx = Math.abs(cD - cO);
    const dy = Math.abs(fD - fO);
    const dirP = this.getColor(ficha) === NEGRO ? 1 : -1;

    const memo = {
      move: move,
      captured: captura,
      piece: ficha,
      oldCastling: { ...this.castlingRights },
      oldLastMove: this.lastMove,
      enPassantCaptured: null
    };

    // Enroque (rey se mueve 2 casillas)
    if (ficha.toLowerCase() === 'k' && dx === 2) {
      if (cD > cO) { // corto
        this.grid[fO][5] = this.grid[fO][7];
        this.grid[fO][7] = ' ';
      } else { // largo
        this.grid[fO][3] = this.grid[fO][0];
        this.grid[fO][0] = ' ';
      }
    }

    // Mover pieza
    this.grid[fD][cD] = ficha;
    this.grid[fO][cO] = ' ';

    // En passant: detectar captura al paso usando lastMove del turno anterior
    let enPassantCaptured = null;
    if (
      ficha.toLowerCase() === 'p' && dx === 1 && captura === ' ' &&
      this.lastMove !== null &&
      this.lastMove[1] !== null &&
      cD === this.lastMove[1][0] && fD === this.lastMove[1][1]
    ) {
      enPassantCaptured = [cD, fD - dirP];
      this.grid[enPassantCaptured[1]][enPassantCaptured[0]] = ' ';
    }

    // Grabar lastMove para en passant del próximo turno
    let epTarget = null;
    if (ficha.toLowerCase() === 'p' && dy === 2) {
      epTarget = [cD, fO + dirP];
    }
    this.lastMove = [move, epTarget];

    // Promoción automática a Reina
    if (ficha.toLowerCase() === 'p' && (fD === 0 || fD === 7)) {
      this.grid[fD][cD] = ficha.isLowerCase() ? 'q' : 'Q';
    }

    this._updateCastlingRights(ficha, cO, fO);
    memo.enPassantCaptured = enPassantCaptured;
    return memo;
  }

  undoMove(memo) {
    const [[cO, fO], [cD, fD]] = memo.move;
    this.grid[fO][cO] = memo.piece;
    this.grid[fD][cD] = memo.captured;
    this.castlingRights = { ...memo.oldCastling };
    this.lastMove = memo.oldLastMove;

    // Deshacer captura al paso: restaurar el peón capturado
    if (memo.enPassantCaptured) {
      const [epC, epF] = memo.enPassantCaptured;
      this.grid[epF][epC] = memo.piece.toUpperCase() === memo.piece ? 'p' : 'P';
    }

    // Deshacer enroque de la torre
    if (memo.piece.toLowerCase() === 'k' && Math.abs(cD - cO) === 2) {
      if (cD > cO) {
        this.grid[fO][7] = this.grid[fO][5];
        this.grid[fO][5] = ' ';
      } else {
        this.grid[fO][0] = this.grid[fO][3];
        this.grid[fO][3] = ' ';
      }
    }
  }

  _updateCastlingRights(ficha, c, f) {
    if (ficha === 'k') this.castlingRights.k = true;
    else if (ficha === 'K') this.castlingRights.K = true;
    else if (ficha === 'r') {
      if (c === 0 && f === 0) this.castlingRights.r_a1 = true;
      else if (c === 7 && f === 0) this.castlingRights.r_h1 = true;
    } else if (ficha === 'R') {
      if (c === 0 && f === 7) this.castlingRights.R_A8 = true;
      else if (c === 7 && f === 7) this.castlingRights.R_H8 = true;
    }
  }

  getLegalMoves(color) {
    const moves = [];
    for (let f = 0; f < 8; f++) {
      for (let c = 0; c < 8; c++) {
        const ficha = this.grid[f][c];
        if (ficha !== ' ' && this.getColor(ficha) === color) {
          for (let df = 0; df < 8; df++) {
            for (let dc = 0; dc < 8; dc++) {
              const move = [[c, f], [dc, df]];
              if (this.isValidMove(move, color)) {
                moves.push(move);
              }
            }
          }
        }
      }
    }
    return moves;
  }

  isValidMove(move, color) {
    const [[cO, fO], [cD, fD]] = move;
    const ficha = this.grid[fO][cO];
    const objetivo = this.grid[fD][cD];
    const colorPieza = this.getColor(ficha);

    if (cO === cD && fO === fD) return false;
    if (this.getColor(objetivo) === color) return false;
    if (colorPieza !== color) return false;

    if (!this._ruleCheck([cO, fO], [cD, fD], ficha, color)) return false;

    // Verificar si el movimiento deja al rey en jaque
    const memo = this.makeMove(move);
    const enJaque = this.isInCheck(color);
    this.undoMove(memo);
    return !enJaque;
  }

  _ruleCheck(origen, destino, ficha, color) {
    const [cO, fO] = origen;
    const [cD, fD] = destino;
    const objetivo = this.grid[fD][cD];
    const dx = Math.abs(cD - cO);
    const dy = Math.abs(fD - fO);
    const tipo = ficha.toLowerCase();
    let esValido = false;

    if (tipo === 'p') {
      const dir = color === NEGRO ? 1 : -1;
      if (cO === cD) { // Avance
        if (fD === fO + dir && objetivo === ' ') esValido = true;
        else if (fO === (color === NEGRO ? 1 : 6) && fD === fO + 2 * dir &&
                 objetivo === ' ' && this.grid[fO + dir][cO] === ' ') {
          esValido = true;
        }
      } else if (dx === 1 && fD === fO + dir && objetivo !== ' ') { // Captura normal
        esValido = true;
      } else if (dx === 1 && fD === fO + dir && objetivo === ' ') { // Captura al paso
        if (this.lastMove !== null &&
            this.lastMove[1] !== null &&
            cD === this.lastMove[1][0] && fD === this.lastMove[1][1]) {
          esValido = true;
        }
      }
    } else if (tipo === 'n') {
      esValido = (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
    } else if (tipo === 'b') {
      esValido = dx === dy && this._checkPath([cO, fO], [cD, fD], true, false);
    } else if (tipo === 'r') {
      esValido = (dx === 0 || dy === 0) && this._checkPath([cO, fO], [cD, fD], false, true);
    } else if (tipo === 'q') {
      esValido = this._checkPath([cO, fO], [cD, fD], true, true);
    } else if (tipo === 'k') {
      esValido = dx <= 1 && dy <= 1;
      // Enroque: rey se mueve 2 casillas
      if (dx === 2 && dy === 0 && !esValido) {
        esValido = this._canCastle(color, cD > cO);
      }
    }

    return esValido;
  }

  _checkPath(origen, destino, diag, orthogonal) {
    const [cO, fO] = origen;
    const [cD, fD] = destino;
    const dx = cD - cO;
    const dy = fD - fO;

    if (diag && Math.abs(dx) === Math.abs(dy)) {
      const stepC = dx > 0 ? 1 : -1;
      const stepF = dy > 0 ? 1 : -1;
      let currC = cO + stepC;
      let currF = fO + stepF;
      while (currC !== cD) {
        if (this.grid[currF][currC] !== ' ') return false;
        currC += stepC;
        currF += stepF;
      }
      return true;
    }
    if (orthogonal && (dx === 0 || dy === 0)) {
      const stepC = dx === 0 ? 0 : (dx > 0 ? 1 : -1);
      const stepF = dy === 0 ? 0 : (dy > 0 ? 1 : -1);
      let currC = cO + stepC;
      let currF = fO + stepF;
      while (currC !== cD || currF !== fD) {
        if (currC === cD && currF === fD) break;
        if (this.grid[currF][currC] !== ' ') return false;
        currC += stepC;
        currF += stepF;
      }
      return true;
    }
    return false;
  }

  _isSquareAttacked(square, byColor) {
    const [c, f] = square;
    for (let ff = 0; ff < 8; ff++) {
      for (let cc = 0; cc < 8; cc++) {
        const piece = this.grid[ff][cc];
        if (piece === ' ' || this.getColor(piece) !== byColor) continue;
        // Peón: ataca las dos casillas diagonales al frente, ocupada o no
        if (piece.toLowerCase() === 'p') {
          const dirP = byColor === NEGRO ? 1 : -1;
          if ((cc - 1 === c && ff + dirP === f) || (cc + 1 === c && ff + dirP === f)) {
            return true;
          }
          continue;
        }
        if (this._pseudoValid([cc, ff], square)) return true;
      }
    }
    return false;
  }

  _findKing(color) {
    const rey = color === NEGRO ? 'k' : 'K';
    for (let f = 0; f < 8; f++) {
      for (let c = 0; c < 8; c++) {
        if (this.grid[f][c] === rey) return [c, f];
      }
    }
    return null;
  }

  _canCastle(color, kingside) {
    const pos = this._findKing(color);
    if (!pos || this.isInCheck(color)) return false;
    const [cR, fR] = pos;
    const kingKey = color === BLANCO ? 'K' : 'k';

    if (kingside) {
      const rookKey = color === BLANCO ? 'R_H8' : 'r_h1';
      if (this.castlingRights[kingKey] || this.castlingRights[rookKey]) return false;
      const path = [[5, fR], [6, fR]];
      const squares = [pos, [6, fR]];
      for (const [cc, ff] of path) {
        if (this.grid[ff][cc] !== ' ') return false;
      }
      const oponente = color === BLANCO ? NEGRO : BLANCO;
      for (const sq of squares) {
        if (this._isSquareAttacked(sq, oponente)) return false;
      }
      return true;
    } else {
      const rookKey = color === BLANCO ? 'R_A8' : 'r_a1';
      if (this.castlingRights[kingKey] || this.castlingRights[rookKey]) return false;
      const path = [[3, fR], [2, fR], [1, fR]];
      const squares = [pos, [3, fR], [2, fR]];
      for (const [cc, ff] of path) {
        if (this.grid[ff][cc] !== ' ') return false;
      }
      const oponente = color === BLANCO ? NEGRO : BLANCO;
      for (const sq of squares) {
        if (this._isSquareAttacked(sq, oponente)) return false;
      }
      return true;
    }
  }

  isInCheck(color) {
    const reyChar = color === NEGRO ? 'k' : 'K';
    let posRey = null;
    for (let f = 0; f < 8; f++) {
      for (let c = 0; c < 8; c++) {
        if (this.grid[f][c] === reyChar) {
          posRey = [c, f];
          break;
        }
      }
      if (posRey) break;
    }
    if (!posRey) return false;

    const oponente = color === NEGRO ? BLANCO : NEGRO;
    for (let f = 0; f < 8; f++) {
      for (let c = 0; c < 8; c++) {
        const ficha = this.grid[f][c];
        if (ficha !== ' ' && this.getColor(ficha) === oponente) {
          if (this._pseudoValid([c, f], posRey)) return true;
        }
      }
    }
    return false;
  }

  _pseudoValid(origen, destino) {
    const ficha = this.grid[origen[1]][origen[0]];
    const color = this.getColor(ficha);
    return this._ruleCheck(origen, destino, ficha, color);
  }
}
