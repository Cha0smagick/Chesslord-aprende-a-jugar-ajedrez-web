# Plan de Trabajo — Chesslord Web (Ajedrez para aprender)

**Autor del proyecto:** ALEJANDRO QUINTERO RUIZ  
**Motor principal:** motor de ajedrez de Chesslord (Python original) portado a JavaScript estático para el navegador.  
**Despliegue:** GitHub Actions → GitHub Pages.

## Fases

### Fase 1 — Fundación y motor (bloqueante)
- T1.1 Auditoría motor Python (hecha: lógica correcta tras correcciones de enroque/en passant/turno)
- T1.2 Puerto `logic.py` + `constants.py` → `js/chesslogic.js`, `js/chessconstants.js`
- T1.3 Puerto `ai.py` → `js/chessai.js` con niveles BÁSICO (d2), MEDIO (d4), MAESTRO (d6)
- T1.4 Contrato motor ↔ UI (`js/game.js` como puente)
- T1.5 Pruebas unitarias motor JS (`tests/`)

### Fase 2 — Frontend y tablero (bloqueante)
- T2.1 Diseño UI/UX (`css/style.css`, `index.html`)
- T2.2 Tablero interactivo (CSS Grid, piezas Unicode, clic para mover)
- T2.3 Integración frontend ↔ motor (`js/game.js`)
- T2.4 Estado de partida, deshacer, reinicio, fin de partida (`js/game.js`)

### Fase 3 — Curso y niveles (bloqueante para curso)
- T3.1 Estructura del curso (`js/course.js`)
- T3.2 Contenido de teoría y lecciones (`js/course.js`)
- T3.3 Ejercicios interactivos (`js/course.js`)
- T3.4 Niveles de IA vinculados al curso (`js/game.js`)

### Fase 4 — CI/CD y despliegue (bloqueante)
- T4.1 Sitio estático listo (`index.html`, `css/`, `js/`)
- T4.2 GitHub Actions workflow (`.github/workflows/deploy.yml`) — HECHO
- T4.3 Despliegue a GitHub Pages
- T4.4 Atribución visible: "Creado por ALEJANDRO QUINTERO RUIZ"

### Fase 5 — QA y documentación
- T5.1 Pruebas web multiplataforma
- T5.2 Pruebas integración motor-UI
- T5.3 Documentación de usuario (`README.md`)
- T5.4 Documentación técnica
- T5.5 Revisión final

## Orden de ejecución
Fase 1 → Fase 2 → Fase 3 → Fase 4 → Fase 5
