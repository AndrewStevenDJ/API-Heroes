// Botones de acción para interactuar con la mascota
(function() {
  console.log('🎮 Sistema de botones de acción iniciado');
  
  // LIMPIAR CUALQUIER BOTÓN EXISTENTE AL CARGAR
  function limpiezaInicialBotones() {
    const buttonContainer = document.getElementById('action-buttons');
    if (buttonContainer) {
      buttonContainer.remove();
      console.log('🧹 Botones eliminados en limpieza inicial');
    }
  }
  
  // Ejecutar limpieza inmediata
  limpiezaInicialBotones();
  
  // Función para crear los botones de acción
  function crearBotonesAccion() {
    // Verificar que estamos en el juego
    const gameView = document.getElementById('pet-container');
    const welcomeView = document.getElementById('welcome-view');
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    
    if (!gameView || gameView.classList.contains('hidden')) {
      console.log('⏭️ No estamos en el juego, saltando creación de botones');
      return;
    }
    
    // Verificar que NO estamos en ningún formulario
    if ((welcomeView && !welcomeView.classList.contains('hidden')) ||
        (loginView && !loginView.classList.contains('hidden')) ||
        (registerView && !registerView.classList.contains('hidden'))) {
      console.log('⏭️ Estamos en un formulario, saltando creación de botones');
      return;
    }
    
    // Verificar que tenemos una mascota cargada
    if (!window.estadoMascota || !window.estadoMascota._id) {
      console.log('⏭️ No hay mascota cargada, saltando creación de botones');
      return;
    }
    
    // Verificar si ya existen los botones
    if (document.getElementById('action-buttons')) {
      console.log('✅ Botones de acción ya existen');
      return;
    }
    
    // Crear contenedor de botones
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'action-buttons';
    buttonContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 10px;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.9);
      padding: 10px;
      border-radius: 15px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    // Estilo común para botones
    const buttonStyle = `
      padding: 8px 16px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      color: white;
      transition: all 0.3s ease;
      min-width: 70px;
    `;
    
    // Crear botones de acción
    const acciones = [
      { id: 'btn-alimentar', texto: '🍎 Alimentar', color: '#4CAF50', accion: 'alimentar' },
      { id: 'btn-jugar', texto: '🎾 Jugar', color: '#2196F3', accion: 'jugar' },
      { id: 'btn-dormir', texto: '😴 Dormir', color: '#9C27B0', accion: 'dormir' }
    ];
    
    acciones.forEach(({ id, texto, color, accion }) => {
      const button = document.createElement('button');
      button.id = id;
      button.textContent = texto;
      button.style.cssText = buttonStyle + `background-color: ${color};`;
      
      // Efecto hover
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.05)';
        button.style.filter = 'brightness(1.1)';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
        button.style.filter = 'brightness(1)';
      });
      
      // Acción del botón
      button.addEventListener('click', async () => {
        button.disabled = true;
        button.style.opacity = '0.6';
        button.textContent = '⏳ ...';
        
        try {
          if (window.statsRealtime && window.statsRealtime.accionMascota) {
            const resultado = await window.statsRealtime.accionMascota(accion);
            
            if (resultado) {
              // Efecto de éxito
              button.style.backgroundColor = '#4CAF50';
              button.textContent = '✅ ¡Hecho!';
              
              setTimeout(() => {
                button.style.backgroundColor = color;
                button.textContent = texto;
                button.disabled = false;
                button.style.opacity = '1';
              }, 1500);
            } else {
              // Efecto de error
              button.style.backgroundColor = '#F44336';
              button.textContent = '❌ Error';
              
              setTimeout(() => {
                button.style.backgroundColor = color;
                button.textContent = texto;
                button.disabled = false;
                button.style.opacity = '1';
              }, 2000);
            }
          } else {
            console.log('❌ Sistema de tiempo real no disponible');
            button.disabled = false;
            button.style.opacity = '1';
            button.textContent = texto;
          }
        } catch (error) {
          console.error('💥 Error en botón de acción:', error);
          button.style.backgroundColor = '#F44336';
          button.textContent = '❌ Error';
          
          setTimeout(() => {
            button.style.backgroundColor = color;
            button.textContent = texto;
            button.disabled = false;
            button.style.opacity = '1';
          }, 2000);
        }
      });
      
      buttonContainer.appendChild(button);
    });
    
    // Agregar al DOM
    document.body.appendChild(buttonContainer);
    console.log('✅ Botones de acción creados');
  }
  
  // Función para eliminar los botones cuando salimos del juego
  function eliminarBotonesAccion() {
    const buttonContainer = document.getElementById('action-buttons');
    if (buttonContainer) {
      buttonContainer.remove();
      console.log('🗑️ Botones de acción eliminados');
    }
  }
  
  // Función para verificar si debemos mostrar/ocultar botones
  function verificarEstadoBotones() {
    const gameView = document.getElementById('pet-container');
    const welcomeView = document.getElementById('welcome-view');
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    
    if (gameView && !gameView.classList.contains('hidden') && 
        welcomeView && welcomeView.classList.contains('hidden') &&
        (!loginView || loginView.classList.contains('hidden')) &&
        (!registerView || registerView.classList.contains('hidden')) &&
        window.estadoMascota && window.estadoMascota._id) {
      // Estamos en el juego con mascota cargada, crear botones
      crearBotonesAccion();
    } else {
      // No estamos en el juego o no hay mascota, eliminar botones
      eliminarBotonesAccion();
    }
  }
  
  // Observer para cambios en las vistas
  function configurarObserverBotones() {
    const gameView = document.getElementById('pet-container');
    const welcomeView = document.getElementById('welcome-view');
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    
    const elementos = [gameView, welcomeView, loginView, registerView].filter(el => el);
    
    if (elementos.length > 0) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            setTimeout(verificarEstadoBotones, 100);
          }
        });
      });
      
      elementos.forEach(elemento => {
        observer.observe(elemento, { attributes: true });
      });
      
      console.log('👁️ Observer de botones configurado');
    }
  }
  
  // Inicializar cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', () => {
    // Limpieza inicial
    limpiezaInicialBotones();
    
    setTimeout(() => {
      configurarObserverBotones();
      verificarEstadoBotones();
    }, 1200);
  });
  
  // Si el DOM ya está listo
  if (document.readyState !== 'loading') {
    // Limpieza inicial
    limpiezaInicialBotones();
    
    setTimeout(() => {
      configurarObserverBotones();
      verificarEstadoBotones();
    }, 800);
  }
})();
