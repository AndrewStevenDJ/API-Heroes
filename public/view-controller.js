// Controlador de vistas - maneja qué elementos de UI se muestran según la vista actual
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎮 Iniciando controlador de vistas...');
  
  // Elementos que solo deben aparecer en el juego
  const gameUIElements = [
    'game-menu',           // Menú de navegación inferior
    'status-bars',         // Barras de estado de la mascota
    'food-panel-toggle',   // Botón para abrir panel de comida
    'scene-indicator',     // Indicador de escenario
    'scene-elements',      // Elementos decorativos de los escenarios
    'pet-container'        // Contenedor de la mascota
  ];
  
  // Elementos que solo deben aparecer en selección de mascotas
  const selectionUIElements = [];
  
  // Función para ocultar/mostrar elementos del juego
  function toggleGameUI(show) {
    console.log(`🎮 ${show ? 'Mostrando' : 'Ocultando'} elementos del juego`);
    
    gameUIElements.forEach(elementId => {
      const element = document.getElementById(elementId);
      if (element) {
        if (show) {
          element.style.display = '';
          element.style.visibility = 'visible';
          console.log(`✅ Mostrado: ${elementId}`);
        } else {
          element.style.display = 'none';
          element.style.visibility = 'hidden';
          console.log(`🚫 Ocultado: ${elementId}`);
        }
      } else {
        console.log(`⚠️ Elemento no encontrado: ${elementId}`);
      }
    });
  }
  
  // Función para detectar la vista actual
  function getCurrentView() {
    const views = [
      'welcome-view',
      'login-view', 
      'register-view',
      'select-pet-view',
      'background'  // Vista principal del juego
    ];
    
    for (const viewId of views) {
      const view = document.getElementById(viewId);
      if (view && !view.classList.contains('hidden')) {
        return viewId;
      }
    }
    return null;
  }
  
  // Función para actualizar la UI según la vista
  function updateUIForView() {
    const currentView = getCurrentView();
    console.log('📱 Vista actual:', currentView);
    
    switch (currentView) {
      case 'background':
        // Vista del juego - mostrar todos los elementos del juego
        toggleGameUI(true);
        console.log('✅ Elementos de juego mostrados');
        break;
        
      case 'select-pet-view':
        // Vista de selección - ocultar elementos del juego
        toggleGameUI(false);
        console.log('🚫 Elementos de juego ocultados para selección de mascota');
        break;
        
      case 'welcome-view':
      case 'login-view':
      case 'register-view':
        // Vistas de autenticación - ocultar elementos del juego
        toggleGameUI(false);
        console.log('🚫 Elementos de juego ocultados para autenticación');
        break;
        
      default:
        console.log('❓ Vista no reconocida, manteniendo estado actual');
    }
  }
  
  // Observer para detectar cambios en las vistas
  const viewObserver = new MutationObserver(function(mutations) {
    let shouldUpdate = false;
    
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const target = mutation.target;
        if (target.id && target.id.includes('-view') || target.id === 'background') {
          shouldUpdate = true;
        }
      }
    });
    
    if (shouldUpdate) {
      // Usar setTimeout para asegurar que los cambios de DOM se hayan completado
      setTimeout(updateUIForView, 100);
    }
  });
  
  // Observar cambios en todas las vistas
  ['welcome-view', 'login-view', 'register-view', 'select-pet-view', 'background'].forEach(viewId => {
    const element = document.getElementById(viewId);
    if (element) {
      viewObserver.observe(element, {
        attributes: true,
        attributeFilter: ['class']
      });
    }
  });
  
  // Actualizar UI inicial
  setTimeout(updateUIForView, 100);
  
  // Ejecutar inmediatamente en caso de que ya estemos en selección de mascotas
  if (!document.getElementById('select-pet-view').classList.contains('hidden')) {
    console.log('🚫 Vista de selección detectada inmediatamente, ocultando UI del juego');
    toggleGameUI(false);
  }
  
  // También verificar periódicamente (como respaldo)
  setInterval(updateUIForView, 2000);
  
  console.log('✅ Controlador de vistas inicializado');
});
