// Entrenamiento — Chesslord
// Ejercicios de táctica y de aperturas. Cada uno declara la posición
// (`previas` en SAN o `fen`) y la jugada ganadora (`jugada` en SAN).
// Autor: ALEJANDRO QUINTERO RUIZ

export const CATEGORIAS = ['Táctica', 'Apertura'];

export const EJERCICIOS = [
  {
    id: 'ultima-fila',
    categoria: 'Táctica',
    tema: 'Mate de la última fila',
    nivel: 'Básico',
    libro: 'Manual de Ajedrez — Lasker',
    descripcion: 'El rey enrocado sin casillas de escape es mate en una jugada. Busca la entrada por la octava fila.',
    fen: '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1',
    jugada: 'Ra8#',
    pista: 'La torre de a1 puede recorrer toda la octava fila. Los tres peones negros tapan la salida del rey.',
    explicacion: '1.Ta8 es mate. Los peones f7, g7 y h7 encierran al rey: no tiene ninguna casilla, y la torre controla toda la última fila. Por eso se deja siempre un peón que pueda avanzar: la «ventana de aire».'
  },
  {
    id: 'horquilla',
    categoria: 'Táctica',
    tema: 'Horquilla de caballo',
    nivel: 'Básico',
    libro: 'Reasumir el desequilibrio — Silman',
    descripcion: 'Un caballo puede atacar dos piezas a la vez. Encuentra la casilla desde la que golpea al rey y a la torre.',
    fen: '4k3/1r6/8/5N2/8/8/8/4K3 w - - 0 1',
    jugada: 'Nd6+',
    pista: 'Desde d6 el caballo mira a b7 y a e8 a la vez.',
    explicacion: '1.Cd6+ es una horquilla: da jaque al rey de e8 y ataca la torre de b7. El rey debe moverse y la torre cae. La horquilla funciona porque el jaque obliga: no hay tiempo para salvar la torre.'
  },
  {
    id: 'clavada',
    categoria: 'Táctica',
    tema: 'Clavada sobre el caballo',
    nivel: 'Básico',
    libro: 'Las lecciones de ajedrez — Morphy',
    descripcion: 'Una pieza clavada no puede moverse sin exponer al rey. Encuentra la jugada que deja al caballo de c6 sin escape.',
    previas: ['e4', 'e5', 'Nf3', 'Nc6'],
    jugada: 'Bb5',
    pista: 'El alfil de f1 tiene una diagonal abierta hacia b5.',
    explicacion: '3.Ab5 clava el caballo de c6 contra el rey de e8. El caballo sigue defendiendo e5, pero ya no puede moverse: si lo hace, el alfil captura al rey. Es la apertura Española, la clavada más jugada de la historia.'
  },
  {
    id: 'sacrificio-f7',
    categoria: 'Táctica',
    tema: 'Sacrificio en f7',
    nivel: 'Avanzado',
    libro: 'Las lecciones de ajedrez — Morphy',
    descripcion: 'El punto f7 vuelve a ser débil: solo lo defiende el rey. Acepta el sacrificio y calcula el ataque resultante.',
    previas: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5', 'd5', 'exd5', 'Nxd5'],
    jugada: 'Nxf7',
    pista: 'El caballo de g5 está a un salto de f7, defendido solo por el rey.',
    explicacion: '6.Cxf7! Rxf7 7.Df3+ gana el caballo de d5 con jaque y deja al rey negro sin enroque. Es el ataque Fried Liver: el material importa menos que la seguridad del rey. Si las negras no aceptan, pierden un peón y siguen con el rey expuesto.'
  },
  {
    id: 'apertura-dama',
    categoria: 'Apertura',
    tema: 'Abre con el peón de dama',
    nivel: 'Básico',
    libro: 'Mi Sistema — Nimzowitsch',
    descripcion: 'La otra gran primera jugada: ocupa el centro desde d4 y deja el peón de e libre para apoyarlo.',
    previas: [],
    jugada: 'd4',
    pista: 'Avanza dos casillas el peón que está delante de la dama.',
    explicacion: '1.d4 ocupa el centro, controla c5 y e5, y abre la diagonal del alfil de c1. Las partidas de peón de dama suelen ser más lentas y posicionales: primero se construye la estructura, después se ataca.'
  },
  {
    id: 'siciliana',
    categoria: 'Apertura',
    tema: 'Siciliana: contraataca por el flanco',
    nivel: 'Básico',
    libro: 'Manual de Ajedrez — Lasker',
    descripcion: 'Juegas con negras tras 1.e4. Responde sin copiar el centro blanco: ataca el peón de d4 desde el flanco.',
    previas: ['e4'],
    jugada: 'c5',
    pista: 'El peón de c negro puede golpear d4, la casilla que el peón de e4 ya no cubre.',
    explicacion: '1...c5 es la Siciliana. Las negras no igualan el centro: lo minan desde un lado. Se crea una posición asimétrica donde las blancas atacan al rey y las negras buscan contrajuego en la columna c. Es la defensa más combativa que existe.'
  },
  {
    id: 'francesa',
    categoria: 'Apertura',
    tema: 'Francesa: cierra el centro',
    nivel: 'Básico',
    libro: 'Mi Sistema — Nimzowitsch',
    descripcion: 'Con negras, prepara d5 con un peón que sostenga el centro antes de que las blancas lo ocupen del todo.',
    previas: ['e4'],
    jugada: 'e6',
    pista: 'Abre paso al peón de d para disputar el centro en la jugada siguiente.',
    explicacion: '1...e6 prepara 2...d5. La idea de Nimzowitsch: dejar que las blancas avancen y golpear la base de su cadena de peones. El precio es que el alfil de c8 queda encerrado, y toda la defensa francesa gira alrededor de liberarlo.'
  },
  {
    id: 'gambito-dama',
    categoria: 'Apertura',
    tema: 'Gambito de dama: ofrece el peón c',
    nivel: 'Medio',
    libro: 'Fundamentos del Ajedrez — Capablanca',
    descripcion: 'Las negras han ocupado d5. Ofrece el peón de c para cambiar tu peón lateral por el peón central negro.',
    previas: ['d4', 'd5'],
    jugada: 'c4',
    pista: 'Ataca d5 con el peón de c, ofreciéndolo a cambio del peón central.',
    explicacion: '2.c4 es el Gambito de Dama. No es un sacrificio real: si 2...dxc4, las blancas recuperan el peón con 3.e3 o 3.e4 y quedan con el centro. Si las negras lo rechazan, las blancas cambian en d5 y controlan la única columna central abierta.'
  }
];
