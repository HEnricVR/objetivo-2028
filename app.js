// ==========================================
// 1. NAVEGACIÓN ENTRE PESTAÑAS
// ==========================================
function cambiarPestana(idPestana, botonPulsado) {
  document.querySelectorAll('.tab-content').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(idPestana).classList.add('active');
  botonPulsado.classList.add('active');
}

// ==========================================
// 2. CONTADORES Y CALENDARIO
// ==========================================
function actualizarContadores() {
  const hoy = new Date();
  const fecha18 = new Date('2027-11-17T00:00:00');
  const fechaCarnet = new Date('2028-01-01T00:00:00');
  const fechaOpos = new Date('2028-06-01T00:00:00');

  document.getElementById('dias-18').innerText = calcularDias(hoy, fecha18);
  document.getElementById('dias-carnet').innerText = calcularDias(hoy, fechaCarnet);
  document.getElementById('dias-opos').innerText = calcularDias(hoy, fechaOpos);
}

function calcularDias(fechaActual, fechaObjetivo) {
  const diferencia = fechaObjetivo - fechaActual;
  const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  return dias > 0 ? dias : 0;
}

let misEventos = JSON.parse(localStorage.getItem('eventosGuardados')) || [];

function mostrarEventos() {
  const lista = document.getElementById('lista-eventos');
  lista.innerHTML = '';
  const hoy = new Date();

  misEventos.forEach((evento, index) => {
    const diasFaltan = calcularDias(hoy, new Date(evento.fecha));
    const li = document.createElement('li');
    li.innerHTML = `
      <div>
        <strong>${evento.titulo}</strong> 
        <span style="color: #71717A; font-size: 0.9rem;">(${evento.fecha}) — Faltan <b>${diasFaltan} días</b></span>
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
  // EMPUJE
  { categoria: 'Empuje', nombre: 'Press de Banca Inclinado (Mancuerna)', marca: '3 series · 8 reps · ⏱ 2min 0s', nota: 'Baja lentamente las mancuernas hacia tus lados para sentir un buen estiramiento en la parte superior del pecho.', completado: false },
  { categoria: 'Empuje', nombre: 'Aperturas (Mancuerna)', marca: '3 series · 8 reps · ⏱ 1min 45s', nota: '', completado: false },
  { categoria: 'Empuje', nombre: 'Elevación Lateral (Mancuerna)', marca: '3 series · 8 reps · ⏱ 1min 45s', nota: 'Mantén el movimiento lento y controlado; evita usar el impulso.', completado: false },
  { categoria: 'Empuje', nombre: 'Press de Banca (Barra)', marca: '3 series · 8 reps · ⏱ 2min 30s', nota: 'Controla la barra al bajar y toca la parte inferior del pecho. Haz una pausa breve sin rebotar.', completado: false },
  { categoria: 'Empuje', nombre: 'Press de Hombros Sentado (Máquina)', marca: '3 series · 8 reps · ⏱ 2min 0s', nota: 'Mantén abdominales comprometidos y baja las manijas hasta que tus codos estén ligeramente bajo los hombros.', completado: false },
  { categoria: 'Empuje', nombre: 'Jalón de tríceps con cuerda', marca: '3 series · 8 reps · ⏱ 1min 30s', nota: 'Extiende tus brazos completamente en cada repetición y dóblalos lentamente en la bajada.', completado: false },
  // TIRÓN
  { categoria: 'Tirón', nombre: 'Encogimiento de Hombros (Mancuerna)', marca: '3 series · 8 reps · ⏱ 2min 0s', nota: 'Encoge los hombros hacia arriba en un movimiento fluido y haz una breve pausa arriba.', completado: false },
  { categoria: 'Tirón', nombre: 'Curl de Bíceps (Mancuerna)', marca: '3 series · 8 reps · ⏱ 1min 45s', nota: '', completado: false },
  { categoria: 'Tirón', nombre: 'Remo Inclinado (Barra)', marca: '3 series · 8 reps · ⏱ 2min 30s', nota: 'Baja lentamente el peso para sentir un estiramiento en la espalda alta. Tira fluido.', completado: false },
  { categoria: 'Tirón', nombre: 'Remo Sentado con Cable - Agarre Recto', marca: '3 series · 8 reps · ⏱ 2min 0s', nota: '', completado: false },
  { categoria: 'Tirón', nombre: 'Jalón al Pecho (Cable)', marca: '3 series · 8 reps · ⏱ 2min 0s', nota: 'Tira de la barra hacia tu pecho superior y extiende lentamente los brazos.', completado: false },
  { categoria: 'Tirón', nombre: 'Tirón a la Cara (Face Pull)', marca: '3 series · 8 reps · ⏱ 1min 30s', nota: 'Tira de la cuerda hacia tu cara activando la parte superior de la espalda.', completado: false },
  // PIERNAS
  { categoria: 'Piernas', nombre: 'Sentadilla (Mancuerna)', marca: '3 series · 8-10 reps · ⏱ 2min 30s', nota: '', completado: false },
  { categoria: 'Piernas', nombre: 'Press de Piernas (Prensa)', marca: '3 series · 8 reps · ⏱ 2min 0s', nota: '', completado: false },
  { categoria: 'Piernas', nombre: 'Elevación de glúteos y femorales', marca: '3 series · 8 reps · ⏱ 2min 0s', nota: 'Sostén un disco o mancuerna si haces más de 15 reps con tu peso. RPE 8-9.', completado: false },
  { categoria: 'Piernas', nombre: 'Curl de Piernas Acostado (Máquina)', marca: '3 series · 8 reps · ⏱ 2min 0s', nota: 'Extiende lentamente tus piernas sintiendo el estiramiento en los isquiotibiales.', completado: false },
  { categoria: 'Piernas', nombre: 'Extensión de Pierna', marca: '3 series · 8 reps · ⏱ 2min 0s', nota: 'Haz las repeticiones lentamente y con buen control.', completado: false },
  { categoria: 'Piernas', nombre: 'Elevación de Gemelos de Pie (Máquina)', marca: '3 series · 8 reps · ⏱ 2min 0s', nota: 'Baja lentamente los talones y haz una pausa breve abajo sin rebotar.', completado: false },
  // PRUEBAS OFICIALES
  { categoria: 'Pruebas Oficiales', nombre: 'Course Navette (Test de Leger)', marca: 'Objetivo: Superar Palier 10-11', nota: 'Prueba oficial de resistencia aeróbica de ida y vuelta en 20 metros.', completado: false },
  { categoria: 'Pruebas Oficiales', nombre: 'Circuito de Agilidad y Velocidad', marca: 'Objetivo: < 9.5 segundos', nota: 'Salida sentada en el suelo, paso por vallas y eslalon entre conos.', completado: false },
  { categoria: 'Pruebas Oficiales', nombre: 'Balón Medicinal / Dinamometría', marca: 'Registrar mejor marca (m / kg)', nota: 'Potencia de tren superior y fuerza de tracción.', completado: false }
];

let misEjercicios = JSON.parse(localStorage.getItem('entrenoHevyV2')) || rutinaHevyPorDefecto;

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
// 4. MÓDULO DE PIZARRA INTERACTIVA DE NOTAS
// ==========================================
const notasIniciales = [
  {
    id: 1,
    tipo: 'texto',
    contenido: '📌 Requisitos clave:\n- Cumplir 18 años (17/11/2027)\n- Título de Bachillerato\n- Carnet de conducir B\n- Superar pruebas físicas y temario en verano 2028',
    x: 30,
    y: 30,
    w: 280,
    h: 190
  }
];

let misNotas = JSON.parse(localStorage.getItem('pizarraNotas')) || notasIniciales;
let zIndexMax = 10;

function guardarPizarra() {
  localStorage.setItem('pizarraNotas', JSON.stringify(misNotas));
}

function renderizarPizarra() {
  const lienzo = document.getElementById('lienzo-pizarra');
  if (!lienzo) return;
  lienzo.innerHTML = '';

  misNotas.forEach((nota) => {
    const div = document.createElement('div');
    div.className = 'board-note';
    div.style.left = nota.x + 'px';
    div.style.top = nota.y + 'px';
    div.style.width = nota.w + 'px';
    div.style.height = nota.h + 'px';

    let cuerpoHTML = '';
    if (nota.tipo === 'texto') {
      cuerpoHTML = `<textarea class="note-textarea" placeholder="Escribe tu nota aquí..." oninput="actualizarTextoNota(${nota.id}, this.value)">${nota.contenido}</textarea>`;
    } else {
      cuerpoHTML = `
        <img src="${nota.imagen}" class="note-img" alt="Nota">
        <input type="text" class="note-caption" placeholder="Pie de foto..." value="${nota.contenido || ''}" oninput="actualizarTextoNota(${nota.id}, this.value)">
      `;
    }

    div.innerHTML = `
      <div class="note-header">
        <span class="note-grip">⠿ ARRASTRAR</span>
        <button class="note-close" onclick="borrarNota(${nota.id})">×</button>
      </div>
      <div class="note-body">
        ${cuerpoHTML}
      </div>
    `;

    // Guardar nuevo tamaño si el usuario estira la esquina inferior derecha
    div.addEventListener('mouseup', () => {
      nota.w = div.offsetWidth;
      nota.h = div.offsetHeight;
      guardarPizarra();
    });

    hacerArrastrable(div, nota);
    lienzo.appendChild(div);
  });
}

function hacerArrastrable(elemento, notaObj) {
  const cabecera = elemento.querySelector('.note-header');
  let arrastrando = false;
  let inicioX = 0, inicioY = 0;

  cabecera.addEventListener('pointerdown', (e) => {
    if (e.target.classList.contains('note-close')) return;
    arrastrando = true;
    zIndexMax++;
    elemento.style.zIndex = zIndexMax;
    inicioX = e.clientX - notaObj.x;
    inicioY = e.clientY - notaObj.y;
    cabecera.setPointerCapture(e.pointerId);
  });

  cabecera.addEventListener('pointermove', (e) => {
    if (!arrastrando) return;
    const lienzo = document.getElementById('lienzo-pizarra');
    let nuevaX = e.clientX - inicioX;
    let nuevaY = e.clientY - inicioY;

    // Evitar que se salga por arriba o por la izquierda
    nuevaX = Math.max(0, Math.min(nuevaX, lienzo.clientWidth - 80));
    nuevaY = Math.max(0, Math.min(nuevaY, lienzo.clientHeight - 40));

    notaObj.x = nuevaX;
    notaObj.y = nuevaY;
    elemento.style.left = nuevaX + 'px';
    elemento.style.top = nuevaY + 'px';
  });

  cabecera.addEventListener('pointerup', () => {
    if (arrastrando) {
      arrastrando = false;
      guardarPizarra();
    }
  });
}

function crearNotaTexto() {
  misNotas.push({
    id: Date.now(),
    tipo: 'texto',
    contenido: '',
    x: 40 + (misNotas.length * 20) % 200,
    y: 40 + (misNotas.length * 20) % 150,
    w: 240,
    h: 180
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
      // Comprimir imagen para que se guarde sin ocupar demasiada memoria
      const canvas = document.createElement('canvas');
      const maxAncho = 500;
      const escala = maxAncho / img.width;
      canvas.width = img.width > maxAncho ? maxAncho : img.width;
      canvas.height = img.width > maxAncho ? img.height * escala : img.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.75);

      misNotas.push({
        id: Date.now(),
        tipo: 'foto',
        imagen: dataUrl,
        contenido: '',
        x: 60,
        y: 60,
        w: 260,
        h: 260
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

// Iniciar toda la aplicación
actualizarContadores();
mostrarEventos();
mostrarEntreno();
renderizarPizarra();