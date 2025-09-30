// Variables globales
let preguntas = [];
let preguntasMezcladas = [];
let jugador = "";
let puntajeActual = 0;
let indicePregunta = 0;

// Referencias al DOM
const pregunta = document.querySelector("#pregunta h2");
const opciones = document.getElementById("opciones");
const resultado = document.getElementById("resultado");
const siguienteBtn = document.getElementById("siguiente");
const inicio = document.querySelector("#inicio");
const juego = document.getElementById("juego");
const ranking = document.getElementById("ranking");
const errorNombre = document.getElementById("errorNombre");
const btnEmpezar = document.getElementById("empezar");
const btnReiniciar = document.getElementById("reiniciar");
const puntaje = document.getElementById("puntaje");
const maximo = document.getElementById("maximo");
const nombreInput = document.querySelector("#nombreJugador");

// Lista de ranking en inicio
const listaRankingInicio = document.getElementById("listaRankingInicio");

// Referencias de progreso
const progresoBarra = document.getElementById("progreso");
const progresoTexto = document.getElementById("progreso-texto");

// Función genérica para actualizar ranking
function actualizarRanking(lista, jugadores) {
  lista.innerHTML = "";
  jugadores.forEach(j => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = `${j.nombre} - ${j.puntaje} puntos`;
    lista.appendChild(li);
  });
}

// Cargar ranking inicial
function cargarRankingInicial() {
  const jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];
  actualizarRanking(listaRankingInicio, jugadores);
  maximo.textContent = jugadores[0]?.puntaje || 0;
}

// Animación de chispas en la trivia
function lanzarChispas(x, y) {
  const cantidad = 30;
  for (let i = 0; i < cantidad; i++) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.style.left = x + "px";
    sparkle.style.top = y + "px";

    const size = 4 + Math.random() * 4;
    sparkle.style.width = size + "px";
    sparkle.style.height = size + "px";

    const angle = Math.random() * 2 * Math.PI;
    const distance = 50 + Math.random() * 50;
    const dx = Math.cos(angle) * distance + "px";
    const dy = Math.sin(angle) * distance + "px";
    sparkle.style.setProperty("--x", dx);
    sparkle.style.setProperty("--y", dy);

    document.body.appendChild(sparkle);
    sparkle.addEventListener("animationend", () => sparkle.remove());
  }
}

// Chispas iniciales dispersas por toda la pantalla
function lanzarChispasInicio() {
  const cantidad = 50;
  const width = window.innerWidth;
  const height = window.innerHeight;

  for (let i = 0; i < cantidad; i++) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";

    const size = 4 + Math.random() * 6;
    sparkle.style.width = size + "px";
    sparkle.style.height = size + "px";

    const x = Math.random() * width;
    const y = Math.random() * height;
    sparkle.style.left = x + "px";
    sparkle.style.top = y + "px";

    const angle = Math.random() * 2 * Math.PI;
    const distance = 50 + Math.random() * 100;
    sparkle.style.setProperty("--x", Math.cos(angle) * distance + "px");
    sparkle.style.setProperty("--y", Math.sin(angle) * distance + "px");

    document.body.appendChild(sparkle);
    sparkle.addEventListener("animationend", () => sparkle.remove());
  }
}

// Confeti final
function lanzarConfetiFinal(callback) {
  let count = 0;
  const interval = setInterval(() => {
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.6 }
    });
    count++;
    if (count === 3) {
      clearInterval(interval);
      if (callback) callback();
    }
  }, 500);
}

// Carga de preguntas
async function cargarPreguntas() {
  try {
    const response = await fetch("./js/preguntas.json");
    preguntas = await response.json();
    preguntasMezcladas = preguntas.sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error("Error cargando preguntas:", error);
  }
}

// Barra de progreso
function actualizarProgreso() {
  const total = preguntasMezcladas.length;
  const actual = indicePregunta + 1;
  const porcentaje = (actual / total) * 100;

  progresoBarra.style.width = porcentaje + "%";
  progresoTexto.textContent = `${actual}/${total}`;
}

// Mostrar pregunta
function mostrarPregunta() {
  const preguntaActual = preguntasMezcladas[indicePregunta];
  pregunta.textContent = preguntaActual.pregunta;

  opciones.innerHTML = "";
  opciones.dataset.respondido = "false";

  const opcionesAleatorias = [...preguntaActual.opciones].sort(() => Math.random() - 0.5);

  opcionesAleatorias.forEach(opcion => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-primary w-100";
    btn.textContent = opcion;
    btn.disabled = false;
    btn.addEventListener("click", () => validarRespuesta(opcion, preguntaActual.respuesta));
    opciones.appendChild(btn);
  });

  siguienteBtn.classList.add("d-none");
  if (indicePregunta === 11) {
    siguienteBtn.textContent = "Finalizar Trivia";
  } else {
    siguienteBtn.textContent = "Siguiente Pregunta";
  }
  resultado.textContent = "";
  actualizarProgreso();
}

// Validar respuesta
function validarRespuesta(opcionSeleccionada, respuestaCorrecta) {
  if (opciones.dataset.respondido === "true") return;
  opciones.dataset.respondido = "true";

  const boton = [...opciones.querySelectorAll("button")]
    .find(b => b.textContent === opcionSeleccionada);

  if (opcionSeleccionada === respuestaCorrecta) {
    resultado.textContent = "✅ Correcto!";
    resultado.className = "text-success";
    puntajeActual += 10;
    puntaje.textContent = puntajeActual;

    const rect = boton.getBoundingClientRect();
    lanzarChispas(rect.left + rect.width / 2, rect.top + rect.height / 2);
  } else {
    resultado.textContent = `❌ Incorrecto. La respuesta era: ${respuestaCorrecta}`;
    resultado.className = "text-danger";
  }

  // Bloquear botones
  opciones.querySelectorAll("button").forEach(b => b.disabled = true);

  // Mostrar botón "Siguiente Pregunta"
  siguienteBtn.classList.remove("d-none");
}

// Siguiente pregunta
siguienteBtn.addEventListener("click", () => {
  indicePregunta++;
  if (indicePregunta < preguntasMezcladas.length) {
    mostrarPregunta();
  } else {
    lanzarConfetiFinal(mostrarRanking);
  }
});

// Mostrar ranking al finalizar
function mostrarRanking() {
  let jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];

  jugadores.push({ nombre: jugador, puntaje: puntajeActual });
  jugadores.sort((a, b) => b.puntaje - a.puntaje);
  jugadores = jugadores.slice(0, 5);
  localStorage.setItem("jugadores", JSON.stringify(jugadores));

  actualizarRanking(listaRankingInicio, jugadores);
  maximo.textContent = jugadores[0]?.puntaje || 0;

  juego.classList.add("d-none");
  ranking.classList.remove("d-none");

  Toastify({
    text: `🎉 ${jugador}, terminaste la trivia con ${puntajeActual} puntos!`,
    duration: 5000,
    gravity: "top",
    position: "right",
    style: {
      background: "linear-gradient(to right, #ffcc00, #ff9900)",
      color: "#000",
      textAlign: "center",
      borderRadius: "12px",
    },
    onClick: reiniciarTrivia
  }).showToast();
}

// Reiniciar trivia
function reiniciarTrivia() {
  nombreInput.value = "";
  jugador = "";
  puntajeActual = 0;
  indicePregunta = 0;

  juego.classList.add("d-none");
  ranking.classList.add("d-none");
  inicio.classList.remove("d-none");

  puntaje.textContent = 0;
  maximo.textContent = 0;

  cargarRankingInicial();
}

// Inicio de la trivia
function iniciarTrivia() {
  lanzarChispasInicio();
  jugador = nombreInput.value.trim();
  if (!jugador) {
    errorNombre.classList.remove("d-none");
    return;
  }

  errorNombre.classList.add("d-none");
  inicio.classList.add("d-none");
  juego.classList.remove("d-none");
  ranking.classList.add("d-none");

  puntajeActual = 0;
  indicePregunta = 0;
  puntaje.textContent = puntajeActual;

  mostrarPregunta();
}

// Inicio con click o Enter
btnEmpezar.addEventListener("click", iniciarTrivia);
nombreInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") iniciarTrivia();
});
btnReiniciar.addEventListener("click", reiniciarTrivia);

// Inicializar ranking y preguntas
cargarPreguntas();
cargarRankingInicial();
