// Script para solucionar la visualización de la mascota
document.addEventListener('DOMContentLoaded', function() {
  console.log('🐾 Iniciando fix-pet-display...');
  
  // Esperar a que todos los elementos estén cargados
  setTimeout(function() {
    // Verificar si estamos en la pantalla del juego
    const backgroundView = document.getElementById('background');
    if (!backgroundView || backgroundView.classList.contains('hidden')) {
      console.log('🔍 No estamos en la pantalla de juego. No se aplicarán correcciones.');
      return;
    }

    // Verificar si el contenedor de la mascota existe
    const petSvgGame = document.getElementById('pet-svg-game');
    if (!petSvgGame) {
      console.error('❌ No se encontró el elemento pet-svg-game');
      return;
    }

    // Verificar si la mascota está visible
    if (!petSvgGame.innerHTML || petSvgGame.innerHTML.trim() === '') {
      console.log('🔍 El contenedor de la mascota está vacío. Intentando cargar la mascota...');
      
      // Intentar obtener la información de la mascota del servidor
      const API_BASE = window.API_BASE || "http://localhost:3000";
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('❌ No hay token disponible para cargar la mascota');
        return;
      }

      // Mejorar visibilidad del contenedor
      petSvgGame.style.display = 'block';
      petSvgGame.style.minHeight = '200px';
      petSvgGame.style.minWidth = '200px';
      petSvgGame.style.position = 'relative';
      petSvgGame.style.zIndex = '100';
      
      // Asegurar que el contenedor padre sea visible
      const petContainer = document.getElementById('pet-container');
      if (petContainer) {
        petContainer.style.display = 'block';
        petContainer.style.position = 'absolute';
        petContainer.style.top = '50%';
        petContainer.style.left = '50%';
        petContainer.style.transform = 'translate(-50%, -50%)';
        petContainer.style.zIndex = '100';
        petContainer.style.minHeight = '200px';
        petContainer.style.minWidth = '200px';
      }

      // Añadir un mensaje de carga mientras obtenemos los datos
      petSvgGame.innerHTML = '<div style="text-align:center; padding:20px; font-size:1.5em;">⏳ Cargando mascota...</div>';
      
      // Obtener los datos de la mascota
      console.log('🔄 Obteniendo datos de la mascota del servidor...');
      
      fetch(`${API_BASE}/mis-mascotas/mi-mascota`, {
        headers: {
          'Authorization': token
        }
      })
      .then(response => {
        console.log('📊 Estado de respuesta:', response.status);
        if (!response.ok) {
          throw new Error(`Error al obtener la mascota: ${response.status}`);
        }
        return response.json();
      })
      .then(mascota => {
        console.log('✅ Datos de mascota obtenidos:', mascota);
        
        // Verificar si tenemos un SVG para mostrar
        if (mascota && mascota.svg) {
          console.log('🖼️ SVG encontrado, actualizando visualización...');
          petSvgGame.innerHTML = mascota.svg;
          
          // Intentar animar la mascota si la función está disponible
          if (typeof animarParpadeo === 'function') {
            setTimeout(animarParpadeo, 500);
          }
          
          // Guardar ID de mascota si está disponible y no está guardado
          if (mascota._id && !localStorage.getItem('currentPetId')) {
            localStorage.setItem('currentPetId', mascota._id);
          }
          
          // Iniciar la actualización de estado si la función está disponible
          if (typeof iniciarActualizacionEstado === 'function') {
            iniciarActualizacionEstado();
          }
          
          console.log('✅ Visualización de mascota completada');
        } else {
          console.error('❌ No se encontró SVG en los datos de la mascota');
          petSvgGame.innerHTML = '<div style="text-align:center; padding:20px; color:red;">⚠️ No se pudo cargar la mascota. Intenta recargar la página.</div>';
        }
      })
      .catch(error => {
        console.error('❌ Error al cargar la mascota:', error);
        petSvgGame.innerHTML = `<div style="text-align:center; padding:20px; color:red;">❌ Error: ${error.message}</div>`;
        
        // Botón para recargar
        const reloadButton = document.createElement('button');
        reloadButton.textContent = '🔄 Reintentar';
        reloadButton.style.padding = '10px 15px';
        reloadButton.style.margin = '10px auto';
        reloadButton.style.display = 'block';
        reloadButton.style.background = '#4CAF50';
        reloadButton.style.color = 'white';
        reloadButton.style.border = 'none';
        reloadButton.style.borderRadius = '4px';
        reloadButton.style.cursor = 'pointer';
        reloadButton.onclick = () => window.location.reload();
        
        petSvgGame.appendChild(reloadButton);
      });
    } else {
      console.log('✅ La mascota ya está visible en pantalla:', petSvgGame.innerHTML.substring(0, 50) + '...');
    }
    
    // Agregar un botón de emergencia para cargar una mascota genérica
    const addEmergencyPetButton = function() {
      // Verificar si ya existe el botón
      if (document.getElementById('emergency-pet-button')) return;
      
      const button = document.createElement('button');
      button.id = 'emergency-pet-button';
      button.textContent = '🐾 Mostrar mascota genérica';
      button.style.position = 'fixed';
      button.style.bottom = '90px';
      button.style.right = '10px';
      button.style.zIndex = '9999';
      button.style.padding = '8px 12px';
      button.style.backgroundColor = '#ff9800';
      button.style.color = 'white';
      button.style.border = 'none';
      button.style.borderRadius = '4px';
      button.style.cursor = 'pointer';
      
      button.onclick = function() {
        const petSvgGame = document.getElementById('pet-svg-game');
        if (petSvgGame) {
          // SVG genérico de una mascota simple
          const genericPetSvg = `
          <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <!-- Cuerpo -->
            <ellipse cx="100" cy="120" rx="60" ry="50" fill="#a0522d" />
            <!-- Cabeza -->
            <circle cx="100" cy="70" r="40" fill="#d2691e" />
            <!-- Ojos -->
            <circle cx="85" cy="60" r="6" fill="white" />
            <circle cx="115" cy="60" r="6" fill="white" />
            <circle cx="85" cy="60" r="3" fill="black" />
            <circle cx="115" cy="60" r="3" fill="black" />
            <!-- Nariz -->
            <ellipse cx="100" cy="75" rx="10" ry="5" fill="#8b4513" />
            <!-- Boca -->
            <path d="M 90 85 Q 100 95 110 85" stroke="black" stroke-width="2" fill="none" />
            <!-- Oreja derecha (oreja izquierda eliminada) -->
            <ellipse cx="130" cy="50" rx="15" ry="20" fill="#d2691e" />
            <!-- Patas -->
            <ellipse cx="130" cy="160" rx="12" ry="8" fill="#8b4513" />
          </svg>`;
          
          petSvgGame.innerHTML = genericPetSvg;
          alert('¡Mascota genérica mostrada! Esta no es tu mascota real, solo es una visualización de emergencia.');
        }
      };
      
      document.body.appendChild(button);
    };
    
    // Añadir el botón de emergencia
    addEmergencyPetButton();
    
  }, 2000); // Dar tiempo para que todo se cargue
});
