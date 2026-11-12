# Plan Atómico — Curso y Entrenamiento de Ajedrez (Chesslord Web)

**Objetivo:** Transformar el curso actual (extremadamente pobre) en un curso completo basado en libros famosos de ajedrez, con lecciones interactivas (aprender jugando), entrenamiento de aperturas y entrenamiento de movimientos conocidos (táctica/posicional), niveles básico a avanzado.

**Autor:** ALEJANDRO QUINTERO RUIZ

---

## Filosofía del plan

- **Aprender jugando:** cada lección tiene un tablero interactivo integrado donde el usuario encuentra la jugada clave.
- **Basado en libros reales:** contenido extraído/adaptado de obras clásicas (Capablanca, Nimzowitsch, Morphy, Lasker, Silman, Polugayevsky, etc.).
- **Atómico:** cada paso modifica un solo archivo o un conjunto pequeño, se verifica antes de continuar.
- **Progreso:** guardado en `localStorage` (lecciones completadas, ejercicios resueltos).

---

## Fase A — Infraestructura de datos (bloqueante)

### A.1 Crear `js/course-data.js`
Contiene todas las lecciones del curso, estructuradas por módulos inspirados en libros famosos.

Módulos previstos:
1. **Fundamentos** (Capablanca — *Fundamentos del Ajedrez*): piezas, movimiento, valor, casillas clave.
2. **Control del centro y posiciones abiertas** (Morphy — *Las lecciones de ajedrez*): peones centrales, desarrollo rápido, ataque al rey en centro abierto.
3. **Posicional y bloqueo** (Nimzowitsch — *Mi Sistema*): bloqueo, protetorado, pieza sobrepasada, expansione.
4. **Estrategia y planes** (Lasker — *Manual de Ajedrez*): teoría del desequilibrio, ataque y defensa, final.
5. **Desequilibrios y pensamiento posicional** (Silman — *Reasumir el Desequilibrio*): identificar desequilibrios, crear planes.
6. **Ataque al rey enroqueado** (Polugayevsky — diversas): sacrificios, pierna de peón, debilidades de color.

Cada lección: `{ id, libro, autor, tema, nivel, teoria, fen (posición inicial), jugadaEsperada (SAN o coords), explicacion, pistas }`.

### A.2 Crear `js/openings-data.js`
Aperturas comunes con explicación y jugadas clave.

Aperturas previstas:
- Peón del Rey (1.e4): principios, variantes abiertas.
- Peón de Dama (1.d4): principios, variantes cerradas.
- Defensa Siciliana (1.e4 c5): estructura, contraataque.
- Apertura Española (1.e4 e5 2.Cf3 Cc6 3.Ab5): principio de pin, presión en e5.
- Apertura Inglesa (1.c4): control indirecto del centro.
- Defensa India de Dama (1.d4 Cf6 2.c4 e6 3.Cc3 Bb4): presión posicional.

Cada apertura: `{ id, nombre, movimientosIniciales (SAN), descripcion, objetivo, nivel, libroReferencia }`.

### A.3 Crear `js/tactics-data.js`
Motivos tácticos con posiciones interactivas.

Motivos:
- Clavada (pin)
- Doble ataque (fork)
- Enfilada (skewer)
- Distracción (decoy)
- Aniquilamiento del defensor
- X-ray
- Sacrificio de peón para abrir líneas

Cada táctica: `{ id, nombre, descripcion, fen, jugadaEsperada, explicacion, nivel }`.

---

## Fase B — Motor de lecciones interactivas (bloqueante)

### B.1 Crear `js/course-engine.js`
Clase `CourseEngine` que gestiona:
- Carga de lección actual desde `course-data.js`.
- Renderizado del tablero de la lección (reutiliza `Board` de `chesslogic.js`).
- Validación de la jugada del usuario contra `jugadaEsperada`.
- Sistema de pistas y retroalimentación.
- Marcado de lección como completada en `localStorage`.
- Navegación entre lecciones (siguiente/anterior).

### B.2 Integrar en `index.html`
- Nueva sección `#seccion-curso-interactivo` (oculto por defecto).
- Tablero interactivo dentro de la lección.
- Botones: Pista, Ver solución, Siguiente lección.
- Barra de progreso (lecciones completadas / totales).

### B.3 Navegación
- Botón "Curso" en el header lleva a la vista interactiva (no al viejo texto plano).
- El viejo curso de texto se mantiene como referencia o se reemplaza.

---

## Fase C — Entrenamiento de aperturas (bloqueante)

### C.1 Crear `js/openings-engine.js`
- Muestra los primeros movimientos de una apertura.
- Usuario debe encontrar la continuación correcta (o se le muestra y explica).
- Explicación del objetivo de cada movimiento (control de centro, desarrollo, seguridad del rey).

### C.2 Integración en UI
- Nueva pestaña "Aperturas" o sección dentro de Entrenamiento.
- Lista de aperturas con nivel y objetivo.

---

## Fase D — Entrenamiento de movimientos/táctica conocido (bloqueante)

### D.1 Crear `js/tactics-engine.js`
- Posiciones de motivos tácticos con tablero interactivo.
- Niveles: básico (1 jugada), intermedio (2-3 jugadas), avanzado (combinaciones).
- Retroalimentación inmediata.

### D.2 Integración en UI
- Nueva pestaña "Táctica" dentro de Entrenamiento.

---

## Fase E — Progreso y persistencia (no bloqueante para MVP)

### E.1 `localStorage`
- Guardar `chesslord_progress`: array de IDs de lecciones completadas.
- Guardar `chesslord_openings`: array de aperturas estudiadas.
- Mostrar barra de progreso en UI.

---

## Fase E — QA y despliegue

### E.1 Verificar sintaxis JS de todos los archivos nuevos.
### E.2 Commit y push a `origin/main`.
### E.3 Esperar despliegue en GitHub Pages.

---

## Criterios de aceptación (Definition of Done)

- [ ] `js/course-data.js` existe con al menos 15 lecciones de 5 libros diferentes.
- [ ] `js/openings-data.js` existe con al menos 6 aperturas.
- [ ] `js/tactics-data.js` existe con al menos 8 motivos tácticos.
- [ ] `js/course-engine.js` renderiza una lección y valida la jugada esperada.
- [ ] `index.html` tiene sección interactiva de curso funcional.
- [ ] Se puede navegar entre lecciones y marcar como completadas.
- [ ] Sección de aperturas muestra al menos 6 aperturas con explicación.
- [ ] Sección de táctica muestra al menos 8 motivos con tablero interactivo.
- [ ] Sin errores de consola JS en el sitio desplegado.
- [ ] Commit y push exitosos a `origin/main`.

---

## Riesgos

- **Sobrecarga de datos:** mantener los archivos JS de datos pequeños y modulares.
- **FEN vs coordenadas:** usar coordenadas internas del motor (`[[c,f],[c,d]]`) para no depender de librerías externas de FEN.
- **Progreso en localStorage:** puede perderse si el usuario limpia caché; aceptar como limitación del MVP estático.

---

**Siguiente paso:** Ejecutar A.1 (crear `js/course-data.js`).
