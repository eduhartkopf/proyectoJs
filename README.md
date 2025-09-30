Trivia de Harry Potter

Una trivia interactiva que pone a prueba tus conocimientos sobre Harry Potter. Responde preguntas, acumula puntos y compite en el ranking de los mejores jugadores.



- . Tecnologías:

HTML5, CSS3 y Bootstrap 5

JavaScript (Vanilla JS)

Toastify para notificaciones

Canvas Confetti para animaciones



- . Características:

Pantalla de inicio con input de nombre

Preguntas aleatorias con respuestas correctas/incorrectas

Barra de progreso del juego

Ranking de los 5 mejores jugadores (almacenado en localStorage) que se muestra en la pantalla de inicia de manera fija

Animaciones de chispas y confeti al iniciar, al acertar la respuesta correcta y finalizar

Botón para reiniciar la trivia y jugar de nuevo


- . Uso:

Clona el repositorio

Abre index.html en tu navegador.

Ingresa tu nombre y comienza la trivia.

Al finalizar, se mostrará tu puntaje y el ranking se actualizará automáticamente.



- . Licencia:

MIT License – Libre para usar, modificar y compartir


-. Diagrama de flujo de la trivia:

┌─────────────────────────┐
│   Usuario abre página   │
└────────────┬────────────┘
             │
             v
┌─────────────────────────┐
│ Sección #inicio visible │
└────────────┬────────────┘
             │
             v
┌──────────────────────────────────────────┐
│ Usuario ingresa nombre y hace click      │
│ en "Empezar Trivia"                      │
└────────────┬─────────────────────────────┘
             │
             v
┌─────────────────────────────────────────────┐
│ JS: iniciarTrivia()                         │
│ - Valida nombre                             │
│ - Oculta #inicio, muestra #juego            │
│ - Inicializa puntajeActual e indicePregunta │
│ - Llama a mostrarPregunta()                 │
│ - Lanza chispas sobre botón Empezar         │
└────────────┬────────────────────────────────┘
             │
             v
┌────────────────────────────────────────────┐
│ mostrarPregunta()                          │
│ - Muestra pregunta                         │
│ - Mezcla opciones y crea botones           │
│ - Actualiza barra de progreso              │
└────────────┬───────────────────────────────┘
             │
             v
┌──────────────────────────────────────────┐
│ Usuario selecciona respuesta             │
└────────────┬─────────────────────────────┘
             │
             v
┌──────────────────────────────────────────┐
│ validarRespuesta(opcionSeleccionada)     │
│ - Correcta: suma puntos + chispas        │
│ - Deshabilita botones                    │
│ - Muestra botón Siguiente                │
└────────────┬─────────────────────────────┘
             │
             v
┌──────────────────────────────────────────┐
│ Usuario hace click en "Siguiente"        │
│ - indicePregunta++                       │
│ - Si quedan preguntas: mostrarPregunta() │
│ - Si no quedan: lanzarConfetiFinal()     │
└────────────┬─────────────────────────────┘
             │
             v
┌──────────────────────────────────────────┐
│ mostrarRanking()                         │
│ - Actualiza top 5 jugadores              │
│ - Actualiza ranking inicio y footer      │
│ - Muestra Toastify con puntaje final     │
│ - Oculta #juego, muestra #ranking        │
└────────────┬─────────────────────────────┘
             │
             v
┌──────────────────────────────────────────┐
│ Botón "Reiniciar"                        │
│ - reiniciarTrivia()                      │
│ - Resetea variables y puntajes           │
│ - Oculta #juego y #ranking               │
│ - Muestra #inicio                        │
│ - Actualiza ranking en ambas listas      │
└──────────────────────────────────────────┘
