# Auditoría quirúrgica — Chesslord

Fecha: 2026-11-12
Alcance: sitio estático (`index.html` + `js/*.js` + `css/style.css`), contenido de curso y entrenamiento.
Método: lectura completa de cada archivo, trazado del grafo de módulos ES, verificación de cada posición con el propio motor (`tests/content.test.mjs`).

---

## Veredicto

El sitio no está "roto por el navegador": **el módulo principal no llega a ejecutarse**. Dos archivos de datos tienen errores de sintaxis y, además, el arreglo anterior introdujo un error de zona temporal muerta (TDZ) en el arranque. Cualquier fallo del script tipo `type="module"` detiene **todo** el script: por eso no hay tablero y ningún botón responde, y por eso `Ctrl+Shift+R` no cambia nada.

Debajo de eso hay un segundo problema, más grave que el bug: **el contenido era ficticio**. La mayoría de las posiciones del curso y del entrenamiento no eran legales; la jugada "correcta" apuntaba a casillas vacías. El curso no enseñaba: aprobaba clics.

---

## Hallazgos bloqueantes (el sitio muere)

### B1 — `js/course-data.js`: declaración de export borrada
```js
// línea 4
import { BLANCO, NEGRO } from './chessconstants.js';
  {            // ← falta: export const CURSO_MODULOS = [
```
Sustituí la línea de declaración por el `import`, dejando un bloque `{...}` suelto. Error de sintaxis al parsear el módulo.

### B2 — `js/tactics-data.js`: mismo error
Idéntico: falta `export const TACTICAS = [` antes del primer objeto.

Consecuencia de B1+B2: `index.html` importa ambos módulos. Un solo módulo que no parsea invalida **todo** el grafo. El script entero se descarta: no se crea la partida, no se registran los `addEventListener`. El HTML estático se ve, la página está muerta.

### B3 — TDZ en el arranque (`courseEngine`)
```js
const courseEngine = new CourseEngine(CURSO_MODULOS, renderCursoInteractivo);
courseEngine.cargarLeccion(0, 0);   // dispara onStateChange → renderCursoInteractivo
                                    // → lee `courseEngine` antes de inicializarse → ReferenceError
```
`cargarLeccion` llama al callback durante la propia inicialización de la constante. Aunque B1/B2 se arreglen, esto vuelve a matar el script.

### B4 — Diagnóstico anterior equivocado
El commit `53bea41` atribuyó el fallo solo a TDZ y movió la instancia. No detectó B1/B2 porque `node --check` se ejecutó **antes** de la edición que rompió los archivos, y nunca se volvió a ejecutar sobre ellos ni se cargó el módulo completo.

---

## Hallazgos funcionales (con el sitio vivo)

### F1 — `el` fuera de alcance en táctica
En el manejador de clic del tablero de táctica se usa `el.classList.add('seleccionada')` dentro de una rama donde `el` no existe. `ReferenceError` al primer clic.

### F2 — Barra de progreso inmóvil
`renderCursoInteractivo` asigna `style.width` a `.curso-progreso-barra`, pero el ancho visible lo pinta `.curso-progreso-barra::before` al 0 %. La barra nunca avanza.

### F3 — Coordenadas duplicadas
`renderTableroSimple` añade las letras a–h al contenedor `.coordenadas` sin vaciarlo antes. Cada repintado acumula una fila más.

### F4 — Botón "Pista" de táctica sin efecto
Listener vacío.

### F5 — Aperturas no interactivas
Se muestra siempre la posición inicial; el campo `movimientos` no se aplica nunca. No hay jugadas, no hay comentarios, no hay objetivo visible en el tablero.

### F6 — Dos sistemas de entrenamiento duplicados
`seccion-entrenamiento` (EJERCICIOS dentro de `index.html`) y `seccion-tactica` (TACTICAS) hacen lo mismo con código distinto y coordenadas escritas de dos maneras. Duplicación que garantiza que uno de los dos se quede atrás.

---

## Hallazgos de contenido (la causa de "curso extremadamente pobre")

Verificado contra el motor: 9 de 17 lecciones y 6 de 8 tácticas tenían la jugada esperada sobre una casilla **vacía**, o sobre una pieza que no era la que decía el texto.

| Lección | Esperado | Realidad |
|---|---|---|
| `capablanca-desarrollo` | `[[6,7],[5,5]]` | f2 tiene un peón; el caballo está en g1 |
| `capablanca-centro` | `[[3,6],[4,5]]` | no hay pieza en e2 |
| `morphy-ataque-abierto` | `[[4,6],[5,4]]` | no hay pieza en g4 |
| `nimzo-bloqueo` | `[[2,5],[3,4]]` | caballo en c3, no en f3 |
| `nimzo-protetorado` | `[[3,5],[3,4]]` | torre en d2 (fila 5), no en d3 |
| `lasker-desequilibrio` | `[[2,6],[3,5]]` | casilla vacía |
| `lasker-ataque-rey` | `[[1,4],[1,3]]` | casilla vacía |
| `silman-desequilibrios` | `[[4,6],[4,5]]` | casilla vacía |
| `silman-linea-abierta` | `[[0,6],[0,5]]` | torre en a1, no en g8 |
| `clavada-basica` | `[[5,3],[2,0]]` | alfil en f4, destino a6 vacío |
| resto de tácticas | — | tableros vacíos con movimientos al aire |

Además, `enfilada_dama_lasker` colocaba dama blanca y rey negro en casillas contiguas: posición imposible.

**Causa raíz estructural:** el tablero se escribía a mano como matriz de 8×8 y la jugada como dos pares de coordenadas numéricas. Dos formatos distintos para la misma cosa, sin ninguna validación. Ese diseño hace inevitable el error.

---

## Solución (atómica, en este orden)

| # | Acción | Archivo |
|---|---|---|
| 1 | Utilidad de posición: FEN → tablero, SAN → movimiento legal, secuencia de jugadas → tablero. Única fuente de verdad. | `js/posicion.js` (nuevo) |
| 2 | Rehacer datos: cada lección y ejercicio declara `previas` (jugadas SAN desde la posición inicial) o `fen`, más `jugada` en SAN. Nada de coordenadas a mano. | `js/course-data.js`, `js/training-data.js` |
| 3 | Borrar `js/tactics-data.js`; tácticas, finales y aperturas pasan a ser categorías del mismo entrenamiento. | — |
| 4 | Aperturas con línea completa y comentario por jugada; el usuario juega las blancas y las negras responden solas. | `js/openings-data.js`, `js/linea.js` (nuevo) |
| 5 | Un solo motor de ejercicios, usado por curso y entrenamiento. Elimina `course-engine.js` y sus tres copias de render. | `js/puzzle.js` (nuevo), `js/course-engine.js` (borrado) |
| 6 | `index.html`: 4 pestañas (Jugar, Curso, Entrenamiento, Aperturas), sin curso de texto ni duplicados. | `index.html` |
| 7 | CSS: estilos de los paneles nuevos; borrar los muertos. | `css/style.css` |
| 8 | Test de contenido: toda posición legal, todo SAN resolubles, todas las aperturas jugables. | `tests/content.test.mjs` (nuevo) |

### Criterio de aceptación

- `node tests/content.test.mjs` en verde: cada `jugada` se resuelve a un movimiento legal en su posición; cada línea de apertura es legal jugada a jugada.
- `node tests/engine.test.mjs` sigue en verde (el motor no se toca).
- Navegación entre las 4 pestañas sin errores de consola; tablero de Jugar operativo.
- Cada lección se resuelve con un clic correcto en el tablero; la pista y la solución coinciden con la jugada validada.
- Progreso persistido en `localStorage`.

### Riesgos y límites declarados

- Las posiciones con `fen` no recuperan derechos de enroque: ninguna de las usadas lo necesita (comprobado por el test, que exige resolver `O-O` solo en posiciones construidas desde la jugada 1).
- El curso es ampliable por datos: añadir una lección es añadir un objeto, sin tocar código. No se finge que 11 lecciones sean un tratado; son el esqueleto correcto y verificado sobre el que crecer.
