# ♟️ Chesslord — Aprende a jugar ajedrez

Sitio web gratuito, profesional y abierto para aprender ajedrez desde cero, con motor de juego integrado, curso completo y tres niveles de dificultad contra la IA.

**Creado por ALEJANDRO QUINTERO RUIZ** con la misión de ayudar a las personas a aprender a jugar ajedrez de forma accesible, intuitiva y sin barreras.

🌐 **Ver en vivo:** https://Cha0smagick.github.io/Chesslord-aprende-a-jugar-ajedrez-web/

---

## ✨ Características

| Característica | Descripción |
|----------------|-------------|
| 🎯 **Motor de ajedrez completo** | Reglas oficiales: todas las piezas, enroque (corto y largo), captura al paso (en passant), promoción automática a dama, jaque, jaque mate y tablas por ahogado. |
| 🤖 **IA con 3 niveles** | **Básico** (principiantes), **Medio** (intermedio) y **Maestro** (Minimax + alfa-beta, profundidad 6). |
| 📚 **Curso completo** | 3 módulos con teoría y ejercicios interactivos con verificación automática. |
| 🎨 **Diseño profesional** | Tablero CSS Grid, piezas Unicode, resaltado de casillas válidas, indicador de jaque, historial en notación algebraica, modo oscuro y responsivo. |
| ♟️ **Elige tu color** | Juega con Blancas o Negras. La IA es tu contrincante. |
| ↩️ **Control de partida** | Deshacer movimiento y nueva partida en cualquier momento. |
| 📱 **Móvil y escritorio** | Diseño adaptable, sin instalación requerida. |
| 🌍 **Código abierto** | Proyecto educativo para usar, modificar y compartir libremente. |

---

## 🎮 Cómo jugar

1. Abre el sitio en cualquier navegador moderno.
2. Elige tu color (Blancas o Negras) y el nivel de la IA.
3. Haz clic en una de tus piezas para seleccionarla; las casillas válidas se resaltarán en azul.
4. Haz clic en la casilla destino para mover.
5. Si el rey está en jaque, se indicará en rojo. Debes salir del jaque en tu movimiento.
6. Usa **Deshacer** para retirar el último movimiento o **Nueva partida** para reiniciar.
7. Ve a la pestaña **Curso** para estudiar teoría y practicar con ejercicios.

---

## 📚 Curso incluido

| Módulo | Contenido |
|--------|-----------|
| **Módulo 1** | Las piezas y su movimiento: Rey, Reina, Torre, Alfil, Caballo, Peón. |
| **Módulo 2** | Reglas esenciales: Jaque, Jaque Mate, Enroque, Captura al paso, Tablas por ahogado. |
| **Módulo 3** | Táctica básica: Doble ataque (fork), Absorción (pin), Clavada (skewer). |

Cada lección incluye texto explicativo y ejercicios interactivos con retroalimentación inmediata.

---

## 🛠️ Tecnología

- **Motor de ajedrez:** Puerto a JavaScript estático del motor original de Chesslord (Python). Reglas completas sin dependencias externas.
- **IA:** Minimax con poda alfa-beta y tablas de piezas-casilla (PST).
- **Frontend:** HTML5 + CSS3 + JavaScript vanilla (módulos ES). Carga instantánea, sin frameworks pesados.
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
│   ├── chesslogic.js          # Motor de reglas (Board, movimientos legales)
│   ├── chessai.js             # IA minimax alfa-beta con 3 niveles
│   └── game.js                # Controlador de partida (humano vs IA)
├── .github/
│   └── workflows/
│       └── deploy.yml         # CI/CD a GitHub Pages
├── .nojekyll                  # Desactiva Jekyll en GitHub Pages
├── .gitignore
├── PLAN_TRABAJO.md            # Plan de desarrollo (technostrata)
└── README.md
```

---

## 🚀 Uso local

No necesitas instalar nada. Clona o descarga el repositorio y abre `index.html` en tu navegador:

```bash
git clone https://github.com/Cha0smagick/Chesslord-aprende-a-jugar-ajedrez-web.git
cd Chesslord-aprende-a-jugar-ajedrez-web
# Abre index.html en tu navegador
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
