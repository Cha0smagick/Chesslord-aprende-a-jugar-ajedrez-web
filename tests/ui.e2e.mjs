// Prueba E2E del tablero en un Chrome real mediante CDP (sin dependencias).
// Requiere:  python -m http.server 8765  en la raíz del proyecto,
//            y Chrome con --remote-debugging-port=9333.
// Ejecutar:  node tests/ui.e2e.mjs
const PUERTO_CDP = 9333;
const URL = 'http://127.0.0.1:8765/index.html';

let fallos = 0;
let pruebas = 0;
function ok(nombre, condicion, extra = '') {
  pruebas++;
  if (!condicion) { fallos++; console.log(`  ✗ ${nombre} ${extra}`); }
}

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

const lista = await (await fetch(`http://127.0.0.1:${PUERTO_CDP}/json/list`)).json();
const pagina = lista.find((t) => t.type === 'page');
if (!pagina) { console.log('❌ No hay pestaña disponible en Chrome'); process.exit(1); }

const ws = new WebSocket(pagina.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));

let secuencia = 0;
const pendientes = new Map();
const erroresPagina = [];
ws.addEventListener('message', (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pendientes.has(msg.id)) { pendientes.get(msg.id)(msg); pendientes.delete(msg.id); }
  if (msg.method === 'Runtime.exceptionThrown') {
    erroresPagina.push(msg.params.exceptionDetails.text + ' ' +
      (msg.params.exceptionDetails.exception?.description || ''));
  }
  if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
    erroresPagina.push(msg.params.args.map((a) => a.value ?? a.description).join(' '));
  }
});
const enviar = (method, params = {}) => new Promise((res) => {
  const id = ++secuencia;
  pendientes.set(id, res);
  ws.send(JSON.stringify({ id, method, params }));
});

const evaluar = async (expresion) => {
  const r = await enviar('Runtime.evaluate', {
    expression: expresion, awaitPromise: true, returnByValue: true
  });
  if (r.result?.exceptionDetails) {
    throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text);
  }
  return r.result?.result?.value;
};

await enviar('Page.enable');
await enviar('Runtime.enable');
await enviar('Page.navigate', { url: URL });
await espera(2500);

console.log('\nInterfaz web');

const clic = (c, f) => `document.querySelector('[data-c="${c}"][data-f="${f}"]').click()`;
const leer = () => `({
  piezas: document.querySelectorAll('.pieza').length,
  estado: document.getElementById('estado').textContent,
  historial: document.getElementById('lista-jugadas').textContent,
  resultado: document.getElementById('resultado').textContent,
  detalle: document.getElementById('estado-detalle').textContent,
  ultima: document.querySelectorAll('.casilla.ultima').length,
  orientacion: document.querySelector('.coordenadas div').textContent
})`;

ok('sin errores de consola al cargar', erroresPagina.length === 0, `→ ${erroresPagina.join(' | ')}`);
let s = await evaluar(leer());
ok('32 piezas en el tablero', s.piezas === 32, `→ ${s.piezas}`);
ok('tablero orientado a negras', s.orientacion === 'h', `→ ${s.orientacion}`);
ok('la IA abrió y toca al humano', s.estado.includes('Turno: Negras'), `→ ${s.estado}`);
ok('historial con la jugada de la IA', /\d\.\s*\S+/.test(s.historial), `→ ${s.historial}`);
ok('última jugada resaltada', s.ultima === 2, `→ ${s.ultima}`);

/* El humano mueve e7-e5 */
await evaluar(`${clic(4, 1)}; ${clic(4, 3)}; true`);
await espera(3000);
s = await evaluar(leer());
ok('el humano pudo mover', s.historial.includes('e5'), `→ ${s.historial}`);
ok('la IA respondió', (s.historial.match(/[a-hRNBQKO]/g) || []).length >= 4, `→ ${s.historial}`);
ok('vuelve a tocar al humano', s.estado.includes('Turno: Negras'), `→ ${s.estado}`);
ok('sin errores tras mover', erroresPagina.length === 0, `→ ${erroresPagina.join(' | ')}`);

/* Deshacer: retira la respuesta de la IA y la jugada humana */
const antesDeshacer = s.historial;
await evaluar(`document.getElementById('btn-deshacer').click(); true`);
await espera(400);
s = await evaluar(leer());
ok('deshacer no congela la partida', s.estado.includes('Turno: Negras'), `→ ${s.estado}`);
ok('deshacer retira jugadas', s.historial.length < antesDeshacer.length,
  `→ "${s.historial}" (antes "${antesDeshacer}")`);
ok('deshacer deja mover', (await evaluar(`!!document.querySelector('[data-c="4"][data-f="1"]')`)) === true);

/* Teclado: seleccionar con Espacio y mover con Espacio */
await evaluar(`(() => {
  const celda = (c, f) => document.querySelector('[data-c="' + c + '"][data-f="' + f + '"]');
  const pulsar = (c, f) => celda(c, f).dispatchEvent(
    new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
  pulsar(4, 1); // e7
  pulsar(4, 3); // e5
  return true;
})()`);
await espera(300);
const teclado = await evaluar(`({
  historial: document.getElementById('lista-jugadas').textContent,
  seleccionadas: document.querySelectorAll('.casilla.seleccionada').length
})`);
ok('se puede mover con el teclado', teclado.historial.includes('e5'), `→ ${teclado.historial}`);
ok('el origen no queda resaltado tras mover', teclado.seleccionadas === 0,
  `→ ${teclado.seleccionadas}`);
await espera(2500); // deja responder a la IA antes de seguir
await evaluar(`document.getElementById('btn-reiniciar').click(); true`);
await espera(2500);

/* Curso visible y ejercicio corregido */
await evaluar(`document.querySelector('.btn-nav[data-seccion="curso"]').click(); true`);
await espera(300);
const curso = await evaluar(`({
  visible: getComputedStyle(document.getElementById('seccion-curso')).display !== 'none',
  lecciones: document.querySelectorAll('#modulos-curso .leccion').length,
  ejercicios: document.querySelectorAll('#modulos-curso .ejercicio').length,
  jugarOculto: getComputedStyle(document.getElementById('seccion-jugar')).display === 'none'
})`);
ok('la sección Curso se muestra', curso.visible);
ok('la sección Jugar se oculta', curso.jugarOculto);
ok('hay lecciones renderizadas', curso.lecciones > 10, `→ ${curso.lecciones}`);
ok('hay varios ejercicios', curso.ejercicios >= 5, `→ ${curso.ejercicios}`);

const corregido = await evaluar(`(() => {
  const caja = document.querySelector('#modulos-curso .ejercicio');
  caja.querySelector('input').value = '8';
  caja.querySelector('button').click();
  return caja.querySelector('.feedback').textContent;
})()`);
ok('ejercicio correcto se valida', corregido.includes('Correcto'), `→ ${corregido}`);

const incorrecto = await evaluar(`(() => {
  const caja = document.querySelectorAll('#modulos-curso .ejercicio')[1];
  caja.querySelector('input').value = 'zzz';
  caja.querySelector('button').click();
  return caja.querySelector('.feedback').textContent;
})()`);
ok('ejercicio incorrecto se rechaza', incorrecto.includes('Intenta'), `→ ${incorrecto}`);

/* Volver a jugar y cambiar de color */
await evaluar(`document.querySelector('.btn-nav[data-seccion="jugar"]').click(); true`);
await evaluar(`document.getElementById('btn-color-blancas').click(); true`);
await espera(2500);
s = await evaluar(leer());
ok('con blancas abre el humano', s.estado.includes('Turno: Blancas'), `→ ${s.estado}`);
ok('reinicio limpio', s.piezas === 32 && s.historial.trim() === '', `→ ${s.historial}`);
ok('tablero orientado a blancas', s.orientacion === 'a', `→ ${s.orientacion}`);

await evaluar(`${clic(4, 6)}; ${clic(4, 4)}; true`);
await espera(3000);
s = await evaluar(leer());
ok('el humano mueve con blancas', s.historial.includes('e4'), `→ ${s.historial}`);
ok('la IA negra responde', s.estado.includes('Turno: Blancas'), `→ ${s.estado}`);

/* Cambiar de nivel no borra la partida */
const antesNivel = s.historial;
await evaluar(`document.querySelector('.btn-nivel[data-nivel="BASICO"]').click(); true`);
await espera(300);
s = await evaluar(leer());
ok('cambiar nivel conserva la posición', s.historial === antesNivel, `→ "${s.historial}"`);

ok('sin errores acumulados', erroresPagina.length === 0, `→ ${erroresPagina.join(' | ')}`);

console.log(`\n${fallos === 0 ? '✅' : '❌'} ${pruebas - fallos}/${pruebas} pruebas correctas`);
ws.close();
process.exit(fallos === 0 ? 0 : 1);
