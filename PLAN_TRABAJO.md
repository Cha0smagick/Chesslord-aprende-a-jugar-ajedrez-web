# Plan de Trabajo — Chesslord Web (Ajedrez para aprender)

**Autor del proyecto:** ALEJANDRO QUINTERO RUIZ
**Motor principal:** motor de ajedrez de Chesslord, portado a JavaScript estático y corregido contra perft.
**Despliegue:** GitHub Actions → GitHub Pages.

## Fases

### Fase 1 — Fundación y motor (completada)
- T1.1 Auditoría del motor original y validación con perft (posiciones de referencia).
- T1.2 `js/chessconstants.js`: valores de pieza y tablas PST completas.
- T1.3 `js/chesslogic.js`: generación de movimientos por pieza, enroque con todas sus
  restricciones, captura al paso, promoción y subpromoción, notación SAN y clave de posición.
- T1.4 `js/chessai.js`: negamax alfa-beta, ordenación MVV-LVA, quiescence, profundización
  iterativa con límite de tiempo y cancelación de búsquedas obsoletas.
- T1.5 `js/game.js`: controlador de partida, turnos, deshacer, tablas (ahogado, repetición
  triple, 50 movimientos, material insuficiente) y programación de la IA.
- T1.6 Pruebas: `tests/engine.test.mjs` (perft + reglas + IA), `tests/game.test.mjs`
  (controlador) y `tests/ui.e2e.mjs` (interfaz en Chrome real).

### Fase 2 — Frontend y tablero (completada)
- T2.1 Diseño UI/UX (`css/style.css`, `index.html`).
- T2.2 Tablero interactivo (CSS Grid, piezas Unicode, clic y teclado, orientación según color).
- T2.3 Resaltado de casillas válidas, capturas, última jugada e indicador de jaque.
- T2.4 Estado de partida, historial SAN, deshacer, reinicio y resultado.

### Fase 3 — Curso y niveles (completada)
- T3.1 Estructura del curso en `index.html`.
- T3.2 Teoría de los tres módulos.
- T3.3 Ejercicios interactivos con corrección tolerante a tildes y mayúsculas.
- T3.4 Niveles de IA aplicables sin reiniciar la partida.

### Fase 4 — CI/CD y despliegue (completada)
- T4.1 Sitio estático listo (`index.html`, `css/`, `js/`).
- T4.2 GitHub Actions workflow (`.github/workflows/deploy.yml`) — HECHO
- T4.3 Despliegue a GitHub Pages.
- T4.4 Atribución visible: "Creado por ALEJANDRO QUINTERO RUIZ".

### Fase 5 — QA y documentación (completada)
- T5.1 Pruebas del motor con perft.
- T5.2 Pruebas de integración motor-UI en navegador real.
- T5.3 Documentación de usuario (`README.md`).
- T5.4 Documentación técnica (este plan).
- T5.5 Revisión final.

## Orden de ejecución
Fase 1 → Fase 2 → Fase 3 → Fase 4 → Fase 5
