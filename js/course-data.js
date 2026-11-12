// Datos del curso interactivo — Chesslord
// Contenido basado en libros clásicos de ajedrez.
// Autor: ALEJANDRO QUINTERO RUIZ
import { BLANCO, NEGRO } from './chessconstants.js';
  {
    id: 'mod1',
    libro: 'Fundamentos del Ajedrez',
    autor: 'José Raúl Capablanca',
    nivel: 'Básico',
    descripcion: 'Los fundamentos: valor de las piezas, movimiento y control de casillas clave.',
    lecciones: [
      {
        id: 'capablanca-valor-piezas',
        libro: 'Fundamentos del Ajedrez — Capablanca',
        tema: 'Valor relativo de las piezas',
        nivel: 'Básico',
        teoria: 'Cada pieza tiene un valor aproximado: Peón=1, Caballo=3, Alfil=3, Torre=5, Dama=9. Pero el valor real depende de la posición. Una pieza activa vale más que una pieza grande pasiva.',
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
        pista: 'Avanza el peón de e dos casillas para ocupar el centro y liberar piezas.',
        explicacion: '1.e4 es la jugada más fundamental: ocupa el centro, libera al alfil de c1 y a la dama, y controla casillas clave (d5, f5).',
        completada: false
      },
      {
        id: 'capablanca-desarrollo',
        libro: 'Fundamentos del Ajedrez — Capablanca',
        tema: 'Desarrollo antes del ataque',
        nivel: 'Básico',
        teoria: 'No lances el ataque antes de haber desarrollado tus piezas. Un caballo en el centro controla más casillas que uno en el borde.',
        grid: [
          ['r','n','b','q','k','b','n','r'],
          ['p','p','p','p','p','p','p','p'],
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ','P',' ',' ',' ',' '],
          [' ',' ',' ',' ',' ',' ',' ',' '],
          ['P','P','P',' ','P','P','P','P'],
          ['R','N','B','Q','K','B','N','R']
        ],
        turno: BLANCO,
        jugadaEsperada: [[6,7],[5,5]], // Ng1-f3
        pista: 'Desarrolla el caballo de g1 hacia f3, controlando el centro y preparando el enroque.',
        explicacion: '1.Cf3 desarrolla el caballo hacia el centro, ataca e5 (si hubiera peón negro) y prepara el enroque corto. Capablanca insistía en desarrollar antes de atacar.',
        completada: false
      },
      {
        id: 'capablanca-centro',
        libro: 'Fundamentos del Ajedrez — Capablanca',
        tema: 'Ocupar el centro con peones',
        nivel: 'Básico',
        teoria: 'El centro (d4, d5, e4, e5) es el corazón del tablero. Quien lo controla tiene más espacio para maniobrar.',
        grid: [
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ','p',' ',' ',' ',' ',' '], // peón negro en d5
          [' ',' ',' ','P',' ',' ',' ',' '], // peón blanco en d4
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ',' ',' ',' ',' ',' ']
        ],
        turno: BLANCO,
        jugadaEsperada: [[3,6],[4,5]], // e2-e4 (desde la posición simplificada)
        pista: 'Avanza el peón de e a e4 para desafiar el control negro del centro.',
        explicacion: 'Con peones en d4 y e4, Blancas controlan el centro y tienen más espacio para sus piezas. Las piezas negras tienen menos casillas útiles.',
        completada: false
      }
    ]
  },
  {
    id: 'mod2',
    libro: 'Las lecciones de ajedrez',
    autor: 'Paul Morphy',
    nivel: 'Básico-Medio',
    descripcion: 'Ataque rápido, desarrollo y aperturas abiertas al estilo Morphy.',
    lecciones: [
      {
        id: 'morphy-desarrollo-rapido',
        libro: 'Las lecciones de ajedrez — Morphy',
        tema: 'Desarrollo rápido y ataque al centro',
        nivel: 'Básico',
        teoria: 'Morphy ganaba partidos desarrollando todas sus piezas rápidamente y atacando antes de que el oponente estuviera listo.',
        grid: [
          ['r','n','b','q','k','b','n','r'],
          ['p','p','p','p','p','p','p','p'],
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ','P',' ',' ',' ',' '],
          [' ',' ',' ',' ',' ',' ',' ',' '],
          ['P','P','P',' ','P','P','P','P'],
          ['R','N','B','Q','K','B',' ','R']
        ],
        turno: BLANCO,
        jugadaEsperada: [[6,7],[5,5]], // Ng1-f3
        pista: 'Mueve el caballo de g1 a f3 para atacar e5 y desarrollar.',
        explicacion: '1.Cf3 sigue los principios de Morphy: desarrollo rápido, control del centro y preparación del enroque. El caballo en f3 presiona e5 y apoya d4.',
        completada: false
      },
      {
        id: 'morphy-ataque-abierto',
        libro: 'Las lecciones de ajedrez — Morphy',
        tema: 'Ataque en posición abierta',
        nivel: 'Medio',
        teoria: 'En posiciones abiertas, el ataque al rey es más efectivo. Abre líneas para tus torres y dama.',
        grid: [
          ['r',' ','b','q','k','b','n','r'],
          ['p','p','p','p','p','p','p','p'],
          [' ',' ','n',' ',' ',' ',' ',' '],
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ','P',' ',' ',' ',' ',' '],
          [' ',' ',' ',' ',' ',' ',' ',' '],
          ['P','P',' ','P','P','P','P','P'],
          ['R','N','B','Q','K','B','N','R']
        ],
        turno: BLANCO,
        jugadaEsperada: [[4,6],[5,4]], // e2-e4 (ajustado a la grilla simplificada)
        pista: 'Abre la línea central avanzando el peón e.',
        explicacion: '1.e4 abre la diagonal del alfil de c1 y la línea de la dama, creando amenazas directas contra el rey negro en el centro abierto.',
        completada: false
      }
    ]
  },
  {
    id: 'mod3',
    libro: 'Mi Sistema',
    autor: 'Aron Nimzowitsch',
    nivel: 'Medio-Avanzado',
    descripcion: 'Conceptos posicionales: bloqueo, protetorado, pieza sobrepasada y expansione.',
    lecciones: [
      {
        id: 'nimzo-bloqueo',
        libro: 'Mi Sistema — Nimzowitsch',
        tema: 'El bloqueo',
        nivel: 'Medio',
        teoria: 'Un peón pasado se detiene mejor con una pieza (caballo o alfil) colocada directamente delante de él. Esa pieza bloquea el avance y controla la casilla clave.',
        grid: [
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ','p',' ',' ',' ',' '], // peón negro pasado en d5
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ','N',' ',' ',' ',' ',' '], // caballo blanco en c3 puede ir a d5
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ',' ',' ',' ',' ',' ']
        ],
        turno: BLANCO,
        jugadaEsperada: [[2,5],[3,4]], // Cc3-d5 bloqueando el peón pasado
        pista: 'Coloca el caballo directamente delante del peón pasado negro en d5.',
        explicacion: '1.Cd5 bloquea el peón pasado. Un caballo delante de un peón pasado es el bloqueador ideal porque controla las casillas de escape y no puede ser expulsado fácilmente por otro peón.',
        completada: false
      },
      {
        id: 'nimzo-protetorado',
        libro: 'Mi Sistema — Nimzowitsch',
        tema: 'Protetorado',
        nivel: 'Medio',
        teoria: 'El protetorado consiste en colocar una pieza detrás de un peón pasado amigo para apoyarlo en su avance hacia coronación.',
        grid: [
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ','P',' ',' ',' ',' '], // peón pasado blanco en d5
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ','R',' ',' ',' ',' '], // torre blanca apoyando desde d2
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ',' ',' ',' ',' ',' ']
        ],
        turno: BLANCO,
        jugadaEsperada: [[3,5],[3,4]], // Td2-d5 (protetorado simplificado)
        pista: 'Mueve la torre detrás del peón pasado para apoyarlo.',
        explicacion: '1.Td5 coloca la torre detrás del peón pasado en d5, protegiéndolo y controlando la columna d. Nimzowitsch llamaba a esto "protetorado": la pieza protege al peón desde atrás.',
        completada: false
      }
    ]
  },
  {
    id: 'mod4',
    libro: 'Manual de Ajedrez',
    autor: 'Emanuel Lasker',
    nivel: 'Medio-Avanzado',
    descripcion: 'Desequilibrios, ataque y defensa, principios de finales.',
    lecciones: [
      {
        id: 'lasker-desequilibrio',
        libro: 'Manual de Ajedrez — Lasker',
        tema: 'Identificar el desequilibrio',
        nivel: 'Medio',
        teoria: 'Lasker enseñaba que cada posición tiene desequilibrios (pieza vs peones, espacio, seguridad del rey, estructura). El plan se basa en explotar tu ventaja.',
        grid: [
          [' ',' ',' ',' ','k',' ',' ',' '], // rey negro en e8
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ','p',' ',' ',' ',' '], // peón negro en d5
          [' ',' ','P',' ',' ',' ',' ',' '], // peón blanco en c4
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ',' ','K',' ',' ',' ']  // rey blanco en e1
        ],
        turno: BLANCO,
        jugadaEsperada: [[2,6],[3,5]], // c4-c5 avanzando peón
        pista: 'Avanza el peón de c para crear un peón pasado y desafiar el centro negro.',
        explicacion: '1.c5 desafía el centro y crea un peón pasado en la columna c. El desequilibrio es: Blancas tiene peón avanzado en el flanco de dama, mientras que el rey negro está expuesto en el centro.',
        completada: false
      },
      {
        id: 'lasker-ataque-rey',
        libro: 'Manual de Ajedrez — Lasker',
        tema: 'Ataque al rey enroqueado',
        nivel: 'Medio',
        teoria: 'Cuando el rey está enroqueado, ataca con peones para debilitar su casilla y abre líneas para tus piezas mayores.',
        grid: [
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ',' ','k',' ',' ',' '],
          [' ',' ','p',' ',' ',' ',' ',' '], // peón negro en c6
          [' ','P',' ',' ',' ',' ',' ',' '], // peón blanco en b2 puede ir a b4
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ',' ','K',' ',' ',' ']
        ],
        turno: BLANCO,
        jugadaEsperada: [[1,4],[1,3]], // b2-b4 para atacar en el flanco
        pista: 'Avanza el peón de b para crear presión en el flanco de dama.',
        explicacion: '1.b4 expande en el flanco de dama, creando debilidades en la estructura negra y preparando un ataque lateral contra el rey enroqueado.',
        completada: false
      }
    ]
  },
  {
    id: 'mod5',
    libro: 'Reasumir el Desequilibrio',
    autor: 'Jeremy Silman',
    nivel: 'Medio-Avanzado',
    descripcion: 'Pensamiento posicional: desequilibrios, planes, peones y piezas.',
    lecciones: [
      {
        id: 'silman-desequilibrios',
        libro: 'Reasumir el Desequilibrio — Silman',
        tema: 'Siete desequilibrios',
        nivel: 'Medio',
        teoria: 'Silman enseña a buscar: piezas superiores, estructura de peones, espacio, seguridad del rey, línea abierta, iniciativa y desarrollo. El plan nace de ahí.',
        grid: [
          ['r','n','b','q','k','b','n','r'],
          ['p','p','p','p','p','p','p','p'],
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ',' ','P',' ',' ',' '],
          [' ',' ',' ',' ',' ',' ',' ',' '],
          ['P','P','P','P',' ','P','P','P'],
          ['R','N','B','Q','K','B','N','R']
        ],
        turno: BLANCO,
        jugadaEsperada: [[4,6],[4,5]], // e2-e4 simplificado
        pista: 'Avanza el peón de e para ganar espacio y abrir líneas.',
        explicacion: '1.e4 gana espacio en el centro, abre la diagonal del alfil y crea más movilidad para las piezas blancas. Silman llamaría a esto ganar "espacio", uno de los siete desequilibrios.',
        completada: false
      },
      {
        id: 'silman-linea-abierta',
        libro: 'Reasumir el Desequilibrio — Silman',
        tema: 'Líneas abiertas para torres',
        nivel: 'Medio',
        teoria: 'Una torre en una línea abierta (columna sin peones) es muy poderosa. Busca abrir columnas para tus torres.',
        grid: [
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ',' ',' ',' ',' ',' '],
          ['r',' ',' ',' ',' ',' ',' ',' '], // torre negra en a8
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ',' ',' ',' ',' ',' '],
          [' ',' ',' ',' ',' ',' ',' ',' '],
          ['R',' ',' ',' ',' ',' ',' ',' ']  // torre blanca en a1
        ],
        turno: BLANCO,
        jugadaEsperada: [[0,6],[0,5]], // Ta1-a? (simplificado)
        pista: 'Busca abrir la columna a para tu torre.',
        explicacion: 'Cuando no hay peones en una columna, la torre puede entrar en la séptima octava fila y atacar peones débiles. Silman enfatiza buscar líneas abiertas como ventaja estratégica.',
        completada: false
      }
    ]
  },
  {
    id: 'mod6',
    libro: 'Grand Prix Attack / Táctica',
    autor: 'Evgeni Polugayevsky',
    nivel: 'Avanzado',
    descripcion: 'Ataque al rey, sacrificios y debilidades de color.',
    lecciones: [
      {
        id: 'polugaevsky-sacrificio',
        libro: 'Ataque al rey — Polugayevsky',
        tema: 'Sacrificio para abrir líneas',
        nivel: 'Avanzado',
        teoria: 'Un sacrificio de peón o pieza puede abrir líneas críticas hacia el rey enemigo. La iniciativa vale más que el material.',
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
        jugadaEsperada: [[4,6],[4,4]], // e2-e4 apertura
        pista: 'Abre el centro para lanzar el ataque.',
        explicacion: '1.e4 abre líneas para el alfil y la dama, iniciando el ataque. Polugayevsky enseñaba que en el ataque, el tiempo y la iniciativa son más importantes que el material.',
        completada: false
      }
    ]
  }
];

export const DIFICULTAD_ORDEN = ['Básico','Básico-Medio','Medio','Medio-Avanzado','Avanzado'];
