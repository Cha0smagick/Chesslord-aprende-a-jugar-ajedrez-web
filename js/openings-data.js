// Aperturas — Chesslord
// Cada apertura es una línea SAN completa con el comentario de cada jugada.
// El entrenamiento hace que el usuario juegue las jugadas de las blancas.
// Autor: ALEJANDRO QUINTERO RUIZ

export const APERTURAS = [
  {
    id: 'italiana',
    nombre: 'Apertura Italiana',
    nivel: 'Básico',
    libro: 'Las lecciones de ajedrez — Morphy',
    descripcion: 'Desarrollo rápido con el alfil apuntando a f7. La apertura más directa para aprender los principios.',
    objetivo: 'Desarrollar las piezas hacia el centro y presionar el punto débil f7.',
    jugadas: [
      { san: 'e4', comentario: 'Ocupa el centro y abre alfil y dama.' },
      { san: 'e5', comentario: 'Las negras responden simétricamente y también ocupan el centro.' },
      { san: 'Nf3', comentario: 'Desarrolla atacando e5. No se puede defender con peones sin debilitar d5.' },
      { san: 'Nc6', comentario: 'Defiende e5 con una pieza, que es la forma correcta.' },
      { san: 'Bc4', comentario: 'El alfil apunta a f7, la casilla más débil del campo negro.' },
      { san: 'Bc5', comentario: 'Las negras copian la idea y apuntan a f2.' },
      { san: 'c3', comentario: 'Prepara d4 con apoyo de peón: el centro se construye, no se improvisa.' },
      { san: 'Nf6', comentario: 'Desarrolla y ataca e4, obligando a las blancas a decidir sobre el centro.' },
      { san: 'd4', comentario: 'Golpea el centro. Si las negras cambian, las blancas quedan con dos peones centrales y más espacio.' }
    ]
  },
  {
    id: 'espanola',
    nombre: 'Apertura Española (Ruy López)',
    nivel: 'Medio',
    libro: 'Manual de Ajedrez — Lasker',
    descripcion: 'La apertura clásica por excelencia. La clavada de b5 presiona e5 durante toda la partida.',
    objetivo: 'Presionar e5 con el alfil y ganar espacio sin romper la estructura.',
    jugadas: [
      { san: 'e4', comentario: 'Centro y desarrollo en un tiempo.' },
      { san: 'e5', comentario: 'Simetría y control de d4 y f4.' },
      { san: 'Nf3', comentario: 'Ataca e5 y desarrolla.' },
      { san: 'Nc6', comentario: 'Defiende e5 con pieza.' },
      { san: 'Bb5', comentario: 'Clava el caballo contra el rey. El caballo no puede moverse, pero tampoco cae: la amenaza es a largo plazo.' },
      { san: 'a6', comentario: 'Pregunta al alfil qué quiere hacer: cambiar en c6 o retirarse.' },
      { san: 'Ba4', comentario: 'Mantiene la clavada y conserva el alfil. La diagonal b3-g8 sigue viva.' },
      { san: 'Nf6', comentario: 'Desarrolla y ataca e4. Las negras crean su propio contragolpe central.' },
      { san: 'O-O', comentario: 'Rey seguro y torre conectada. Las blancas dejan que las negras tomen e4 y recuperan después.' }
    ]
  },
  {
    id: 'gambito-dama',
    nombre: 'Gambito de Dama',
    nivel: 'Básico',
    libro: 'Fundamentos del Ajedrez — Capablanca',
    descripcion: 'El sistema más sólido con peón de dama. Se ofrece un peón lateral para dominar el centro.',
    objetivo: 'Cambiar el peón lateral c por el peón central negro y controlar d4 y e4.',
    jugadas: [
      { san: 'd4', comentario: 'Ocupa el centro con el peón de dama.' },
      { san: 'd5', comentario: 'La respuesta simétrica; las negras también quieren el centro.' },
      { san: 'c4', comentario: 'Ofrece el peón c a cambio del peón central negro. No es un sacrificio: el peón se recupera.' },
      { san: 'e6', comentario: 'Rechaza el gambito y sostiene d5 con un segundo peón. Es la Defensa Ortodoxa.' },
      { san: 'Nc3', comentario: 'Presiona d5 por tercera vez. La presión sobre una casilla se acumula.' },
      { san: 'Nf6', comentario: 'Desarrolla y defiende d5. Ahora d5 tiene tres defensores y tres atacantes.' },
      { san: 'Bg5', comentario: 'Clava el caballo de f6, el defensor más importante de d5. La presión se convierte en amenaza.' }
    ]
  },
  {
    id: 'siciliana',
    nombre: 'Defensa Siciliana',
    nivel: 'Medio',
    libro: 'Manual de Ajedrez — Lasker',
    descripcion: 'La defensa más combativa contra 1.e4. Las negras no igualan el centro: lo atacan desde el flanco.',
    objetivo: 'Crear una posición asimétrica con contrajuego en la columna c.',
    jugadas: [
      { san: 'e4', comentario: 'El centro blanco, de momento sin oposición.' },
      { san: 'c5', comentario: 'Golpea d4, la casilla que el peón de e4 ya no cubre. Aquí empieza el desequilibrio.' },
      { san: 'Nf3', comentario: 'Desarrolla y prepara d4.' },
      { san: 'd6', comentario: 'Controla e5 y sostiene el futuro avance ...cxd4.' },
      { san: 'd4', comentario: 'Las blancas abren el centro; es su principal fuente de iniciativa.' },
      { san: 'cxd4', comentario: 'Cambian un peón de flanco por un peón central: las negras ganan la columna c semiabierta.' },
      { san: 'Nxd4', comentario: 'Recupera el peón y centraliza el caballo.' },
      { san: 'Nf6', comentario: 'Desarrolla y ataca e4, obligando a las blancas a defender.' },
      { san: 'Nc3', comentario: 'Defiende e4 y completa el desarrollo menor.' },
      { san: 'a6', comentario: 'Profilaxis: quita la casilla b5 a las piezas blancas antes de seguir con ...e6 o ...e5.' }
    ]
  },
  {
    id: 'francesa',
    nombre: 'Defensa Francesa',
    nivel: 'Medio',
    libro: 'Mi Sistema — Nimzowitsch',
    descripcion: 'Las negras construyen una cadena de peones y golpean la base del centro blanco.',
    objetivo: 'Disputar d4 con ...d5 y liberar después el alfil de c8.',
    jugadas: [
      { san: 'e4', comentario: 'Centro blanco.' },
      { san: 'e6', comentario: 'Prepara ...d5. El precio: el alfil de c8 queda encerrado y habrá que liberarlo.' },
      { san: 'd4', comentario: 'Las blancas ocupan el centro con dos peones.' },
      { san: 'd5', comentario: 'Golpea la base de la cadena: e4 queda sin el apoyo de d4 si este cambia.' },
      { san: 'Nc3', comentario: 'Defiende e4 y presiona d5.' },
      { san: 'Nf6', comentario: 'Ataca e4 otra vez y desarrolla. Toda la defensa gira sobre esa casilla.' },
      { san: 'e5', comentario: 'Las blancas ganan espacio y cierran el centro, pero la casilla d5 queda como objetivo negro permanente.' }
    ]
  },
  {
    id: 'india-rey',
    nombre: 'Defensa India de Rey',
    nivel: 'Avanzado',
    libro: 'Mi Sistema — Nimzowitsch',
    descripcion: 'Las negras ceden el centro para atacarlo después con piezas, no con peones.',
    objetivo: 'Presionar el centro blanco desde la distancia y lanzar el contraataque en el flanco de rey.',
    jugadas: [
      { san: 'd4', comentario: 'Centro blanco con peón de dama.' },
      { san: 'Nf6', comentario: 'Controla e4 desde lejos. Las negras no ocupan el centro: lo vigilan.' },
      { san: 'c4', comentario: 'Más espacio, pero también más objetivos.' },
      { san: 'g6', comentario: 'Prepara el desarrollo del alfil por g7, la gran diagonal.' },
      { san: 'Nc3', comentario: 'Defiende e4 y completa el centro.' },
      { san: 'Bg7', comentario: 'El alfil en la gran diagonal presiona d4 y todo el flanco de dama.' },
      { san: 'e4', comentario: 'Las blancas construyen un centro enorme. Cuanto más grande, más hay que defender.' },
      { san: 'd6', comentario: 'Sostiene el caballo de f6 y prepara ...e5 o ...c5 contra el centro.' },
      { san: 'Nf3', comentario: 'Desarrollo y amenaza e5.' },
      { san: 'O-O', comentario: 'Rey seguro antes de la tormenta. Las negras ya tienen listo el plan: ...e5 o ...c5 contra el centro blanco.' }
    ]
  }
];
