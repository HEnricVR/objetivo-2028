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
// 4. MÓDULO DE ENTRENAMIENTO (RUTINA HEVY)
// ==========================================

let filtroActual = 'Empuje'; // Empieza mostrando el día de Empuje

const rutinaHevyPorDefecto = [
  // DÍA 1: EMPUJE
  {
    categoria: 'Empuje',
    nombre: 'Press de Banca Inclinado (Mancuerna)',
    marca: '3 series · 8 reps · ⏱ 2min 0s',
    nota: 'Baja lentamente las mancuernas tanto como puedas hacia tus lados para sentir un buen estiramiento en la parte superior del pecho.',
    completado: false
  },
  {
    categoria: 'Empuje',
    nombre: 'Aperturas (Mancuerna)',
    marca: '3 series · 8 reps · ⏱ 1min 45s',
    nota: '',
    completado: false
  },
  {
    categoria: 'Empuje',
    nombre: 'Elevación Lateral (Mancuerna)',
    marca: '3 series · 8 reps · ⏱ 1min 45s',
    nota: 'Mantén el movimiento lento y controlado; evita usar el impulso, especialmente cuando tus hombros comiencen a arder.',
    completado: false
  },
  {
    categoria: 'Empuje',
    nombre: 'Press de Banca (Barra)',
    marca: '3 series · 8 reps · ⏱ 2min 30s',
    nota: 'Controla la barra al bajar y toca la parte inferior del pecho. Haz una pausa breve y presiona sin rebotar.',
    completado: false
  },
  {
    categoria: 'Empuje',
    nombre: 'Press de Hombros Sentado (Máquina)',
    marca: '3 series · 8 reps · ⏱ 2min 0s',
    nota: 'Mantén abdominales comprometidos y baja las manijas hasta que tus codos estén ligeramente por debajo del nivel de los hombros.',
    completado: false
  },
  {
    categoria: 'Empuje',
    nombre: 'Jalón de tríceps con cuerda',
    marca: '3 series · 8 reps · ⏱ 1min 30s',
    nota: 'Extiende tus brazos completamente en cada repetición y dóblalos lentamente durante la parte negativa.',
    completado: false
  },

  // DÍA 2: TIRÓN
  {
    categoria: 'Tirón',
    nombre: 'Encogimiento de Hombros (Mancuerna)',
    marca: '3 series · 8 reps · ⏱ 2min 0s',
    nota: 'Encoge los hombros hacia arriba en un solo movimiento fluido y haz una breve pausa en la posición superior.',
    completado: false
  },
  {
    categoria: 'Tirón',
    nombre: 'Curl de Bíceps (Mancuerna)',
    marca: '3 series · 8 reps · ⏱ 1min 45s',
    nota: '',
    completado: false
  },
  {
    categoria: 'Tirón',
    nombre: 'Remo Inclinado (Barra)',
    marca: '3 series · 8 reps · ⏱ 2min 30s',
    nota: 'Baja lentamente el peso para sentir un estiramiento en la parte superior de la espalda. Tira en un movimiento fluido.',
    completado: false
  },
  {
    categoria: 'Tirón',
    nombre: 'Remo Sentado con Cable - Agarre Recto',
    marca: '3 series · 8 reps · ⏱ 2min 0s',
    nota: '',
    completado: false
  },
  {
    categoria: 'Tirón',
    nombre: 'Jalón al Pecho (Cable)',
    marca: '3 series · 8 reps · ⏱ 2min 0s',
    nota: 'Tira de la barra hacia tu pecho superior y extiende lentamente los brazos sintiendo el estiramiento en los dorsales.',
    completado: false
  },
  {
    categoria: 'Tirón',
    nombre: 'Tirón a la Cara (Face Pull)',
    marca: '3 series · 8 reps · ⏱ 1min 30s',
    nota: 'Tira de la cuerda hacia tu cara activando la parte superior de la espalda y manteniendo la posición un momento.',
    completado: false
  },

  // DÍA 3: PIERNAS
  {
    categoria: 'Piernas',
    nombre: 'Sentadilla (Mancuerna)',
    marca: '3 series · 8-10 reps · ⏱ 2min 30s',
    nota: '',
    completado: false
  },
  {
    categoria: 'Piernas',
    nombre: 'Press de Piernas (Prensa)',
    marca: '3 series · 8 reps · ⏱ 2min 0s',
    nota: '',
    completado: false
  },
  {
    categoria: 'Piernas',
    nombre: 'Elevación de glúteos y femorales',
    marca: '3 series · 8 reps · ⏱ 2min 0s',
    nota: 'Sostén un disco o mancuerna si puedes hacer más de 15 reps con peso corporal. Entrena a RPE 8-9.',
    completado: false
  },
  {
    categoria: 'Piernas',
    nombre: 'Curl de Piernas Acostado (Máquina)',
    marca: '3 series · 8 reps · ⏱ 2min 0s',
    nota: 'Extiende lentamente tus piernas sintiendo un estiramiento intenso en tus isquiotibiales.',
    completado: false
  },
  {
    categoria: 'Piernas',
    nombre: 'Extensión de Pierna',
    marca: '3 series · 8 reps · ⏱ 2min 0s',
    nota: 'Haz las repeticiones lentamente y con buen control, especialmente al doblar las rodillas.',
    completado: false
  },
  {
    categoria: 'Piernas',
    nombre: 'Elevación de Gemelos de Pie (Máquina)',
    marca: '3 series · 8 reps · ⏱ 2min 0s',
    nota: 'Baja lentamente los talones para un estiramiento intenso y haz una pausa breve en lugar de rebotar.',
    completado: false
  },

  // PRUEBAS OFICIALES GUÀRDIA URBANA
  {
    categoria: 'Pruebas Oficiales',
    nombre: 'Course Navette (Test de Leger)',
    marca: 'Objetivo: Superar Palier 10-11',
    nota: 'Prueba oficial de resistencia aeróbica de ida y vuelta en 20 metros al ritmo del pitido.',
    completado: false
  },
  {
    categoria: 'Pruebas Oficiales',
    nombre: 'Circuito de Agilidad y Velocidad',
    marca: 'Objetivo: < 9.5 segundos',
    nota: 'Salida sentada en el suelo, paso por vallas y eslalon entre conos sin derribarlos.',
    completado: false
  },
  {
    categoria: 'Pruebas Oficiales',
    nombre: 'Lanzamiento de Balón Medicinal / Dinamometría',
    marca: 'Registrar mejor marca en metros / kg',
    nota: 'Potencia de tren superior y fuerza de tracción.',
    completado: false
  }
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
    if (filtroActual !== 'Todas' && ej.categoria !== filtroActual) {
      return;
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

  if (!nombre || !marca) {
    alert('Escribe el nombre del ejercicio y tu serie o marca.');
    return;
  }

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

mostrarEntreno();