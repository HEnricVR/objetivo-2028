// ==========================================
// 1. NAVEGACIÓN ENTRE PESTAÑAS
// ==========================================
function cambiarPestana(idPestana, botonPulsado) {
  document.querySelectorAll('.tab-content').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  const seccion = document.getElementById(idPestana);
  if (seccion) seccion.classList.add('active');
  if (botonPulsado) botonPulsado.classList.add('active');

  if (idPestana === 'pizarra') {
    renderizarPizarra();
  }
}

// ==========================================
// 2. CONTADORES Y CALENDARIO
// ==========================================
function calcularDias(fechaActual, fechaObjetivo) {
  const diferencia = fechaObjetivo - fechaActual;
  const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  return dias > 0 ? dias : 0;
}

function actualizarContadores() {
  const hoy = new Date();
  const el18 = document.getElementById('dias-18');
  const elCarnet = document.getElementById('dias-carnet');
  const elOpos = document.getElementById('dias-opos');

  if (el18) el18.innerText = calcularDias(hoy, new Date('2027-11-17T00:00:00'));
  if (elCarnet) elCarnet.innerText = calcularDias(hoy, new Date('2028-01-01T00:00:00'));
  if (elOpos) elOpos.innerText = calcularDias(hoy, new Date('2028-06-01T00:00:00'));
}

let misEventos = [];
try {
  misEventos = JSON.parse(localStorage.getItem('eventosGuardados')) || [];
} catch (e) {
  misEventos = [];
}

function mostrarEventos() {
  const lista = document.getElementById('lista-eventos');
  if (!lista) return;
  lista.innerHTML = '';
  const hoy = new Date();

  misEventos.forEach((evento, index) => {
    const diasFaltan = calcularDias(hoy, new Date(evento.fecha));
    const li = document.createElement('li');
    li.innerHTML = `
      <div>
        <strong>${evento.titulo}</strong> 
        <span style="color: #8E8E98; font-size: 0.9rem;">(${evento.fecha}) — Faltan <b>${diasFaltan} días</b></span>
      </div>
      <button class="btn-delete" onclick="borrarEvento(${index})">Borrar</button>
    `;
    lista.appendChild(li);
  });
}

function agregarEvento() {
  const titulo = document.getElementById('evento-titulo').value;
  const fecha = document.getElementById('evento-fecha').value;
  if (!titulo || !fecha) return alert('Escribe un nombre y selecciona una fecha.');

  misEventos.push({ titulo, fecha });
  localStorage.setItem('eventosGuardados', JSON.stringify(misEventos));
  document.getElementById('evento-titulo').value = '';
  document.getElementById('evento-fecha').value = '';
  mostrarEventos();
}

function borrarEvento(index) {
  misEventos.splice(index, 1);
  localStorage.setItem('eventosGuardados', JSON.stringify(misEventos));
  mostrarEventos();
}

// ==========================================
// 3. MÓDULO DE ENTRENAMIENTO (RUTINA HEVY)
// ==========================================
let filtroActual = 'Empuje';

const rutinaHevyPorDefecto = [
  { categoria: 'Empuje', nombre: 'Press de Banca Inclinado (Mancuerna)', marca: '3 series · 8 reps · ⏱ 2min 0s', nota: 'Baja lentamente las mancuernas hacia tus lados para sentir un buen estiramiento en la parte superior del pecho.', completado: false },
  { categoria: 'Empuje', nombre: 'Aperturas (Mancuerna)', marca: '3 series · 8 reps · ⏱ 1min 45s', nota: '', completado: false },
  { categoria: 'Empuje', nombre: 'Elevación Lateral (Mancuerna)', marca: '3 series · 8 reps · ⏱ 1min 45s', nota: 'Mantén el movimiento lento y controlado; evita usar el impulso.', completado: false },
  { categoria: 'Empuje', nombre: 'Press de Banca (Barra)', marca: '3 series · 8 reps · ⏱ 2min 30s', nota: 'Controla la barra al bajar y toca la parte inferior del pecho. Haz una pausa breve sin rebotar.', completado: false },
  { categoria: 'Empuje', nombre: 'Press de Hombros Sentado (Máquina)', marca: '3 series · 8 reps · ⏱ 2min 0s', nota: 'Mantén abdominales comprometidos y baja las manijas hasta que tus codos estén ligeramente bajo los hombros.', completado: false },
  { categoria: 'Empuje', nombre: 'Jalón de tríceps con cuerda', marca: '3 series · 8 reps · ⏱ 1min 30s', nota: 'Extiende tus brazos completamente en cada repetición y dóblalos lentamente en la bajada.', completado: false },
  { categoria: 'Tirón', nombre: 'Encogimiento de Hombros (Mancuerna)', marca: '3 series · 8 reps · ⏱ 2min 0s', nota: 'Encoge los hombros hacia arriba en un movimiento fluido y haz una breve pausa arriba.', completado: false },
  { categoria: 'Tirón', nombre: 'Curl de Bíceps (Mancuerna)', marca: '3 series · 8 reps · ⏱ 1min 45s', nota: '', completado: false },
  { categoria: 'Tirón', nombre: 'Remo Inclinado (Barra)', marca: '3 series · 8 reps · ⏱ 2min 30s', nota: 'Baja lentamente el peso para sentir un estiramiento en la espalda alta. Tira fluido.', completado: false },
  { categoria: 'Tirón', nombre: 'Remo Sentado con Cable - Agarre Recto', marca: '3 series · 8 reps · ⏱ 2min 0s', nota: '', completado: false },
  { categoria: 'Tirón', nombre: 'Jalón al Pecho (Cable)', marca: '3 series · 8 reps · ⏱ 2min 0s', nota: 'Tira de la barra hacia tu pecho superior y extiende lentamente los brazos.', completado: false },
  { categoria: 'Tirón', nombre: 'Tirón a la Cara (Face Pull)', marca: '3 series · 8 reps · ⏱ 1min 30s', nota: 'Tira de la cuerda hacia tu cara activando la parte superior de la espalda.', completado: false },
  { categoria: 'Piernas', nombre: 'Sentadilla (Mancuerna)', marca: '3 series · 8-10 reps · ⏱ 2min 30s', nota: '', completado: false },
  { categoria: 'Piernas', nombre: 'Press de Piernas (Prensa)', marca: '3 series · 8 reps · ⏱ 2min 0s', nota: '', completado: false },
  { categoria: 'Piernas', nombre: 'Elevación de glúteos y femorales', marca: '3 series · 8 reps · ⏱ 2min 0s', nota: 'Sostén un disco o mancuerna si haces más de 15 reps con tu peso. RPE 8-9.', completado: false },
  { categoria: 'Piernas', nombre: 'Curl de Piernas Acostado (Máquina)', marca: '3 series · 8 reps · ⏱ 2min 0s', nota: 'Extiende lentamente tus piernas sintiendo el estiramiento en los isquiotibiales.', completado: false },
  { categoria: 'Piernas', nombre: 'Extensión de Pierna', marca: '3 series · 8 reps · ⏱ 2min 0s', nota: 'Haz las repeticiones lentamente y con buen control.', completado: false },
  { categoria: 'Piernas', nombre: 'Elevación de Gemelos de Pie (Máquina)', marca: '3 series · 8 reps · ⏱ 2min 0s', nota: 'Baja lentamente los talones y haz una pausa breve abajo sin rebotar.', completado: false },
  { categoria: 'Pruebas Oficiales', nombre: 'Course Navette (Test de Leger)', marca: 'Objetivo: Superar Palier 10-11', nota: 'Prueba oficial de resistencia aeróbica de ida y vuelta en 20 metros.', completado: false },
  { categoria: 'Pruebas Oficiales', nombre: 'Circuito de Agilidad y Velocidad', marca: 'Objetivo: < 9.5 segundos', nota: 'Salida sentada en el suelo, paso por vallas y eslalon entre conos.', completado: false },
  { categoria: 'Pruebas Oficiales', nombre: 'Balón Medicinal / Dinamometría', marca: 'Registrar mejor marca (m / kg)', nota: 'Potencia de tren superior y fuerza de tracción.', completado: false }
];

let misEjercicios = [];
try {
  misEjercicios = JSON.parse(localStorage.getItem('entrenoHevyV2')) || rutinaHevyPorDefecto;
} catch (e) {
  misEjercicios = rutinaHevyPorDefecto;
}

function guardarEntrenoLocal() {
  localStorage.setItem('entrenoHevyV2', JSON.stringify(misEjercicios));
}

function mostrarEntreno() {
  const contenedor = document.getElementById('contenedor-entreno');
  if (!contenedor) return;
  contenedor.innerHTML = '';

  misEjercicios.forEach((ej, index) => {
    if (filtroActual !== 'Todas' && ej.categoria !== filtroActual) return;

    const card = document.createElement('div');
    card.className = `workout-card ${ej.completado ? 'completed' : ''}`;
    card.innerHTML = `
      <div>
        <div class="workout-header">
          <div>
            <span class="card-tag">${ej.categoria.toUpperCase()}</span>
            <h4>${ej.nombre}</h4>
          </div>
        </div>
        <div style="margin-top: 10px;">
          <span class="workout-mark">${ej.marca}</span>
        </div>
        ${ej.nota ? `<p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 10px; line-height: 1.4;">${ej.nota}</p>` : ''}
      </div>
      <div class="workout-actions">
        <label class="check-label">
          <input type="checkbox" ${ej.completado ? 'checked' : ''} onchange="alternarCompletado(${index})">
          Hecho hoy
        </label>
        <div>
          <button class="btn-small" onclick="editarMarca(${index})">Anote / Peso</button>
          <button class="btn-delete" style="margin-left:10px; font-size:0.85rem;" onclick="borrarEjercicio(${index})">Borrar</button>
        </div>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

function agregarEjercicio() {
  const categoria = document.getElementById('entreno-categoria').value;
  const nombre = document.getElementById('entreno-nombre').value;
  const marca = document.getElementById('entreno-marca').value;
  if (!nombre || !marca) return alert('Escribe el nombre del ejercicio y tu serie o marca.');

  misEjercicios.push({ categoria, nombre, marca, nota: '', completado: false });
  guardarEntrenoLocal();
  document.getElementById('entreno-nombre').value = '';
  document.getElementById('entreno-marca').value = '';
  mostrarEntreno();
}

function alternarCompletado(index) {
  misEjercicios[index].completado = !misEjercicios[index].completado;
  guardarEntrenoLocal();
  mostrarEntreno();
}

function editarMarca(index) {
  const nuevaMarca = prompt(`Actualiza tus series, peso en kg o marca para ${misEjercicios[index].nombre}:`, misEjercicios[index].marca);
  if (nuevaMarca !== null && nuevaMarca.trim() !== '') {
    misEjercicios[index].marca = nuevaMarca;
    guardarEntrenoLocal();
    mostrarEntreno();
  }
}

function borrarEjercicio(index) {
  misEjercicios.splice(index, 1);
  guardarEntrenoLocal();
  mostrarEntreno();
}

function filtrarEntreno(categoria, boton) {
  filtroActual = categoria;
  document.querySelectorAll('.pill-btn').forEach(btn => btn.classList.remove('active'));
  boton.classList.add('active');
  mostrarEntreno();
}

function reiniciarChecksEntreno() {
  misEjercicios.forEach(ej => ej.completado = false);
  guardarEntrenoLocal();
  mostrarEntreno();
}

// ==========================================
// 4. MÓDULO DE PIZARRA INTERACTIVA (PC Y MÓVIL)
// ==========================================
const notasIniciales = [
  {
    id: 1,
    tipo: 'texto',
    contenido: '📌 Requisitos clave:\n- Cumplir 18 años (17/11/2027)\n- Título de Bachillerato\n- Carnet de conducir B\n- Superar pruebas físicas y temario en verano 2028',
    x: 15,
    y: 15,
    w: 240,
    h: 190
  }
];

let misNotas = [];
try {
  const guardadas = JSON.parse(localStorage.getItem('pizarraNotasV2'));
  misNotas = Array.isArray(guardadas) ? guardadas : notasIniciales;
} catch (e) {
  misNotas = notasIniciales;
}

let zIndexMax = 20;

function guardarPizarra() {
  try {
    localStorage.setItem('pizarraNotasV2', JSON.stringify(misNotas));
  } catch (e) {
    alert('La foto es demasiado grande para la memoria del navegador. Prueba con otra o borra alguna nota.');
  }
}

function renderizarPizarra() {
  const lienzo = document.getElementById('lienzo-pizarra');
  if (!lienzo) return;
  lienzo.innerHTML = '';

  misNotas.forEach((nota) => {
    const div = document.createElement('div');
    div.className = 'board-note';
    div.style.left = (nota.x || 15) + 'px';
    div.style.top = (nota.y || 15) + 'px';
    div.style.width = (nota.w || 220) + 'px';
    div.style.height = (nota.h || 170) + 'px';

    let cuerpoHTML = '';
    if (nota.tipo === 'texto') {
      cuerpoHTML = `<textarea class="note-textarea" placeholder="Escribe tu nota aquí..." oninput="actualizarTextoNota(${nota.id}, this.value)">${nota.contenido || ''}</textarea>`;
    } else {
      cuerpoHTML = `
        <img src="${nota.imagen}" class="note-img" alt="Nota">
        <input type="text" class="note-caption" placeholder="Pie de foto..." value="${nota.contenido || ''}" oninput="actualizarTextoNota(${nota.id}, this.value)">
      `;
    }

    div.innerHTML = `
      <div class="note-header">
        <span class="note-grip">⠿ MOVER</span>
        <button type="button" class="note-close" onclick="borrarNota(${nota.id})">×</button>
      </div>
      <div class="note-body">
        ${cuerpoHTML}
      </div>
      <div class="note-resizer" title="Estirar tamaño">◢</div>
    `;

    activarGestosNota(div, nota);
    lienzo.appendChild(div);
  });
}

function activarGestosNota(elemento, notaObj) {
  const cabecera = elemento.querySelector('.note-header');
  const tirador = elemento.querySelector('.note-resizer');
  const lienzo = document.getElementById('lienzo-pizarra');

  let arrastrando = false;
  let redimensionando = false;
  let inicioX = 0, inicioY = 0;
  let startW = 0, startH = 0, startRX = 0, startRY = 0;

  // MOVER (Táctil y Ratón)
  cabecera.addEventListener('touchstart', (e) => {
    if (e.target.classList.contains('note-close')) return;
    e.preventDefault();
    arrastrando = true;
    zIndexMax++;
    elemento.style.zIndex = zIndexMax;
    const t = e.touches[0];
    inicioX = t.clientX - notaObj.x;
    inicioY = t.clientY - notaObj.y;
  }, { passive: false });

  cabecera.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('note-close')) return;
    arrastrando = true;
    zIndexMax++;
    elemento.style.zIndex = zIndexMax;
    inicioX = e.clientX - notaObj.x;
    inicioY = e.clientY - notaObj.y;
  });

  // REDIMENSIONAR (Táctil y Ratón)
  tirador.addEventListener('touchstart', (e) => {
    e.preventDefault();
    e.stopPropagation();
    redimensionando = true;
    zIndexMax++;
    elemento.style.zIndex = zIndexMax;
    const t = e.touches[0];
    startW = notaObj.w;
    startH = notaObj.h;
    startRX = t.clientX;
    startRY = t.clientY;
  }, { passive: false });

  tirador.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    redimensionando = true;
    zIndexMax++;
    elemento.style.zIndex = zIndexMax;
    startW = notaObj.w;
    startH = notaObj.h;
    startRX = e.clientX;
    startRY = e.clientY;
  });

  // MOVIMIENTO GLOBAL
  function moverGlobal(clientX, clientY) {
    if (arrastrando) {
      const maxAncho = (lienzo.clientWidth || 320) - 60;
      const maxAlto = (lienzo.clientHeight || 480) - 45;
      notaObj.x = Math.max(0, Math.min(clientX - inicioX, maxAncho));
      notaObj.y = Math.max(0, Math.min(clientY - inicioY, maxAlto));
      elemento.style.left = notaObj.x + 'px';
      elemento.style.top = notaObj.y + 'px';
    } else if (redimensionando) {
      notaObj.w = Math.max(150, startW + (clientX - startRX));
      notaObj.h = Math.max(130, startH + (clientY - startRY));
      elemento.style.width = notaObj.w + 'px';
      elemento.style.height = notaObj.h + 'px';
    }
  }

  window.addEventListener('touchmove', (e) => {
    if (!arrastrando && !redimensionando) return;
    e.preventDefault();
    const t = e.touches[0];
    moverGlobal(t.clientX, t.clientY);
  }, { passive: false });

  window.addEventListener('mousemove', (e) => {
    if (!arrastrando && !redimensionando) return;
    moverGlobal(e.clientX, e.clientY);
  });

  function soltarGlobal() {
    if (arrastrando || redimensionando) {
      arrastrando = false;
      redimensionando = false;
      guardarPizarra();
    }
  }

  window.addEventListener('touchend', soltarGlobal);
  window.addEventListener('mouseup', soltarGlobal);
}

function crearNotaTexto() {
  const offset = (misNotas.length * 18) % 90;
  misNotas.push({
    id: Date.now(),
    tipo: 'texto',
    contenido: '',
    x: 15 + offset,
    y: 15 + offset,
    w: 220,
    h: 170
  });
  guardarPizarra();
  renderizarPizarra();
}

function crearNotaFoto(event) {
  const archivo = event.target.files[0];
  if (!archivo) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const maxAncho = 450;
      const escala = maxAncho / img.width;
      canvas.width = img.width > maxAncho ? maxAncho : img.width;
      canvas.height = img.width > maxAncho ? img.height * escala : img.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);

      misNotas.push({
        id: Date.now(),
        tipo: 'foto',
        imagen: dataUrl,
        contenido: '',
        x: 20,
        y: 20,
        w: 220,
        h: 230
      });
      guardarPizarra();
      renderizarPizarra();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(archivo);
  event.target.value = '';
}

function actualizarTextoNota(id, nuevoTexto) {
  const nota = misNotas.find(n => n.id === id);
  if (nota) {
    nota.contenido = nuevoTexto;
    guardarPizarra();
  }
}

function borrarNota(id) {
  misNotas = misNotas.filter(n => n.id !== id);
  guardarPizarra();
  renderizarPizarra();
}

function limpiarPizarra() {
  if (confirm('¿Quieres borrar todas las notas de la pizarra?')) {
    misNotas = [];
    guardarPizarra();
    renderizarPizarra();
  }
}

// Iniciar todo al cargar
actualizarContadores();
mostrarEventos();
mostrarEntreno();
renderizarPizarra();