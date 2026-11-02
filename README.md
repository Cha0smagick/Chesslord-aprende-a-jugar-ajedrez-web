# ♟️ Chesslord — Aprende a jugar ajedrez

Sitio web estático para aprender ajedrez desde cero, con motor de juego integrado, curso completo y tres niveles de dificultad contra la IA.

**Creado por ALEJANDRO QUINTERO RUIZ** con el objetivo de ayudar a las personas a aprender a jugar ajedrez de forma gratuita, intuitiva y profesional.

---

## 🚀 Ver la web

Desplegado con **GitHub Actions → GitHub Pages**.

URL del sitio: `https://<usuario>.github.io/Chesslord/` (configura GitHub Pages en el repositorio).

---

## 🛠️ Tecnología

- **Motor de ajedrez:** Puerto a JavaScript estático del motor original de Chesslord (Python). Reglas completas: enroque, captura al paso, promoción, jaque, jaque mate y ahogado.
- **IA:** Minimax con poda alfa-beta y tablas de piezas-casilla (PST). Tres niveles:
  - **Básico:** profundidad 2 — ideal para principiantes.
  - **Medio:** profundidad 4 — jugador intermedio.
  - **Maestro:** profundidad 6 — IA fuerte.
- **Frontend:** HTML5 + CSS3 + JavaScript vanilla (módulos ES). Sin dependencias externas, carga instantánea.
- **Despliegue:** GitHub Actions (`deploy.yml`) → GitHub Pages.

---

## 📂 Estructura del proyecto

```
Chesslord/
├── index.html                 # Página única (juego + curso)
├── css/
│   └── style.css              # Estilos profesionales y responsivos
├── js/
│   ├── chessconstants.js      # Constantes y tablas PST
│   ├── chesslogic.js          # Motor de reglas (Board, movimientos legales)
│   ├── chessai.js             # IA minimax alfa-beta con 3 niveles
│   └── game.js                # Controlador de partida (humano vs IA)
├── .github/
│   └── workflows/
│       └── deploy.yml         # CI/CD a GitHub Pages
├── PLAN_TRABAJO.md            # Plan de trabajo de la technostrata
└── README.md
```

---

## 🎮 Cómo usar

1. Abre `index.html` en cualquier navegador moderno.
2. Elige tu color (Blancas o Negras) y el nivel de la IA.
3. Haz clic en una pieza tuya y luego en la casilla destino para mover.
4. Las casillas válidas se resaltan en azul. El jaque se indica en rojo.
5. Usa **Deshacer** para retirar el último movimiento y **Nueva partida** para reiniciar.
6. Ve a la pestaña **Curso** para leer lecciones y hacer ejercicios interactivos.

---

## 📚 Curso incluido

El curso cubre:
- Módulo 1: Las piezas y su movimiento (rey, reina, torre, alfil, caballo, peón).
- Módulo 2: Reglas esenciales (jaque, jaque mate, enroque, al paso, tablas por ahogado).
- Módulo 3: Táctica básica (doble ataque, absorción, clavada).

Cada lección incluye teoría y ejercicios con verificación automática.

---

## 🧠 ¿Quién lo hizo?

**Todo este proyecto fue creado por ALEJANDRO QUINTERO RUIZ** para ayudar a las personas a aprender a jugar ajedrez.

---

## 📄 Licencia

Proyecto educativo de código abierto. Úsalo, modifícalo y compártelo libremente.
