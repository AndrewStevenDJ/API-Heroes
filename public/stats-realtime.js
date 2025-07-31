// Sistema de actualización en tiempo real de las barras de estado
(function() {
  console.log('🔄 Sistema de barras en tiempo real iniciado');
  
  let intervalId = null;
  let lastUpdateTime = 0;
  const UPDATE_INTERVAL = 5000; // Actualizar cada 5 segundos
  
  // LIMPIAR CUALQUIER BARRA EXISTENTE AL CARGAR
  function limpiezaInicialRealtime() {
    const statsContainer = document.getElementById('stats-container');
    if (statsContainer) {
      statsContainer.remove();
      console.log('🧹 Barras eliminadas por sistema tiempo real');
    }
  }
  
  // Ejecutar limpieza inmediata
  limpiezaInicialRealtime();
  
  // Función para actualizar las barras con datos en tiempo real de la API
  async function actualizarEstadoTiempoReal() {
    const token = localStorage.getItem('token');
    const API_BASE = window.API_BASE || 'http://localhost:3000';
    
    if (!token) {
      console.log('⚠️ No hay token, deteniendo actualizaciones');
      detenerActualizaciones();
      return;
    }
    
    // Verificar que estamos en el juego
    const gameView = document.getElementById('pet-container');
    const welcomeView = document.getElementById('welcome-view');
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    
    if (!gameView || gameView.classList.contains('hidden') || 
        (welcomeView && !welcomeView.classList.contains('hidden')) ||
        (loginView && !loginView.classList.contains('hidden')) ||
        (registerView && !registerView.classList.contains('hidden'))) {
      console.log('⏭️ No estamos en el juego, saltando actualización');
      return;
    }
    
    try {
      console.log('📡 Obteniendo estado actual de la mascota...');
      const response = await fetch(`${API_BASE}/mis-mascotas/mi-mascota`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const mascota = await response.json();
        console.log('🔄 Estado actualizado de la API:', {
          hambre: mascota.hambre,
          energia: mascota.energia,
          felicidad: mascota.felicidad,
          limpieza: mascota.limpieza
        });
        
        // Actualizar estado global
        if (window.estadoMascota) {
          Object.assign(window.estadoMascota, mascota);
        } else {
          window.estadoMascota = mascota;
        }
        
        // Actualizar las barras visualmente
        actualizarBarrasVisuales(mascota);
        
        lastUpdateTime = Date.now();
      } else if (response.status === 401) {
        console.log('🔒 Token inválido, deteniendo actualizaciones');
        localStorage.removeItem('token');
        detenerActualizaciones();
      }
    } catch (error) {
      console.error('💥 Error al actualizar estado:', error);
    }
  }
  
  // Función para actualizar solo las barras visuales (sin llamar a la API)
  function actualizarBarrasVisuales(mascota) {
    const stats = {
      'stat-hunger': { 
        value: mascota.hambre || 100, 
        label: 'Hambre',
        color: getStatColor(mascota.hambre || 100)
      },
      'stat-energy': { 
        value: mascota.energia || 100, 
        label: 'Energía',
        color: getStatColor(mascota.energia || 100)
      },
      'stat-happiness': { 
        value: mascota.felicidad || 100, 
        label: 'Felicidad',
        color: getStatColor(mascota.felicidad || 100)
      },
      'stat-cleanliness': { 
        value: mascota.limpieza || 100, 
        label: 'Limpieza',
        color: getStatColor(mascota.limpieza || 100)
      }
    };
    
    Object.entries(stats).forEach(([className, data]) => {
      const statContainer = document.querySelector(`.${className}`);
      if (statContainer) {
        const fillBar = statContainer.querySelector('.stat-bar-fill');
        const labelSpan = statContainer.querySelector('.stat-bar-label span');
        
        if (fillBar) {
          const clampedValue = Math.max(0, Math.min(100, data.value));
          fillBar.style.width = `${clampedValue}%`;
          fillBar.style.backgroundColor = data.color;
          fillBar.style.transition = 'width 0.5s ease-in-out, background-color 0.3s ease';
        }
        
        if (labelSpan) {
          const roundedValue = Math.round(data.value);
          labelSpan.textContent = roundedValue;
          
          // Efecto visual para cambios
          labelSpan.style.transition = 'color 0.3s ease';
          labelSpan.style.color = data.color;
        }
      }
    });
  }
  
  // Función para obtener el color según el valor del estado
  function getStatColor(value) {
    if (value >= 80) return '#4CAF50'; // Verde - Excelente
    if (value >= 60) return '#8BC34A'; // Verde claro - Bueno
    if (value >= 40) return '#FFC107'; // Amarillo - Regular
    if (value >= 20) return '#FF9800'; // Naranja - Malo
    return '#F44336'; // Rojo - Crítico
  }
  
  // Función para iniciar las actualizaciones automáticas
  function iniciarActualizaciones() {
    if (intervalId) {
      clearInterval(intervalId);
    }
    
    console.log('🚀 Iniciando actualizaciones automáticas cada 5 segundos');
    intervalId = setInterval(actualizarEstadoTiempoReal, UPDATE_INTERVAL);
    
    // Primera actualización inmediata
    actualizarEstadoTiempoReal();
  }
  
  // Función para detener las actualizaciones
  function detenerActualizaciones() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      console.log('⏹️ Actualizaciones automáticas detenidas');
    }
  }
  
  // Función para manejar acciones del usuario (alimentar, limpiar, etc.)
  async function accionMascota(tipoAccion, data = {}) {
    const token = localStorage.getItem('token');
    const API_BASE = window.API_BASE || 'http://localhost:3000';
    
    if (!token) {
      console.log('❌ No hay token para realizar la acción');
      return false;
    }
    
    try {
      console.log(`🎮 Realizando acción: ${tipoAccion}`, data);
      
      // Mapeo de acciones a endpoints de la API
      const endpoints = {
        'alimentar': '/mis-mascotas/mi-mascota/alimentar',
        'jugar': '/mis-mascotas/mi-mascota/jugar',
        'dormir': '/mis-mascotas/mi-mascota/dormir'
        // Nota: Si tienes endpoint para bañar/limpiar, agrégalo aquí
      };
      
      const endpoint = endpoints[tipoAccion];
      if (!endpoint) {
        console.log(`❌ Acción '${tipoAccion}' no disponible`);
        return false;
      }
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        const resultado = await response.json();
        console.log(`✅ Acción ${tipoAccion} exitosa:`, resultado);
        
        // Actualizar inmediatamente después de la acción
        await actualizarEstadoTiempoReal();
        return resultado;
      } else {
        const errorText = await response.text();
        console.log(`❌ Error en acción ${tipoAccion}:`, response.status, errorText);
        return false;
      }
    } catch (error) {
      console.error(`💥 Error al realizar acción ${tipoAccion}:`, error);
      return false;
    }
  }
  
  // Detectar cuando entramos al juego para iniciar actualizaciones
  function verificarInicioJuego() {
    const gameView = document.getElementById('pet-container');
    const welcomeView = document.getElementById('welcome-view');
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    
    // Verificar que estamos en el juego Y que no estamos en ningún formulario
    if (gameView && !gameView.classList.contains('hidden') && 
        welcomeView && welcomeView.classList.contains('hidden') &&
        (!loginView || loginView.classList.contains('hidden')) &&
        (!registerView || registerView.classList.contains('hidden')) &&
        window.estadoMascota && window.estadoMascota._id) {
      console.log('🎮 Usuario entró al juego, iniciando actualizaciones');
      iniciarActualizaciones();
      return true;
    }
    return false;
  }
  
  // Detectar cuando salimos del juego para detener actualizaciones
  function verificarSalidaJuego() {
    const gameView = document.getElementById('pet-container');
    const welcomeView = document.getElementById('welcome-view');
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    
    // Si estamos en cualquier formulario o no en el juego, detener
    if (!gameView || gameView.classList.contains('hidden') || 
        (welcomeView && !welcomeView.classList.contains('hidden')) ||
        (loginView && !loginView.classList.contains('hidden')) ||
        (registerView && !registerView.classList.contains('hidden'))) {
      console.log('🚪 Usuario salió del juego, deteniendo actualizaciones');
      detenerActualizaciones();
      return true;
    }
    return false;
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
              if (!verificarSalidaJuego()) {
                verificarInicioJuego();
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
  window.statsRealtime = {
    iniciarActualizaciones,
    detenerActualizaciones,
    actualizarEstadoTiempoReal,
    actualizarBarrasVisuales,
    accionMascota
  };
  
  // Inicializar cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', () => {
    // Limpieza inicial
    limpiezaInicialRealtime();
    
    setTimeout(() => {
      configurarObserver();
      verificarInicioJuego();
    }, 1000);
  });
  
  // Si el DOM ya está listo
  if (document.readyState !== 'loading') {
    // Limpieza inicial
    limpiezaInicialRealtime();
    
    setTimeout(() => {
      configurarObserver();
      verificarInicioJuego();
    }, 500);
  }
  
  // Limpiar al cerrar la página
  window.addEventListener('beforeunload', () => {
    detenerActualizaciones();
  });
})();
