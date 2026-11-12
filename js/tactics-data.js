// Datos de táctica — Chesslord
// Motivos tácticos con posiciones interactivas.
// Autor: ALEJANDRO QUINTERO RUIZ
import { BLANCO, NEGRO } from './chessconstants.js';
  {
    id: 'clavada-basica',
    nombre: 'Clavada (Pin)',
    libro: 'Manual de Ajedrez — Lasker',
    nivel: 'Básico',
    descripcion: 'Atacar una pieza que no puede moverse porque al hacerlo dejaría al descubierto una pieza más valiosa detrás, normalmente el rey.',
    grid: [
      ['r','n','b','q','k','b','n','r'],
      ['p','p','p','p','p','p','p','p'],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ','B',' ',' '], // alfil blanco en f4
      [' ',' ',' ',' ',' ',' ',' ',' '],
      ['P','P','P','P','P','P','P','P'],
      ['R','N','B','Q','K','B','N','R']
    ],
    turno: BLANCO,
    jugadaEsperada: [[5,3],[2,0]], // Bf4-a? simplificado
    pista: 'Clava el caballo negro contra el rey o dama detrás.',
    explicacion: 'El alfil en f4 clava el caballo negro en f6 contra la dama o el rey detrás. El caballo no puede moverse sin exponer la pieza valiosa.',
    completada: false
  },
  {
    id: 'doble-ataque-caballo',
    nombre: 'Doble ataque (Fork)',
    libro: 'Reasumir el Desequilibrio — Silman',
    nivel: 'Básico',
    descripcion: 'Un caballo ataca dos piezas enemigas al mismo tiempo, forzando al oponente a perder material.',
    grid: [
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ','q',' ',' ',' ',' '], // dama negra en d6
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ','K',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ']
    ],
    turno: BLANCO,
    jugadaEsperada: [[4,4],[3,3]], // caballo d4-c? simplificado
    pista: 'El caballo salta a una casilla donde ataca dos piezas a la vez.',
    explicacion: 'El doble ataque obliga al oponente a salvar solo una de las dos piezas atacadas, perdiendo la otra.',
    completada: false
  },
  {
    id: 'enfilada',
    nombre: 'Enfilada (Skewer)',
    libro: 'Manual de Ajedrez — Lasker',
    nivel: 'Medio',
    descripcion: 'Como la clavada, pero la pieza valiosa está delante. Cuando se mueve, queda expuesta la pieza de menor valor detrás, que se captura.',
    grid: [
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ','q',' ',' ',' ',' '], // dama negra en d6 delante
      [' ',' ',' ','r',' ',' ',' ',' '], // torre negra detrás en d7
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ']
    ],
    turno: BLANCO,
    jugadaEsperada: [[4,4],[3,4]], // pieza blanca ataca la columna
    pista: 'Ataque a la pieza de delante para que se mueva y pierdas la de atrás.',
    explicacion: 'En la enfilada, la pieza valiosa (dama) está delante y debe moverse, dejando expuesta la torre detrás para ser capturada.',
    completada: false
  },
  {
    id: 'distraccion',
    nombre: 'Distracción (Decoy)',
    libro: 'Ataque al rey — Polugayevsky',
    nivel: 'Medio',
    descripcion: 'Forzar a una pieza defensora a alejarse de su casilla clave ofreciéndole una captura tentadora.',
    grid: [
      [' ',' ',' ',' ','k',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ','K',' ',' ',' ']
    ],
    turno: BLANCO,
    jugadaEsperada: [[4,6],[5,5]],
    pista: 'Ofrece un peón o pieza para distraer al defensor del rey.',
    explicacion: 'La distracción aparta a la pieza que protege al rey, dejando al monarca expuesto a un ataque directo.',
    completada: false
  },
  {
    id: 'aniquilamiento-defensor',
    nombre: 'Aniquilamiento del defensor',
    libro: 'Mi Sistema — Nimzowitsch',
    nivel: 'Medio-Avanzado',
    descripcion: 'Capturar o alejar la pieza que defiende una posición clave, dejando esa posición indefensa.',
    grid: [
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ']
    ],
    turno: BLANCO,
    jugadaEsperada: [[4,4],[3,3]],
    pista: 'Elimina al defensor para que la posición clave quede desprotegida.',
    explicacion: 'Sin el defensor, la casilla o pieza clave queda expuesta y puede ser capturada o ocupada con ventaja.',
    completada: false
  },
  {
    id: 'x-ray',
    nombre: 'Ataque X-ray',
    libro: 'Fundamentos del Ajedrez — Capablanca',
    nivel: 'Medio-Avanzado',
    descripcion: 'Una pieza ataca a través de otra pieza (amiga o enemiga) hacia una casilla clave detrás de ella.',
    grid: [
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ']
    ],
    turno: BLANCO,
    jugadaEsperada: [[4,4],[3,3]],
    pista: 'Busca una línea donde tu pieza ataque a través de otra.',
    explicacion: 'El X-ray permite controlar una casilla incluso cuando hay una pieza intermedia, creando amenazas ocultas.',
    completada: false
  },
  {
    id: 'sacrificio-peon-apertura',
    nombre: 'Sacrificio de peón para abrir líneas',
    libro: 'Las lecciones de ajedrez — Morphy',
    nivel: 'Avanzado',
    descripcion: 'Sacrificar un peón para abrir una línea crítica hacia el rey enemigo, ganando iniciativa y ataque.',
    grid: [
      ['r','n','b','q','k','b','n','r'],
      ['p','p','p','p','p','p','p','p'],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' '],
      ['P','P','P','P','P','P','P','P'],
      ['R','N','B','Q','K','B','N','R']
    ],
    turno: BLANCO,
    jugadaEsperada: [[4,6],[4,4]], // e2-e4
    pista: 'Abre el centro sacrificando el peón si es necesario para lanzar el ataque.',
    explicacion: 'Morphy enseñaba que el sacrificio de peón en la apertura puede valer la pena si abre líneas para el ataque rápido al rey.',
    completada: false
  }
];
