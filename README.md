# ♟️ Chesslord — Aprende a jugar ajedrez

Sitio web gratuito, profesional y abierto para aprender ajedrez desde cero, con motor de juego integrado, curso completo y tres niveles de dificultad contra la IA.

**Creado por ALEJANDRO QUINTERO RUIZ** con la misión de ayudar a las personas a aprender a jugar ajedrez de forma accesible, intuitiva y sin barreras.

🌐 **Ver en vivo:** https://Cha0smagick.github.io/Chesslord-aprende-a-jugar-ajedrez-web/

---

## ✨ Características

| Característica | Descripción |
|----------------|-------------|
| 🎯 **Motor de reglas completo** | Todas las piezas, enroque corto y largo (con todas sus restricciones), captura al paso, promoción con subpromoción, jaque, jaque mate y ahogado. Validado con *perft* contra posiciones de referencia. |
| 🤝 **Tablas completas** | Ahogado, repetición triple, regla de 50 movimientos y material insuficiente. |
| 🤖 **IA con 3 niveles** | **Básico** (mirada corta y fallos deliberados), **Medio** y **Maestro** (negamax con poda alfa-beta, ordenación de jugadas, búsqueda de capturas y profundización iterativa con límite de tiempo). |
| ✍️ **Notación algebraica** | Historial en notación oficial (SAN), con desambiguación, capturas, enroques, coronaciones y signos de jaque/mate. |
| 📚 **Curso completo** | 3 módulos con teoría y ejercicios interactivos con corrección automática. |
| 🎨 **Diseño cuidado** | Tablero CSS Grid, piezas Unicode, resaltado de casillas válidas y de la última jugada, indicador de jaque, modo oscuro y diseño responsivo. |
| ♟️ **Elige tu color** | Juega con Blancas o Negras; el tablero gira automáticamente a tu lado. |
| ↩️ **Control de partida** | Deshacer (retira tu jugada y la respuesta de la IA) y nueva partida en cualquier momento. |
| ⌨️ **Accesible** | Casillas con etiqueta ARIA y activación por teclado (Enter o Espacio). |
| 🌍 **Código abierto** | Proyecto educativo para usar, modificar y compartir libremente. |

---

## 🎮 Cómo jugar

1. Abre el sitio en cualquier navegador moderno.
2. Elige tu color (Blancas o Negras) y el nivel de la IA. El nivel se cambia al instante, sin reiniciar.
3. Haz clic en una de tus piezas para seleccionarla; las casillas válidas se marcan con un punto y las capturas con un anillo.
4. Haz clic en la casilla destino para mover.
5. Si el rey está en jaque, se indica en rojo. Debes salir del jaque en tu movimiento.
6. Usa **Deshacer** para retirar tu última jugada o **Nueva partida** para reiniciar.
7. Ve a la pestaña **Curso** para estudiar teoría y practicar con ejercicios.

---

## 📚 Curso incluido

| Módulo | Contenido |
|--------|-----------|
| **Módulo 1** | Las piezas y su movimiento: Rey, Reina, Torre, Alfil, Caballo, Peón. |
| **Módulo 2** | Reglas esenciales: Jaque, Jaque Mate, Enroque, Captura al paso, Tablas por ahogado. |
| **Módulo 3** | Táctica básica: Doble ataque (fork), Clavada (pin), Enfilada (skewer). |

Cada lección incluye texto explicativo y ejercicios interactivos con corrección automática y tolerante a mayúsculas y tildes.

---

## 🛠️ Tecnología

- **Motor de reglas:** JavaScript puro, sin dependencias. Generación de movimientos por pieza y detección de ataques por barrido direccional.
- **IA:** negamax con poda alfa-beta, ordenación MVV-LVA, *quiescence* de capturas, profundización iterativa con presupuesto de tiempo y tablas de piezas-casilla (PST).
- **Frontend:** HTML5 + CSS3 + JavaScript vanilla (módulos ES). Carga instantánea, sin frameworks.
- **Despliegue:** GitHub Actions → GitHub Pages.

---

## 📂 Estructura del repositorio

```
Chesslord-aprende-a-jugar-ajedrez-web/
├── index.html                 # Aplicación principal (juego + curso)
├── css/
│   └── style.css              # Estilos profesionales y responsivos
├── js/
│   ├── chessconstants.js      # Constantes y tablas PST
│   ├── chesslogic.js          # Motor de reglas (Board, movimientos legales, SAN)
│   ├── chessai.js             # IA negamax alfa-beta con 3 niveles
│   └── game.js                # Controlador de partida (humano vs IA, tablas, deshacer)
├── tests/
│   ├── engine.test.mjs        # Perft + reglas especiales + notación + IA
│   ├── game.test.mjs          # Controlador: turnos, deshacer, resultados
│   └── ui.e2e.mjs             # Prueba de interfaz en Chrome real (CDP)
├── .github/
│   └── workflows/
│       └── deploy.yml         # CI/CD a GitHub Pages
├── .nojekyll                  # Desactiva Jekyll en GitHub Pages
└── README.md
```

Los ficheros `*.py` de la raíz son el **prototipo original de consola** con el que nació el proyecto. El motor de referencia y el que se publica es el de `js/`; el prototipo Python se conserva como documentación histórica y no recibe las correcciones del motor web.

---

## ✅ Pruebas

El motor se valida con *perft* contra seis posiciones de referencia publicadas (inicial, Kiwipete, finales, coronaciones y dos posiciones de prueba), además de reglas especiales, notación y comportamiento de la IA.

```bash
# Motor de reglas + IA
node tests/engine.test.mjs

# Controlador de partida (sin navegador)
node tests/game.test.mjs

# Interfaz real en Chrome (requiere servir el sitio y abrir Chrome con depuración)
python -m http.server 8765
chrome --headless=new --remote-debugging-port=9333 --user-data-dir=%TEMP%/chessprof about:blank
node tests/ui.e2e.mjs
```

---

## 🚀 Uso local

No necesitas instalar nada. Clona o descarga el repositorio y abre `index.html` en tu navegador. Para que los módulos ES carguen sin restricciones del navegador, sirve la carpeta por HTTP:

```bash
python -m http.server 8000
# Abre http://localhost:8000
```

---

## ☁️ Despliegue en GitHub Pages

El sitio está configurado para desplegarse automáticamente con **GitHub Actions**:

1. Sube el código a tu repositorio de GitHub.
2. Ve a **Settings → Pages**.
3. En **Build and deployment → Source**, selecciona **GitHub Actions**.
4. Haz un `push` a la rama `main`. El workflow `.github/workflows/deploy.yml` se encargará del resto.

Tu sitio estará disponible en:
`https://<tu-usuario>.github.io/Chesslord-aprende-a-jugar-ajedrez-web/`

---

## 👨‍💻 Autor

**Todo este proyecto fue creado por ALEJANDRO QUINTERO RUIZ** para ayudar a las personas a aprender a jugar ajedrez.

- GitHub: [@Cha0smagick](https://github.com/Cha0smagick)
- Repositorio: [Chesslord-aprende-a-jugar-ajedrez-web](https://github.com/Cha0smagick/Chesslord-aprende-a-jugar-ajedrez-web)

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible gratuitamente con fines educativos. Úsalo, modifícalo y compártelo libremente.

---

*Chesslord — Aprende ajedrez. Un movimiento a la vez.*
