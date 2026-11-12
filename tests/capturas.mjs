// Guarda capturas de pantalla del juego y del curso para revisión visual.
// Ejecutar: node tests/capturas.mjs  (requiere Chrome con --remote-debugging-port=9333)
import { writeFile } from 'node:fs/promises';

const lista = await (await fetch('http://127.0.0.1:9333/json/list')).json();
const pagina = lista.find((t) => t.type === 'page');
const ws = new WebSocket(pagina.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));

let id = 0;
const pend = new Map();
ws.addEventListener('message', (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); }
});
const enviar = (method, params = {}) => new Promise((res) => {
  const i = ++id;
  pend.set(i, res);
  ws.send(JSON.stringify({ id: i, method, params }));
});
const evaluar = (e) => enviar('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true });

await enviar('Emulation.setDeviceMetricsOverride', {
  width: 1280, height: 900, deviceScaleFactor: 1, mobile: false
});
await enviar('Page.navigate', { url: 'http://127.0.0.1:8765/index.html' });
await new Promise((r) => setTimeout(r, 2600));

const disparar = async (nombre) => {
  const r = await enviar('Page.captureScreenshot', { format: 'png' });
  await writeFile(`tests/captura-${nombre}.png`, Buffer.from(r.result.data, 'base64'));
  console.log(`guardada tests/captura-${nombre}.png`);
};

// Partida: humano con negras, ya con la jugada de la IA y una selección activa
await evaluar(`document.querySelector('[data-c="4"][data-f="1"]').click(); true`);
await new Promise((r) => setTimeout(r, 300));
await disparar('jugar');

await evaluar(`document.querySelector('.btn-nav[data-seccion="curso"]').click(); true`);
await new Promise((r) => setTimeout(r, 300));
await evaluar(`document.querySelector('#curso-lista .puzzle-item').click(); true`);
await new Promise((r) => setTimeout(r, 400));
await disparar('curso');

await evaluar(`document.querySelector('.btn-nav[data-seccion="entrenamiento"]').click(); true`);
await new Promise((r) => setTimeout(r, 300));
await evaluar(`document.querySelector('#entreno-lista .puzzle-item').click(); true`);
await new Promise((r) => setTimeout(r, 400));
await disparar('entrenamiento');

await evaluar(`document.querySelector('.btn-nav[data-seccion="aperturas"]').click(); true`);
await new Promise((r) => setTimeout(r, 300));
await evaluar(`document.querySelector('#aperturas-lista .puzzle-item').click(); true`);
await new Promise((r) => setTimeout(r, 400));
await disparar('aperturas');

// Móvil
await enviar('Emulation.setDeviceMetricsOverride', {
  width: 390, height: 844, deviceScaleFactor: 1, mobile: true
});
await evaluar(`document.querySelector('.btn-nav[data-seccion="jugar"]').click(); true`);
await new Promise((r) => setTimeout(r, 400));
await disparar('movil');

ws.close();
