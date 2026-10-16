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

// ==========================================
// 5. MÓDULO DE COMIDAS CON IA (GEMINI API)
// ==========================================

let comidasHoy = JSON.parse(localStorage.getItem('comidasGuardadas')) || [];
let metaCalorias = parseInt(localStorage.getItem('metaCalorias')) || 2200;
let imagenBase64Actual = null;

// Guardar tu clave de Gemini en el navegador de forma privada
function configurarApiKey() {
  const claveActual = localStorage.getItem('geminiApiKey') || '';
  const nuevaClave = prompt('Pega aquí tu API Key gratuita de Google AI Studio (empieza por AIza...):', claveActual);
  if (nuevaClave !== null) {
    localStorage.setItem('geminiApiKey', nuevaClave.trim());
    alert('✅ Clave de IA guardada en tu navegador.');
  }
}

function cambiarObjetivoCalorias() {
  const nuevaMeta = prompt('¿Cuál es tu objetivo de calorías diarias (kcal)?', metaCalorias);
  if (nuevaMeta && !isNaN(nuevaMeta)) {
    metaCalorias = parseInt(nuevaMeta);
    localStorage.setItem('metaCalorias', metaCalorias);
    actualizarPanelNutricion();
  }
}

// Mostrar y comprimir la foto seleccionada
function previsualizarFoto(event) {
  const archivo = event.target.files[0];
  if (!archivo) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      // Redimensionar imagen para que sea rápida de enviar a la IA
      const canvas = document.createElement('canvas');
      const maxAncho = 800;
      const escala = maxAncho / img.width;
      canvas.width = img.width > maxAncho ? maxAncho : img.width;
      canvas.height = img.width > maxAncho ? img.height * escala : img.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      imagenBase64Actual = dataUrl.split(',')[1]; // Solo los datos Base64

      const preview = document.getElementById('preview-img');
      preview.src = dataUrl;
      preview.style.display = 'block';
      document.getElementById('texto-subir').style.display = 'none';
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(archivo);
}

// Enviar la foto a Gemini para calcular calorías y macros
async function analizarComidaConIA() {
  const apiKey = localStorage.getItem('geminiApiKey');
  if (!apiKey) {
    alert('Primero tienes que configurar tu clave gratuita de IA. Pulsa en "🔑 Configurar IA" arriba a la derecha.');
    configurarApiKey();
    return;
  }

  if (!imagenBase64Actual) {
    alert('Haz una foto o selecciona una imagen de tu plato primero.');
    return;
  }

  const notaExtra = document.getElementById('nota-comida').value;
  const estado = document.getElementById('estado-ia');
  const boton = document.getElementById('btn-analizar');

  estado.style.display = 'block';
  estado.innerText = '⏳ Analizando el plato con IA...';
  boton.disabled = true;

  const promptIA = `Analiza esta foto de comida. ${notaExtra ? 'Nota del usuario: ' + notaExtra : ''}. 
  Calcula una estimación realista de sus calorías y macronutrientes totales. 
  Devuelve ÚNICAMENTE un objeto JSON válido con este formato exacto, sin texto adicional ni bloques markdown:
  {"nombre": "Nombre del plato en español", "calorias": 550, "proteinas": 35, "carbos": 45, "grasas": 18}`;

  try {
    const respuesta = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: promptIA },
            { inline_data: { mime_type: 'image/jpeg', data: imagenBase64Actual } }
          ]
        }]
      })
    });

    const datos = await respuesta.json();

    if (datos.error) {
      throw new Error(datos.error.message);
    }

    let textoRespuesta = datos.candidates[0].content.parts[0].text;
    // Limpiar posibles marcas de código si la IA las pone
    textoRespuesta = textoRespuesta.replace(/```json/g, '').replace(/```/g, '').trim();
    const platoCalculado = JSON.parse(textoRespuesta);

    // Guardar el plato en la lista del día
    comidasHoy.push({
      nombre: platoCalculado.nombre,
      calorias: Number(platoCalculado.calorias) || 0,
      proteinas: Number(platoCalculado.proteinas) || 0,
      carbos: Number(platoCalculado.carbos) || 0,
      grasas: Number(platoCalculado.grasas) || 0
    });

    localStorage.setItem('comidasGuardadas', JSON.stringify(comidasHoy));
    
    // Limpiar el formulario tras el análisis
    document.getElementById('nota-comida').value = '';
    document.getElementById('preview-img').style.display = 'none';
    document.getElementById('texto-subir').style.display = 'block';
    imagenBase64Actual = null;
    estado.style.display = 'none';

    actualizarPanelNutricion();

  } catch (error) {
    estado.innerText = '❌ Error al analizar: comprueba tu clave de IA o intenta con otra foto.';
    console.error(error);
  } finally {
    boton.disabled = false;
  }
}

function actualizarPanelNutricion() {
  const lista = document.getElementById('lista-comidas');
  if (!lista) return;
  lista.innerHTML = '';

  let totalCal = 0, totalProt = 0, totalCarb = 0, totalGras = 0;

  comidasHoy.forEach((plato, index) => {
    totalCal += plato.calorias;
    totalProt += plato.proteinas;
    totalCarb += plato.carbos;
    totalGras += plato.grasas;

    const li = document.createElement('li');
    li.innerHTML = `
      <div>
        <strong>${plato.nombre}</strong>
        <div style="color: var(--text-muted); font-size: 0.85rem; margin-top: 2px;">
          <b style="color: var(--accent-red);">${plato.calorias} kcal</b> · Prot: ${plato.proteinas}g · Carbs: ${plato.carbos}g · Grasas: ${plato.grasas}g
        </div>
      </div>
      <button class="btn-delete" onclick="borrarComida(${index})">Borrar</button>
    `;
    lista.appendChild(li);
  });

  document.getElementById('calorias-actuales').innerText = totalCal;
  document.getElementById('calorias-objetivo').innerText = metaCalorias;
  document.getElementById('total-proteinas').innerText = totalProt + 'g';
  document.getElementById('total-carbos').innerText = totalCarb + 'g';
  document.getElementById('total-grasas').innerText = totalGras + 'g';

  const porcentaje = Math.min((totalCal / metaCalorias) * 100, 100);
  document.getElementById('barra-calorias').style.width = porcentaje + '%';
}

function borrarComida(index) {
  comidasHoy.splice(index, 1);
  localStorage.setItem('comidasGuardadas', JSON.stringify(comidasHoy));
  actualizarPanelNutricion();
}

function reiniciarComidasDia() {
  if (confirm('¿Quieres poner a cero el contador de comidas para empezar un nuevo día?')) {
    comidasHoy = [];
    localStorage.setItem('comidasGuardadas', JSON.stringify(comidasHoy));
    actualizarPanelNutricion();
  }
}

actualizarPanelNutricion();

