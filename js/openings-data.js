// Datos de aperturas — Chesslord
// Explicación de aperturas clásicas con sus objetivos estratégicos.
// Autor: ALEJANDRO QUINTERO RUIZ

export const APERTURAS = [
  {
    id: 'peon-del-rey',
    nombre: 'Peón del Rey (1.e4)',
    libro: 'Fundamentos del Ajedrez — Capablanca',
    nivel: 'Básico',
    movimientos: ['e4'],
    descripcion: 'La apertura más directa: ocupar el centro con el peón e, liberar al alfil y la dama, y preparar el desarrollo rápido.',
    objetivo: 'Controlar el centro (d5, f5) y abrir líneas para las piezas mayores.',
    libroReferencia: 'Capablanca — Fundamentos del Ajedrez, Capítulo 1'
  },
  {
    id: 'peon-de-dama',
    nombre: 'Peón de Dama (1.d4)',
    libro: 'Mi Sistema — Nimzowitsch',
    nivel: 'Básico',
    movimientos: ['d4'],
    descripcion: 'Ocupar el centro con el peón d, preparar el desarrollo de la dama y el alfil de c1, y crear una estructura sólida.',
    objetivo: 'Controlar c5 y e5, preparar el desarrollo posicional y el control de casillas clave.',
    libroReferencia: 'Nimzowitsch — Mi Sistema, Capítulo sobre el centro'
  },
  {
    id: 'defensa-siciliana',
    nombre: 'Defensa Siciliana (1.e4 c5)',
    libro: 'Manual de Ajedrez — Lasker',
    nivel: 'Medio',
    movimientos: ['e4', 'c5'],
    descripcion: 'Las negras desafían el centro blanco desde el flanco, creando una estructura asimétrica y oportunidades de contraataque.',
    objetivo: 'Las negras evitan la simetría y buscan juego activo en el flanco de dama y el centro.',
    libroReferencia: 'Lasker — Manual de Ajedrez, Defensa Siciliana'
  },
  {
    id: 'apertura-espanola',
    nombre: 'Apertura Española (Ruy López)',
    libro: 'Las lecciones de ajedrez — Morphy',
    nivel: 'Medio',
    movimientos: ['e4', 'e5', 'Cf3', 'Cc6', 'Ab5'],
    descripcion: 'Blancas pinzan el caballo de c6, presionando el peón e5 y preparando el enroque y el control del centro.',
    objetivo: 'Presionar el punto débil e5 y preparar un ataque coordinado contra el centro negro.',
    libroReferencia: 'Morphy — Partidas comentadas, Apertura Española'
  },
  {
    id: 'apertura-inglesa',
    nombre: 'Apertura Inglesa (1.c4)',
    libro: 'Reasumir el Desequilibrio — Silman',
    nivel: 'Medio-Avanzado',
    movimientos: ['c4'],
    descripcion: 'Controlar el centro de forma indirecta desde el flanco, preparando un juego posicional flexible.',
    objetivo: 'Controlar d5 sin ocupar el centro inmediatamente, permitiendo una estructura elástica.',
    libroReferencia: 'Silman — Reasumir el Desequilibrio, aperturas de flanco'
  },
  {
    id: 'defensa-india-de-dama',
    nombre: 'Defensa India de Dama',
    libro: 'Mi Sistema — Nimzowitsch',
    nivel: 'Medio-Avanzado',
    movimientos: ['d4', 'Cf6', 'c4', 'e6', 'Cc3', 'Bb4'],
    descripcion: 'Las negras dejan el centro blanco temporalmente sin peones y presionan con el alfil en b4, buscando contragolpe.',
    objetivo: 'Presionar el centro blanco con piezas y crear contrajuego en el flanco de dama.',
    libroReferencia: 'Nimzowitsch — Mi Sistema, Defensas Indianas'
  }
];
