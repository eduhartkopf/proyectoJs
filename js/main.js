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
const btnVolverInicio = document.querySelector("#volverInicio");
const btnReiniciar = document.getElementById("reiniciar");
const puntaje = document.getElementById("puntaje");
const maximo = document.getElementById("maximo");
const listaRanking = document.querySelector("#listaRanking");
const progresoBarra = document.getElementById("progreso");
const progresoTexto = document.getElementById("progreso-texto");


// Para esta animación tuve que consultar a la IA 
// para que me explique y me de las herramientas y funciones 
// que desconocia porque eran bastante específicas, y me sumaban 
// a la estetica del diseño.

btnEmpezar.addEventListener("click", (e) => {
  const rect = e.target.getBoundingClientRect();
  lanzarChispas(rect.left + rect.width / 2, rect.top + rect.height / 2);
});

siguienteBtn.addEventListener("click", (e) => {
  const rect = e.target.getBoundingClientRect();
  lanzarChispas(rect.left + rect.width / 2, rect.top + rect.height / 2);
});

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

// efecto del confeti al finaliza el test y antes de que se vea
// el ranking de los participantes.

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

// Cargar preguntas

async function cargarPreguntas() {
  try {
    const response = await fetch("./js/preguntas.json");
    preguntas = await response.json();
    preguntasMezcladas = preguntas.sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error("Error cargando preguntas:", error);
  }
}


// para esto use IA en parte para beneficiar a la estetica
// de la trivia, para sumarle color y animaciones que me sumaran 
// a la presentacion.

function lanzarChispas(x, y) {
  for (let i = 0; i < 15; i++) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.style.left = x + "px";
    sparkle.style.top = y + "px";

    // Dirección y distancia random

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


// Iniciar juego

btnEmpezar.addEventListener("click", () => {
  const nombreInput = document.querySelector("#nombreJugador");
  jugador = nombreInput.value.trim();

  if (!jugador) {
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

// Actualizar barra de progreso a medida que se van completando las preguntas.

function actualizarProgreso() {
  const total = preguntasMezcladas.length;
  const actual = indicePregunta + 1;
  const porcentaje = (actual / total) * 100;

  progresoBarra.style.width = porcentaje + "%";
  progresoTexto.textContent = `${actual}/${total}`;
}

// Mostrar pregunta.

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
  actualizarProgreso();
}

// Validar respuesta.

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

// Siguiente pregunta.

siguienteBtn.addEventListener("click", () => {
  indicePregunta++;
  if (indicePregunta < preguntasMezcladas.length) {
    mostrarPregunta();
  } else {
    if (preguntasMezcladas.length === 12) {
      lanzarConfetiFinal(() => {
        mostrarRanking();
      });
    } else {
      mostrarRanking();
    }
  }
});

// Mostrar ranking.

function mostrarRanking() {
  juego.classList.add("d-none");
  ranking.classList.remove("d-none");

  let jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];
  jugadores.push({ nombre: jugador, puntaje: puntajeActual });
  jugadores.sort((a, b) => b.puntaje - a.puntaje);
  jugadores = jugadores.slice(0, 5);
  localStorage.setItem("jugadores", JSON.stringify(jugadores));

  listaRanking.innerHTML = "";
  jugadores.forEach(j => {
    const li = document.createElement("li");
    li.textContent = `${j.nombre} - ${j.puntaje} puntos`;
    listaRanking.appendChild(li);
  });

  maximo.textContent = jugadores[0]?.puntaje || 0;


  // Aqui se utilizó la libreria de TOASTIFY como se pedia y fue la unica manera 
  // que encontre de implementar la librería.

  Toastify({
    text: `🎉 Felicitaciones ${jugador}! Finalizaste la trivia con ${puntajeActual} puntos.`,
    duration: 4000,
    gravity: "top",
    position: "right",
    style: {
      background: "linear-gradient(to right, #ffcc00, #ff9900)",
      color: "#ffffffff",
      textAlign: "center",
      borderRadius: "12px",
    }
  }).showToast();

  // Lanza explosiones de confeti al finalizar la ronde de preguntas

  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
    }, i * 700);
  }
}


// Aqui es para cuando finaliza la trivia, que vuelva al inicio para que pueda jugar el
// siguiente participante.

btnVolverInicio.addEventListener("click", () => {
  ranking.classList.add("d-none");
  inicio.classList.remove("d-none");
  document.getElementById("nombreJugador").value = "";
});

btnReiniciar.addEventListener("click", () => location.reload());

// Inicializa el juego.
cargarPreguntas();
