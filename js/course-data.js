// Curso — Chesslord
// Cada lección declara una posición (`previas` en SAN desde el inicio, o `fen`)
// y la jugada clave (`jugada` en SAN). Las coordenadas las resuelve el motor.
// Autor: ALEJANDRO QUINTERO RUIZ

export const CURSO_MODULOS = [
  {
    id: 'capablanca',
    libro: 'Fundamentos del Ajedrez',
    autor: 'José Raúl Capablanca',
    nivel: 'Básico',
    descripcion: 'Los cuatro principios que Capablanca repetía a todo principiante: centro, desarrollo, cambios y seguridad del rey.',
    lecciones: [
      {
        id: 'capablanca-centro',
        tema: 'Ocupa el centro con un peón',
        nivel: 'Básico',
        libro: 'Fundamentos del Ajedrez — Capablanca',
        teoria: 'El centro son las casillas d4, d5, e4 y e5. Un peón en el centro controla dos casillas de la mitad rival, abre la diagonal del alfil y la columna de la dama. Capablanca abría casi siempre con el peón de rey: es la jugada que más piezas pone a trabajar de golpe.',
        previas: [],
        jugada: 'e4',
        pista: 'Adelanta dos casillas el peón que está delante del rey.',
        explicacion: '1.e4 ocupa e4, controla d5 y f5, y deja libres el alfil de f1 y la dama de d1. Compare con mover el peón de torre: el mismo tiempo, ninguna pieza activada.'
      },
      {
        id: 'capablanca-desarrollo',
        tema: 'Desarrolla antes de atacar',
        nivel: 'Básico',
        libro: 'Fundamentos del Ajedrez — Capablanca',
        teoria: 'Desarrollar es sacar las piezas de la primera fila a casillas donde miren al centro. El caballo vale más en f3 que en g1 porque desde f3 controla e5, d4, h4 y g5, y prepara el enroque.',
        previas: ['e4', 'e5'],
        jugada: 'Nf3',
        pista: 'Saca el caballo de g1 hacia f3.',
        explicacion: '1.Cf3 desarrolla con tempo: el caballo ataca e5 y ayuda a controlar d4. Además despeja el camino del enroque corto.'
      },
      {
        id: 'capablanca-cambio-centro',
        tema: 'Cambia hacia el centro',
        nivel: 'Medio',
        libro: 'Fundamentos del Ajedrez — Capablanca',
        teoria: 'Cuando cambias piezas, hazlo hacia el centro. Capturar con un peón lateral deja peones doblados y casillas débiles; capturar con el peón central mantiene la estructura sana.',
        previas: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6'],
        jugada: 'Bxc6',
        pista: 'El alfil de b5 puede tomar el caballo de c6.',
        explicacion: '4.Axc6 dxc6 deja a las negras con peones doblados en c6 y c7 y sin el caballo que defendía e5. Es el cambio clásico de la Española: se entrega un alfil bueno para dañar la estructura rival.'
      },
      {
        id: 'capablanca-enroque',
        tema: 'Pon el rey a salvo',
        nivel: 'Básico',
        libro: 'Fundamentos del Ajedrez — Capablanca',
        teoria: 'El rey en el centro estorba a sus propias piezas y es el blanco de todos los ataques. El enroque corto lo esconde detrás de tres peones y conecta las torres en una sola jugada.',
        previas: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6'],
        jugada: 'O-O',
        pista: 'Enroca corto: el rey va a g1 y la torre a f1.',
        explicacion: '4.O-O cumple dos objetivos en un tiempo: el rey queda protegido y la torre de h1 entra en el juego. Las piezas ya estaban desarrolladas; el rey era la última pieza sin hacer nada.'
      }
    ]
  },
  {
    id: 'morphy',
    libro: 'Las lecciones de ajedrez',
    autor: 'Paul Morphy',
    nivel: 'Básico-Medio',
    descripcion: 'Morphy ganaba desarrollando más rápido que nadie y golpeando el punto f7 antes de que el rival terminara de salir.',
    lecciones: [
      {
        id: 'morphy-italiana',
        tema: 'Apunta al punto débil f7',
        nivel: 'Básico',
        libro: 'Las lecciones de ajedrez — Morphy',
        teoria: 'f7 es la casilla más débil del inicio: solo la defiende el rey. El alfil de f1 apunta directamente a ella si se coloca en c4. La apertura italiana es el ejemplo más limpio de esta idea.',
        previas: ['e4', 'e5', 'Nf3', 'Nc6'],
        jugada: 'Bc4',
        pista: 'Saca el alfil de f1 por la diagonal que termina en f7.',
        explicacion: '3.Ac4 desarrolla el alfil a la diagonal a2-g8, la que apunta a f7. Con el caballo en f3 ya hay dos piezas mirando ese punto: la base del ataque italiano.'
      },
      {
        id: 'morphy-evans',
        tema: 'Sacrifica un peón por tiempo',
        nivel: 'Medio',
        libro: 'Las lecciones de ajedrez — Morphy',
        teoria: 'El gambito Evans entrega el peón b para ganar dos tiempos: abrir la columna b y obligar al alfil negro a moverse otra vez. Morphy demostró que el tiempo, en la apertura, vale más que un peón.',
        previas: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5'],
        jugada: 'b4',
        pista: 'Ofrece el peón de b para apartar al alfil de c5.',
        explicacion: '4.b4 ataca el alfil de c5. Si las negras aceptan con 4...Axb4, llega 5.c3 y el alfil debe volver a moverse: blancas han cambiado un peón por dos tiempos y el centro. Morphy jugaba esto constantemente.'
      }
    ]
  },
  {
    id: 'nimzowitsch',
    libro: 'Mi Sistema',
    autor: 'Aron Nimzowitsch',
    nivel: 'Medio',
    descripcion: 'Nimzowitsch enseñó a pensar en casillas, no en piezas: bloqueo, piezas en agujeros y control del centro a distancia.',
    lecciones: [
      {
        id: 'nimzo-bloqueo',
        tema: 'Bloquea el peón pasado',
        nivel: 'Medio',
        libro: 'Mi Sistema — Nimzowitsch',
        teoria: 'A un peón pasado no se le para con peones: se le para con una pieza colocada justo delante. El caballo es el bloqueador ideal porque controla las casillas de avance y las de rodeo, y ningún peón puede expulsarlo de frente.',
        fen: '8/8/8/3p4/8/8/2N5/4K2k w - - 0 1',
        jugada: 'Nd4',
        pista: 'El peón negro de d5 quiere avanzar a d4. Llega antes con el caballo.',
        explicacion: '1.Cd4 clava el peón: no puede avanzar porque la casilla de delante está ocupada y sus capturas son por los lados, no de frente. El caballo además mira c6, e6, f5 y b5, el resto de la carrera del peón.'
      },
      {
        id: 'nimzo-agujero',
        tema: 'Ocupa el agujero',
        nivel: 'Medio-Avanzado',
        libro: 'Mi Sistema — Nimzowitsch',
        teoria: 'Un agujero es una casilla que ningún peón enemigo puede volver a controlar. Una pieza propia instalada ahí no puede ser expulsada por peones y domina medio tablero. Para que sea segura, la pieza debe estar protegida por un peón propio.',
        fen: 'r1bqkb1r/pp3ppp/2np1n2/8/2P1P3/2N2N2/PP3PPP/R1BQKB1R w - - 0 1',
        jugada: 'Nd5',
        pista: 'Hay una casilla central que ningún peón negro puede atacar y que el peón de e4 defiende.',
        explicacion: '1.Cd5 ocupa d5. Ningún peón negro puede atacarla: los de c6 y e6 ya no existen como amenaza, y el peón de e4 la defiende. Si las negras cambian 1...Cxd5, 2.exd5 les deja un peón central pasado.'
      }
    ]
  },
  {
    id: 'silman',
    libro: 'Reasumir el desequilibrio',
    autor: 'Jeremy Silman',
    nivel: 'Medio',
    descripcion: 'Silman enseña a buscar el desequilibrio concreto de la posición y a construir el plan a partir de él.',
    lecciones: [
      {
        id: 'silman-columna-abierta',
        tema: 'Toma la única columna abierta',
        nivel: 'Medio',
        libro: 'Reasumir el desequilibrio — Silman',
        teoria: 'Una columna sin peones es una autopista: la torre la recorre entera y entra en la séptima fila. Antes de maniobrar con peones, pregúntate quién controla las columnas abiertas.',
        fen: '6k1/pp3ppp/8/8/8/8/PP3PPP/R5K1 w - - 0 1',
        jugada: 'Rd1',
        pista: 'Hay una columna sin un solo peón. Lleva la torre allí.',
        explicacion: '1.Td1 ocupa la columna d, que está limpia de peones de a a h. Desde d1 la torre puede entrar en d7 o d8, y ninguna pieza negra puede disputarle la columna sin cambiar.'
      }
    ]
  },
  {
    id: 'lasker',
    libro: 'Manual de Ajedrez',
    autor: 'Emanuel Lasker',
    nivel: 'Medio',
    descripcion: 'Lasker insistía en que el final se gana con el rey y los peones, no con las piezas.',
    lecciones: [
      {
        id: 'lasker-coronacion',
        tema: 'Corona el peón pasado',
        nivel: 'Básico',
        libro: 'Manual de Ajedrez — Lasker',
        teoria: 'En el final, un peón a una casilla de la coronación vale más que cualquier pieza. La dama nueva decide la partida, así que hay que empujar antes de que el rival reaccione.',
        fen: '6k1/P5p1/8/8/8/8/8/6K1 w - - 0 1',
        jugada: 'a8=Q',
        pista: 'El peón de a7 puede avanzar a la última fila.',
        explicacion: '1.a8=D corona y además da jaque al rey de g8. La dama nueva entra en el tablero con tempo: el rey negro debe responder antes de poder ocuparse del peón de g7.'
      },
      {
        id: 'lasker-rey-activo',
        tema: 'Activa el rey en el final',
        nivel: 'Medio',
        libro: 'Manual de Ajedrez — Lasker',
        teoria: 'Con pocas piezas el rey deja de ser un estorbo y se convierte en una pieza de ataque. En los finales de peones, el rey que llega antes al centro decide: gana espacio, defiende sus peones y bloquea los del rival.',
        fen: '8/8/4k3/8/4P3/4K3/8/8 w - - 0 1',
        jugada: 'Kd4',
        pista: 'Acerca el rey al centro, donde hay espacio y tu peón.',
        explicacion: '1.Rd4 centraliza el rey y se coloca delante de su propio peón, apoyando el avance e5. Las negras ya no pueden acercarse sin ceder la oposición.'
      }
    ]
  }
];
