// Script de diagnóstico para verificar la carga de mascota
(function() {
  console.log('🔍 Iniciando diagnóstico de mascota...');
  
  // LIMPIAR BARRAS INMEDIATAMENTE AL CARGAR EL SCRIPT
  function limpiezaInicial() {
    const statsContainer = document.getElementById('stats-container');
    if (statsContainer) {
      statsContainer.remove();
      console.log('🧹 Barras eliminadas en limpieza inicial');
    }
  }
  
  // Ejecutar limpieza inmediata
  limpiezaInicial();
  
  // Función para verificar la conexión y cargar la mascota
  async function diagnosticarMascota() {
    const token = localStorage.getItem('token');
    const API_BASE = window.API_BASE || 'http://localhost:3000';
    
    console.log('🔑 Token encontrado:', token ? 'SÍ' : 'NO');
    console.log('🌐 API Base URL:', API_BASE);
    
    // PRIMERO: Verificar si estamos en un formulario y eliminar barras existentes
    const gameView = document.getElementById('pet-container');
    const welcomeView = document.getElementById('welcome-view');
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    
    const enFormulario = (welcomeView && !welcomeView.classList.contains('hidden')) ||
                        (loginView && !loginView.classList.contains('hidden')) ||
                        (registerView && !registerView.classList.contains('hidden')) ||
                        !gameView || gameView.classList.contains('hidden');
    
    if (enFormulario) {
      console.log('🚫 Estamos en un formulario, eliminando barras existentes');
      eliminarBarrasEstado();
    }
    
    if (!token) {
      console.log('❌ No hay token - usuario no autenticado');
      return;
    }
    
    try {
      console.log('📡 Intentando conectar con la API...');
      const response = await fetch(`${API_BASE}/mis-mascotas/mi-mascota`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 Respuesta de la API:');
      console.log('  - Status:', response.status);
      console.log('  - Status Text:', response.statusText);
      console.log('  - Headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const mascota = await response.json();
        console.log('✅ Mascota encontrada:', mascota);
        console.log('📋 Datos de la mascota:');
        console.log('  - ID:', mascota._id);
        console.log('  - Nombre:', mascota.nombre);
        console.log('  - Tipo:', mascota.tipo);
        console.log('  - Estados:', {
          hambre: mascota.hambre,
          energia: mascota.energia,
          felicidad: mascota.felicidad,
          limpieza: mascota.limpieza
        });
        console.log('  - SVG presente:', mascota.svg ? 'SÍ' : 'NO');
        
        // Intentar renderizar la mascota
        const petContainer = document.getElementById('pet-svg-game');
        if (petContainer) {
          console.log('🎨 Renderizando mascota...');
          petContainer.innerHTML = mascota.svg || '<div style="font-size:3em; text-align:center;">🐾</div>';
          console.log('✅ Mascota renderizada en #pet-svg-game');
        } else {
          console.log('❌ No se encontró el contenedor #pet-svg-game');
        }
        
        // Actualizar estado global
        if (window.estadoMascota) {
          Object.assign(window.estadoMascota, mascota);
          console.log('✅ Estado global actualizado');
        } else {
          window.estadoMascota = mascota;
          console.log('✅ Estado global creado');
        }
        
        // SOLO CREAR BARRAS SI ESTAMOS EN EL JUEGO
        // Verificar que estamos en la vista correcta antes de crear barras
        const gameView = document.getElementById('pet-container');
        const welcomeView = document.getElementById('welcome-view');
        const loginView = document.getElementById('login-view');
        const registerView = document.getElementById('register-view');
        
        if (gameView && !gameView.classList.contains('hidden') && 
            welcomeView && welcomeView.classList.contains('hidden') &&
            (!loginView || loginView.classList.contains('hidden')) &&
            (!registerView || registerView.classList.contains('hidden'))) {
          // Solo entonces crear y actualizar barras
          crearBarrasEstado(mascota);
          actualizarBarrasReales(mascota);
        } else {
          console.log('⏭️ No estamos en el juego, no creando barras desde diagnóstico');
        }
        
        // Verificar si las barras de estado existen
        const statsContainer = document.getElementById('stats-container');
        if (statsContainer) {
          console.log('✅ Contenedor de estadísticas encontrado');
        } else {
          console.log('❌ No se encontró #stats-container');
        }
        
      } else if (response.status === 404) {
        console.log('⚠️ Usuario no tiene mascota - debería ir a selección de mascota');
      } else if (response.status === 401) {
        console.log('🔒 Token inválido o expirado');
        localStorage.removeItem('token');
      } else {
        const errorText = await response.text();
        console.log('❌ Error del servidor:', errorText);
      }
      
    } catch (error) {
      console.error('💥 Error de conexión:', error);
      console.log('🔧 Posibles causas:');
      console.log('  - El servidor no está ejecutándose');
      console.log('  - Problemas de red');
      console.log('  - URL incorrecta');
    }
  }
  
  // Función para crear las barras de estado si no existen
  function crearBarrasEstado(mascota) {
    console.log('🏗️ Creando barras de estado...');
    
    // SOLO crear barras si estamos en el juego, no en login/registro
    const gameView = document.getElementById('pet-container');
    const welcomeView = document.getElementById('welcome-view');
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    
    // Verificar que estamos en la vista del juego
    if (!gameView || gameView.classList.contains('hidden')) {
      console.log('⏭️ No estamos en el juego, saltando creación de barras');
      return;
    }
    
    // Verificar que NO estamos en ninguna vista de formulario
    if (welcomeView && !welcomeView.classList.contains('hidden')) {
      console.log('⏭️ Aún estamos en la vista de bienvenida, saltando creación de barras');
      return;
    }
    
    if (loginView && !loginView.classList.contains('hidden')) {
      console.log('⏭️ Estamos en login, saltando creación de barras');
      return;
    }
    
    if (registerView && !registerView.classList.contains('hidden')) {
      console.log('⏭️ Estamos en registro, saltando creación de barras');
      return;
    }
    
    // Verificar que tenemos datos de mascota válidos
    if (!mascota || !mascota._id) {
      console.log('⏭️ No hay datos válidos de mascota, saltando creación de barras');
      return;
    }
    
    // Verificar si ya existe el contenedor
    let statsContainer = document.getElementById('stats-container');
    if (statsContainer) {
      console.log('✅ Contenedor de estadísticas ya existe');
      return; // Ya existe, no crear de nuevo
    }
    
    // Crear el contenedor principal DENTRO del contenedor del juego
    statsContainer = document.createElement('div');
    statsContainer.id = 'stats-container';
    
    // HTML de las barras de estado con valores iniciales de la mascota
    statsContainer.innerHTML = `
      <div class="stat-hunger">
        <div class="stat-bar-label">Hambre <span>${Math.round(mascota.hambre || 100)}</span></div>
        <div class="stat-bar">
          <div class="stat-bar-fill" style="width: ${Math.max(0, Math.min(100, mascota.hambre || 100))}%"></div>
        </div>
      </div>
      <div class="stat-energy">
        <div class="stat-bar-label">Energía <span>${Math.round(mascota.energia || 100)}</span></div>
        <div class="stat-bar">
          <div class="stat-bar-fill" style="width: ${Math.max(0, Math.min(100, mascota.energia || 100))}%"></div>
        </div>
      </div>
      <div class="stat-happiness">
        <div class="stat-bar-label">Felicidad <span>${Math.round(mascota.felicidad || 100)}</span></div>
        <div class="stat-bar">
          <div class="stat-bar-fill" style="width: ${Math.max(0, Math.min(100, mascota.felicidad || 100))}%"></div>
        </div>
      </div>
      <div class="stat-cleanliness">
        <div class="stat-bar-label">Limpieza <span>${Math.round(mascota.limpieza || 100)}</span></div>
        <div class="stat-bar">
          <div class="stat-bar-fill" style="width: ${Math.max(0, Math.min(100, mascota.limpieza || 100))}%"></div>
        </div>
      </div>
    `;
    
    // Agregar al contenedor del juego, no al body
    gameView.appendChild(statsContainer);
    
    // Hacer visible las barras con animación
    setTimeout(() => {
      statsContainer.classList.add('visible');
    }, 100);
    
    console.log('✅ Barras de estado creadas dinámicamente en el juego');
  }
  
  // Función para eliminar las barras cuando salimos del juego
  function eliminarBarrasEstado() {
    const statsContainer = document.getElementById('stats-container');
    if (statsContainer) {
      statsContainer.remove();
      console.log('🗑️ Barras de estado eliminadas');
    }
  }
  
  // Función para verificar si debemos mostrar/ocultar barras
  function verificarEstadoBarras() {
    const gameView = document.getElementById('pet-container');
    const welcomeView = document.getElementById('welcome-view');
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    
    // Si NO estamos en el juego o estamos en cualquier formulario, eliminar barras
    if (!gameView || gameView.classList.contains('hidden') || 
        (welcomeView && !welcomeView.classList.contains('hidden')) ||
        (loginView && !loginView.classList.contains('hidden')) ||
        (registerView && !registerView.classList.contains('hidden'))) {
      eliminarBarrasEstado();
    }
  }
  
  // Función para actualizar las barras de estado con los valores reales
  function actualizarBarrasReales(mascota) {
    console.log('📊 Actualizando barras con valores reales...', mascota);
    
    // Mapeo de datos de mascota a barras de estado
    const stats = {
      'stat-hunger': { 
        value: mascota.hambre || 100, 
        label: 'Hambre' 
      },
      'stat-energy': { 
        value: mascota.energia || 100, 
        label: 'Energía' 
      },
      'stat-happiness': { 
        value: mascota.felicidad || 100, 
        label: 'Felicidad' 
      },
      'stat-cleanliness': { 
        value: mascota.limpieza || 100, 
        label: 'Limpieza' 
      }
    };
    
    // Actualizar cada barra
    Object.entries(stats).forEach(([className, data]) => {
      const statContainer = document.querySelector(`.${className}`);
      if (statContainer) {
        // Encontrar la barra de llenado y el label de valor
        const fillBar = statContainer.querySelector('.stat-bar-fill');
        const labelSpan = statContainer.querySelector('.stat-bar-label span');
        
        if (fillBar) {
          const clampedValue = Math.max(0, Math.min(100, data.value));
          fillBar.style.width = `${clampedValue}%`;
          console.log(`✅ ${data.label}: ${clampedValue}%`);
        }
        
        if (labelSpan) {
          labelSpan.textContent = Math.round(data.value);
        }
      } else {
        console.log(`❌ No se encontró .${className}`);
      }
    });
  }
  
  // Observer para cambios en las clases de las vistas
  function configurarObserver() {
    const gameView = document.getElementById('pet-container');
    const welcomeView = document.getElementById('welcome-view');
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    
    const elementos = [gameView, welcomeView, loginView, registerView].filter(el => el);
    
    if (elementos.length > 0) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            setTimeout(() => {
              verificarEstadoBarras();
              
              // Si entramos al juego, ejecutar diagnóstico para cargar mascota
              const gameView = document.getElementById('pet-container');
              const welcomeView = document.getElementById('welcome-view');
              const loginView = document.getElementById('login-view');
              const registerView = document.getElementById('register-view');
              
              if (gameView && !gameView.classList.contains('hidden') && 
                  welcomeView && welcomeView.classList.contains('hidden') &&
                  (!loginView || loginView.classList.contains('hidden')) &&
                  (!registerView || registerView.classList.contains('hidden'))) {
                console.log('🎮 Entrando al juego, ejecutando diagnóstico...');
                setTimeout(diagnosticarMascota, 500);
              }
            }, 100);
          }
        });
      });
      
      elementos.forEach(elemento => {
        observer.observe(elemento, { attributes: true });
      });
      
      console.log('👁️ Observer configurado para detectar cambios de vista');
    }
  }
  
  // Exponer funciones globalmente para uso en otros scripts
  window.petDiagnostic = {
    diagnosticarMascota,
    crearBarrasEstado,
    eliminarBarrasEstado,
    verificarEstadoBarras
  };
  
  // Ejecutar diagnóstico cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM listo, ejecutando diagnóstico...');
    
    // Limpieza inicial
    limpiezaInicial();
    
    setTimeout(() => {
      configurarObserver();
      verificarEstadoBarras();
      diagnosticarMascota();
    }, 1000);
  });
  
  // Si el DOM ya está listo, ejecutar inmediatamente
  if (document.readyState === 'loading') {
    console.log('⏳ Esperando a que el DOM esté listo...');
  } else {
    console.log('⚡ DOM ya listo, ejecutando diagnóstico inmediatamente...');
    
    // Limpieza inicial
    limpiezaInicial();
    
    setTimeout(() => {
      configurarObserver();
      verificarEstadoBarras();
      diagnosticarMascota();
    }, 500);
  }
})();
