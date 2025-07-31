// Script para forzar la carga de la mascota
(function() {
  console.log('🐾 Iniciando forzado de carga de mascota...');
  
  // Función para verificar si estamos en la vista del juego
  function estamosEnJuego() {
    const background = document.getElementById('background');
    return background && !background.classList.contains('hidden');
  }
  
  // Función para forzar la carga de la mascota desde la API
  function forzarCargaMascota() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('⚠️ No hay token disponible');
      return;
    }
    
    if (!estamosEnJuego()) {
      console.log('⚠️ No estamos en la vista del juego');
      return;
    }
    
    console.log('🔄 Forzando carga de mascota desde API...');
    
    fetch(`${window.API_BASE || 'http://localhost:3000'}/mis-mascotas/mi-mascota`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la respuesta de la API');
      }
      return response.json();
    })
    .then(mascota => {
      console.log('✅ Mascota cargada correctamente:', mascota);
      
      // Guardar el ID de la mascota
      if (mascota._id) {
        localStorage.setItem('currentPetId', mascota._id);
      }
      
      // Renderizar la mascota
      const petSvgGame = document.getElementById('pet-svg-game');
      if (petSvgGame && mascota.svg) {
        console.log('🖌️ Renderizando SVG de mascota');
        petSvgGame.innerHTML = mascota.svg;
        
        // Aplicar estilos adicionales al SVG
        const svgElement = petSvgGame.querySelector('svg');
        if (svgElement) {
          svgElement.style.width = '100%';
          svgElement.style.height = '100%';
        }
      } else {
        console.log('⚠️ No se pudo renderizar la mascota, usando emoji');
        petSvgGame.innerHTML = '<div style="font-size:5em; text-align:center;">🐰</div>';
      }
      
      // Hacer visible el contenedor de la mascota con estilos forzados
      const petContainer = document.getElementById('pet-container');
      if (petContainer) {
        petContainer.style.cssText = `
          display: block !important;
          position: absolute !important;
          z-index: 50 !important;
          opacity: 1 !important;
          visibility: visible !important;
          width: 250px !important;
          height: 250px !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
        `;
      }
      
      // También hacemos visible el background
      const background = document.getElementById('background');
      if (background) {
        background.classList.remove('hidden');
        background.style.opacity = '1';
        background.style.visibility = 'visible';
      }
      
      // Ocultar las otras vistas
      const otrasVistas = ['welcome-view', 'login-view', 'register-view', 'select-pet-view'];
      otrasVistas.forEach(id => {
        const vista = document.getElementById(id);
        if (vista) {
          vista.classList.add('hidden');
        }
      });
      
      // Iniciar la actualización periódica del estado si existe
      if (typeof iniciarActualizacionEstado === 'function') {
        iniciarActualizacionEstado();
      }
      
      // Actualizar barras de estado si existe
      if (typeof actualizarBarras === 'function') {
        actualizarBarras();
      }
      
      // Animar parpadeo si existe
      if (typeof animarParpadeo === 'function') {
        animarParpadeo();
      }
    })
    .catch(error => {
      console.error('❌ Error cargando mascota:', error);
    });
  }
  
  // Escuchar cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', function() {
    // Configurar botón de emergencia
    const forcePetBtn = document.getElementById('force-pet-btn');
    if (forcePetBtn) {
      forcePetBtn.addEventListener('click', function() {
        forzarCargaMascota();
        forcePetBtn.textContent = 'Intentando cargar...';
        setTimeout(() => {
          forcePetBtn.textContent = 'Cargar Mascota';
        }, 2000);
      });
      
      // Mostrar el botón después de un tiempo si no se ha cargado la mascota
      setTimeout(() => {
        const petSvgGame = document.getElementById('pet-svg-game');
        const petContainer = document.getElementById('pet-container');
        const background = document.getElementById('background');
        
        // Si estamos en el juego pero la mascota no está visible o no tiene contenido
        if (background && !background.classList.contains('hidden') && 
            (!petSvgGame || !petSvgGame.innerHTML || petSvgGame.innerHTML.trim() === '' ||
             !petContainer || petContainer.style.display === 'none')) {
          console.log('⚠️ Mascota no detectada, mostrando botón de emergencia');
          forcePetBtn.style.display = 'block';
        }
      }, 4000);
    }
    
    // Esperar un momento para que otros scripts se inicialicen
    setTimeout(forzarCargaMascota, 1000);
    
    // Intentar varias veces por si acaso
    setTimeout(forzarCargaMascota, 2000);
    setTimeout(forzarCargaMascota, 5000);
  });
  
  // También exportamos la función para uso manual
  window.forzarCargaMascota = forzarCargaMascota;
})();
