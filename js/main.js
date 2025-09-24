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
const listaRanking = document.querySelector("#listaRanking");
const progresoBarra = document.getElementById("progreso");
const progresoTexto = document.getElementById("progreso-texto");
const nombreInput = document.querySelector("#nombreJugador");

// Ranking al cargar página
function cargarRankingInicial() {
  const jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];
  listaRanking.innerHTML = "";

  if (jugadores.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No hay jugadores aún";
    li.className = "list-group-item text-muted";
    listaRanking.appendChild(li);
  } else {
    jugadores.sort((a, b) => b.puntaje - a.puntaje);
    const top5 = jugadores.slice(0, 5);

    top5.forEach((j) => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.textContent = `${j.nombre} - ${j.puntaje} puntos`;
      listaRanking.appendChild(li);
    });
  }

  maximo.textContent = jugadores[0]?.puntaje || 0;
}


// Inicio de la trivia
function iniciarTrivia() {
  // Lanzar chispas en el botón
  const rect = btnEmpezar.getBoundingClientRect();
  lanzarChispas(rect.left + rect.width / 2, rect.top + rect.height / 2);

  // Obtener nombre
  jugador = nombreInput.value.trim();
  if (!jugador) {
    errorNombre.classList.remove("d-none");
    return;
  }

  errorNombre.classList.add("d-none");
  inicio.classList.add("d-none");
  juego.classList.remove("d-none");
  ranking.classList.add("d-none"); // Ocultar ranking si estaba visible

  puntajeActual = 0;
  indicePregunta = 0;
  puntaje.textContent = puntajeActual;

  mostrarPregunta();
}

//  Inicio con click o Enter
btnEmpezar.addEventListener("click", iniciarTrivia);
nombreInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") iniciarTrivia();
});

// Animación de chispas
function lanzarChispas(x, y) {
  for (let i = 0; i < 15; i++) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.style.left = x + "px";
    sparkle.style.top = y + "px";

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

  // Mezclar opciones
  const opcionesAleatorias = [...preguntaActual.opciones].sort(() => Math.random() - 0.5);

  opcionesAleatorias.forEach(opcion => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-primary w-100";
    btn.textContent = opcion;
    btn.addEventListener("click", () => validarRespuesta(opcion, preguntaActual.respuesta));
    opciones.appendChild(btn);
  });

  siguienteBtn.classList.add("d-none");
  resultado.textContent = "";
  actualizarProgreso();
}

// Validar respuesta
function validarRespuesta(opcionSeleccionada, respuestaCorrecta) {
  if (opcionSeleccionada === respuestaCorrecta) {
    resultado.textContent = "✅ Correcto!";
    resultado.className = "text-success";
    puntajeActual += 10;
    puntaje.textContent = puntajeActual;
  } else {
    resultado.textContent = `❌ Incorrecto. La respuesta era: ${respuestaCorrecta}`;
    resultado.className = "text-danger";
  }

  opciones.querySelectorAll("button").forEach(b => b.disabled = true);
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

// Ranking
function mostrarRanking() {
  let jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];

  jugadores.push({ nombre: jugador, puntaje: puntajeActual });
  jugadores.sort((a, b) => b.puntaje - a.puntaje);
  jugadores = jugadores.slice(0, 5);
  localStorage.setItem("jugadores", JSON.stringify(jugadores));

  listaRanking.innerHTML = "";
  jugadores.forEach(j => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = `${j.nombre} - ${j.puntaje} puntos`;
    listaRanking.appendChild(li);
  });
  maximo.textContent = jugadores[0]?.puntaje || 0;

  // Mostrar ranking
  juego.classList.add("d-none");
  ranking.classList.remove("d-none");

  // Implementacion de Toastify 
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

// Inicializar ranking al cargar página
function cargarRankingInicial() {
  const jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];
  listaRanking.innerHTML = "";
  jugadores.forEach((j) => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = `${j.nombre} - ${j.puntaje} puntos`;
    listaRanking.appendChild(li);
  });
  maximo.textContent = jugadores[0]?.puntaje || 0;
}

// Botón reiniciar
btnReiniciar.addEventListener("click", reiniciarTrivia);

// Inicializar juego y ranking
cargarPreguntas();
cargarRankingInicial();

