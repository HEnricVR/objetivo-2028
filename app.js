// 1. Cambiar entre las 4 pestañas de la aplicación
function cambiarPestana(idPestana, botonPulsado) {
  // Ocultar todas las secciones
  const secciones = document.querySelectorAll('.tab-content');
  secciones.forEach(sec => sec.classList.remove('active'));

  // Desactivar todos los botones del menú
  const botones = document.querySelectorAll('.nav-btn');
  botones.forEach(btn => btn.classList.remove('active'));

  // Mostrar la sección elegida y marcar el botón en rojo
  document.getElementById(idPestana).classList.add('active');
  botonPulsado.classList.add('active');
}

// 2. Calcular los días restantes hasta tus metas
function actualizarContadores() {
  const hoy = new Date();

  // Meta 1: 18 años (17 de noviembre de 2027)
  const fecha18 = new Date('2027-11-17T00:00:00');
  // Meta 2: Carnet de conducir (estimado 1 de enero de 2028)
  const fechaCarnet = new Date('2028-01-01T00:00:00');
  // Meta 3: Verano de 2028 - Pruebas (1 de junio de 2028)
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

// 3. Guardar y mostrar tus propios exámenes o recordatorios
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

  if (!titulo || !fecha) {
    alert('Escribe un nombre y selecciona una fecha.');
    return;
  }

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

// Iniciar todo al abrir la página
actualizarContadores();
mostrarEventos();

// ==========================================
// 4. MÓDULO DE ENTRENAMIENTO CONFIGURABLE
// ==========================================

let filtroActual = 'Todas';

// Si es la primera vez que abres la app, cargamos 3 pruebas clave de ejemplo
const ejerciciosPorDefecto = [
  { categoria: 'Pruebas Oficiales', nombre: 'Course Navette (Resistencia)', marca: 'Objetivo: Palier 11', completado: false },
  { categoria: 'Pruebas Oficiales', nombre: 'Circuito de Agilidad', marca: 'Objetivo: < 9.5 seg', completado: false },
  { categoria: 'Fuerza / Tren Superior', nombre: 'Dominadas Estrictas', marca: '4 series x 10 reps', completado: false }
];

let misEjercicios = JSON.parse(localStorage.getItem('entrenoGuardado')) || ejerciciosPorDefecto;

function guardarEntrenoLocal() {
  localStorage.setItem('entrenoGuardado', JSON.stringify(misEjercicios));
}

function mostrarEntreno() {
  const contenedor = document.getElementById('contenedor-entreno');
  if (!contenedor) return;
  contenedor.innerHTML = '';

  misEjercicios.forEach((ej, index) => {
    // Filtrar por categoría si no está en "Todas"
    if (filtroActual !== 'Todas') {
      if (filtroActual === 'Pierna y Resistencia' && (ej.categoria !== 'Pierna y Potencia' && ej.categoria !== 'Cardio y Resistencia')) {
        return;
      } else if (filtroActual !== 'Pierna y Resistencia' && ej.categoria !== filtroActual) {
        return;
      }
    }

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
        <div style="margin-top: 12px;">
          <span class="workout-mark">${ej.marca}</span>
        </div>
      </div>
      <div class="workout-actions">
        <label class="check-label">
          <input type="checkbox" ${ej.completado ? 'checked' : ''} onchange="alternarCompletado(${index})">
          Hecho hoy
        </label>
        <div>
          <button class="btn-small" onclick="editarMarca(${index})">Editar marca</button>
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

  if (!nombre || !marca) {
    alert('Escribe el nombre del ejercicio y tu serie o marca.');
    return;
  }

  misEjercicios.push({ categoria, nombre, marca, completado: false });
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
  const nuevaMarca = prompt(`Actualiza tu serie o marca para ${misEjercicios[index].nombre}:`, misEjercicios[index].marca);
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

// Iniciar la lista de entrenamientos al cargar la página
mostrarEntreno();