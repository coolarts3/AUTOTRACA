// Contenido para tu archivo script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("¡SCRIPT CARGADO Y DOM LISTO!"); 

    // --- Obtener referencias a elementos HTML ---
    const calendarBody = document.getElementById('calendar-body');
    const monthNameEl = document.getElementById('month-name');
    const yearEl = document.getElementById('year');
    const eventListEl = document.getElementById('event-list'); // Elemento para la lista de eventos

    // --- Verificar si los elementos existen ---
    if (!calendarBody || !monthNameEl || !yearEl || !eventListEl) {
        console.error("ERROR: Faltan elementos HTML necesarios (revisa IDs: calendar-body, month-name, year, event-list).");
        return; // Detener ejecución si falta algo
    }
    console.log("Elementos HTML del calendario y lista encontrados.");

    // --- Fecha Actual ---
    const today = new Date(); // Fecha y hora actuales

    // --- DATOS DE EVENTOS (¡¡MODIFICA ESTO CON TUS EVENTOS!!) ---
    // Define tus eventos aquí directamente como un array de objetos JavaScript.
    let eventsData = [
      { 
        "date": "2025-05-10", // Formato YYYY-MM-DD
        "title": "ADGFSDGDFG" 
      },
      { 
        "date": "2025-05-18", 
        "title": "Entrenamiento Oficial: Monza (Assetto Corsa)" 
      },
      { 
        "date": "2025-05-18", // Múltiples eventos en el mismo día son posibles
        "title": "Clasificación Liga F1 (Sim)" 
      },
      { 
        "date": "2025-05-25", 
        "title": "Carrera: Endurance Series Ronda 3 (Le Mans)" 
      },
      { 
        "date": "2025-06-01", // Evento del mes siguiente (se mostrará si navegas a Junio)
        "title": "¡Apertura Inscripciones Liga Verano!" 
      },
      { 
        "date": "2025-06-15", 
        "title": "Carrera Especial: 2.4h de Spa" 
      }
      // Añade aquí más objetos para más eventos
    ];
    console.log(`Datos de eventos definidos directamente en JS. ${eventsData.length} eventos encontrados.`);
    // --- Fin Datos de Eventos ---


    // --- Función Auxiliar para Formatear Fecha (YYYY-MM-DD) ---
    function formatDate(year, month, day) {
        // month es 0-indexado (0=Ene), day es 1-indexado
        const monthStr = String(month + 1).padStart(2, '0'); // Añade cero inicial si es < 10
        const dayStr = String(day).padStart(2, '0');       // Añade cero inicial si es < 10
        return `${year}-${monthStr}-${dayStr}`;
    }

    // --- Función Auxiliar para Comprobar si hay evento en una fecha ---
    function isEventDay(year, month, day, events) {
        const dateString = formatDate(year, month, day);
        // .some() devuelve true si al menos un evento en el array cumple la condición
        return events.some(event => event.date === dateString);
    }

    // --- Función Auxiliar para Obtener Títulos de Eventos de un día ---
    function getEventTitles(year, month, day, events) {
        const dateString = formatDate(year, month, day);
        return events
            .filter(event => event.date === dateString) // Encuentra todos los eventos para esa fecha
            .map(event => event.title) // Extrae solo los títulos
            .join('\n'); // Une múltiples títulos con un salto de línea (para el tooltip)
    }

    // --- Función Principal para Renderizar Calendario y Lista de Eventos ---
    function renderCalendar(year, month) { // month es 0-indexado
        console.log(`Renderizando calendario para: ${year}-${String(month + 1).padStart(2, '0')}`);
        
        // Limpiar contenido previo
        calendarBody.innerHTML = ''; 
        eventListEl.innerHTML = ''; 

        // --- Cálculos básicos del mes ---
        const firstDayOfMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate(); // Obtiene el último día del mes actual
        let startingDay = firstDayOfMonth.getDay(); // 0=Domingo, 1=Lunes,...
        // Ajustamos para que la semana empiece en Lunes (Lunes=0, Domingo=6)
        startingDay = (startingDay === 0) ? 6 : startingDay - 1; 

        // --- Actualizar Cabecera ---
        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        monthNameEl.textContent = monthNames[month];
        yearEl.textContent = year;

        // --- Variables para generar HTML ---
        let date = 1; // Contador para los días del mes
        let calendarHtml = ''; // String para el HTML de la tabla
        let monthlyEvents = []; // Array para guardar los eventos de este mes específico

        // --- Generar Celdas del Calendario (Máximo 6 filas) ---
        for (let i = 0; i < 6; i++) { // Filas (semanas)
            let rowHtml = '<tr>';
            for (let j = 0; j < 7; j++) { // Columnas (días de la semana L-D)
                let cellHtml = ''; // Contenido numérico de la celda
                let cellClasses = []; // Clases CSS para la celda (['event-day', 'current-day'])
                let cellTitleAttr = ''; // Atributo 'title' para tooltips de eventos

                // Comprobar si es una celda vacía (antes del día 1 o después del último día)
                if ((i === 0 && j < startingDay) || date > daysInMonth) {
                    cellClasses.push('empty-day');
                    cellHtml = '';
                } else {
                    // Es un día válido del mes
                    cellHtml = date; // Pone el número del día
                    
                    // Comprobar si es el día de hoy
                    if (date === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                        cellClasses.push('current-day');
                    }

                    // Comprobar si hay evento para este día y guardar para la lista
                    const currentDateStr = formatDate(year, month, date); // Formato YYYY-MM-DD
                    const eventsOnThisDay = eventsData.filter(event => event.date === currentDateStr);

                    if (eventsOnThisDay.length > 0) {
                         console.log(`---> ¡Evento(s) encontrado(s) para ${currentDateStr}!`);
                        cellClasses.push('event-day'); // Añadir clase para el estilo del punto/marca
                        // Crear el texto para el tooltip (todos los títulos de ese día)
                        cellTitleAttr = `title="${eventsOnThisDay.map(e => e.title).join('\n')}"`; 
                        // Añadir los eventos a nuestra lista del mes para mostrarlos abajo
                        eventsOnThisDay.forEach(event => {
                            monthlyEvents.push({ day: date, title: event.title }); 
                        });
                    }
                    
                    date++; // Pasar al siguiente día
                }
                // Construir la celda HTML
                rowHtml += `<td class="${cellClasses.join(' ')}" ${cellTitleAttr}>${cellHtml}</td>`;
            } // Fin loop días (j)
            rowHtml += '</tr>';

            // Añadir fila al HTML del calendario si contiene días válidos
             if ( (date > 1 && date <= daysInMonth + 1) || (i === 0 && date > 1) ){
                 calendarHtml += rowHtml;
             }
             // Si ya hemos puesto todos los días, salir del bucle de semanas
             if (date > daysInMonth) {
                 break;
             }
        } // Fin loop semanas (i)

        // Dibujar la tabla del calendario
        calendarBody.innerHTML = calendarHtml;
        console.log("Calendario renderizado.");

        // --- Renderizar la Lista de Eventos del Mes ---
        console.log("Renderizando lista de eventos...");
        if (monthlyEvents.length > 0) {
            // Ordenar eventos por día antes de mostrarlos
            monthlyEvents.sort((a, b) => a.day - b.day);

            let eventListHtml = '<ul>';
            monthlyEvents.forEach(event => {
                // Formatear día y mes para mostrar (ej: 04/05)
                const displayMonth = String(month + 1).padStart(2, '0');
                const displayDay = String(event.day).padStart(2, '0');
                // Escapar HTML en el título por si acaso (básico)
                const safeTitle = event.title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                eventListHtml += `<li><strong>${displayDay}/${displayMonth}:</strong> ${safeTitle}</li>`;
            });
            eventListHtml += '</ul>';
            eventListEl.innerHTML = eventListHtml;
        } else {
            // Mensaje si no hay eventos
            eventListEl.innerHTML = '<p>No hay eventos programados para este mes.</p>';
        }
        console.log("Lista de eventos renderizada.");
        // --- Fin Renderizar Lista ---

    } // Fin de la función renderCalendar

    // --- Ejecución Inicial ---
    // Llama a renderCalendar directamente con el mes y año actuales
    // ya que los datos de eventos están definidos arriba y no hay que esperar a fetch
    renderCalendar(today.getFullYear(), today.getMonth()); 

}); // Fin del addEventListener('DOMContentLoaded')


document.addEventListener('DOMContentLoaded', () => {
    // ... (tu código existente para el calendario, etc.) ...

    // --- Lógica para el Menú Hamburguesa ---
 const menuToggle = document.getElementById('menu-toggle');
 const mainNavUl = document.getElementById('main-nav-ul');

 if (menuToggle && mainNavUl) {
     // ESTE ES EL LOG IMPORTANTE AHORA:
     console.log("Elementos del menú encontrados. Intentando añadir listener al botón..."); 

     menuToggle.addEventListener('click', () => {
         console.log("Clic en botón menú hamburguesa."); // Log para depuración

         mainNavUl.classList.toggle('menu-visible'); 

         console.log("Click procesado. Clases DESPUÉS:", mainNavUl.classList);

         const isExpanded = mainNavUl.classList.contains('menu-visible');
         menuToggle.setAttribute('aria-expanded', isExpanded);

         // (Opcional) Cambiar icono
         // if (isExpanded) { ... } else { ... }
     });
     console.log("Listener añadido al botón."); // <-- AÑADE ESTE TAMBIÉN

 } else {
      console.warn("ADVERTENCIA: No se encontró el botón #menu-toggle o la lista #main-nav-ul.");
 }
 // --- Fin Lógica Menú ---

}); // Fin del DOMContentLoaded