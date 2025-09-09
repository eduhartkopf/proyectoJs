// =====================
// Variables globales
// =====================
let preguntas = [];
let preguntasMezcladas = [];
let jugador = "";
let puntajeActual = 0;
let indicePregunta = 0;

// =====================
// Referencias al DOM
// =====================
const pregunta = document.querySelector("#pregunta h2");
const opciones = document.getElementById("opciones");
const resultado = document.getElementById("resultado");
const siguienteBtn = document.getElementById("siguiente");

const inicio = document.getElementById("inicio");
const juego = document.getElementById("juego");
const ranking = document.getElementById("ranking");
const errorNombre = document.getElementById("errorNombre");

const btnEmpezar = document.getElementById("empezar");
const btnVolverInicio = document.getElementById("volverInicio");
const btnReiniciar = document.getElementById("reiniciar");
const puntaje = document.getElementById("puntaje");
const maximo = document.getElementById("maximo");
const listaRanking = document.getElementById("listaRanking");

// =====================
// Cargar preguntas desde JSON
// =====================
async function cargarPreguntas() {
  try {
    const response = await fetch("./js/preguntas.json"); // Asegúrate que el archivo se llame preguntas.json y no preguntas.JSON
    preguntas = await response.json();
    preguntasMezcladas = preguntas.sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error("Error cargando preguntas:", error);
  }
}

// =====================
// Iniciar juego
// =====================
btnEmpezar.addEventListener("click", () => {
  const nombreInput = document.getElementById("nombreJugador");
  jugador = nombreInput.value.trim();

  if (jugador === "") {
    errorNombre.classList.remove("d-none");
    return;
  }

  errorNombre.classList.add("d-none");
  inicio.classList.add("d-none");
  juego.classList.remove("d-none");

  puntajeActual = 0;
  indicePregunta = 0;
  puntaje.textContent = puntajeActual;

  mostrarPregunta();
});

// =====================
// Mostrar pregunta actual
// =====================
function mostrarPregunta() {
  const preguntaActual = preguntasMezcladas[indicePregunta];
  pregunta.textContent = preguntaActual.pregunta;

  opciones.innerHTML = "";
  preguntaActual.opciones.forEach(opcion => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-primary w-100";
    btn.textContent = opcion;

    btn.addEventListener("click", () => validarRespuesta(opcion, preguntaActual.respuesta));
    opciones.appendChild(btn);
  });

  siguienteBtn.classList.add("d-none");
  resultado.textContent = "";
}

// =====================
// Validar respuesta
// =====================
function validarRespuesta(opcionSeleccionada, respuestaCorrecta) {
  if (opcionSeleccionada === respuestaCorrecta) {
    resultado.textContent = "✅ Correcto!";
    resultado.className = "text-success";
    puntajeActual += 10;
    puntaje.textContent = puntajeActual;
  } else {
    resultado.textContent = "❌ Incorrecto. La respuesta era: " + respuestaCorrecta;
    resultado.className = "text-danger";
  }

  siguienteBtn.classList.remove("d-none");
}

// =====================
// Botón siguiente
// =====================
siguienteBtn.addEventListener("click", () => {
  indicePregunta++;
  if (indicePregunta < preguntasMezcladas.length) {
    mostrarPregunta();
  } else {
    mostrarRanking();
  }
});

// =====================
// Ranking
// =====================
function mostrarRanking() {
  juego.classList.add("d-none");
  ranking.classList.remove("d-none");

  // Guardar en localStorage
  let jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];
  jugadores.push({ nombre: jugador, puntaje: puntajeActual });
  jugadores.sort((a, b) => b.puntaje - a.puntaje);

  // Mantener solo top 5
  jugadores = jugadores.slice(0, 5);
  localStorage.setItem("jugadores", JSON.stringify(jugadores));

  // Mostrar ranking
  listaRanking.innerHTML = "";
  jugadores.forEach(j => {
    const li = document.createElement("li");
    li.textContent = `${j.nombre} - ${j.puntaje} puntos`;
    listaRanking.appendChild(li);
  });

  // Mostrar máximo
  maximo.textContent = jugadores[0]?.puntaje || 0;
}

// =====================
// Botones extra
// =====================
btnVolverInicio.addEventListener("click", () => {
  ranking.classList.add("d-none");
  inicio.classList.remove("d-none");
});

btnReiniciar.addEventListener("click", () => {
  location.reload();
});

// =====================
// Inicializar
// =====================
cargarPreguntas();
