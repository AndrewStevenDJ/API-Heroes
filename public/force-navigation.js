// Script para forzar el comportamiento de los botones
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Forzando comportamiento de botones...');

  // Esperar a que todos los elementos del DOM estén disponibles
  setTimeout(function() {
    // Función para simular un click en un elemento
    function simulateClick(element) {
      if (!element) return false;
      
      // Crear un nuevo evento de click
      const event = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      
      // Disparar el evento en el elemento
      element.dispatchEvent(event);
      return true;
    }
    
    // Función para manejar directamente los eventos de botones
    function setupForcedNavigation() {
      console.log('⚙️ Configurando navegación forzada...');
      
      // 1. Botones de la pantalla de bienvenida
      document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'btn-register') {
          e.preventDefault();
          e.stopPropagation();
          console.log('🛑 Interceptado clic en btn-register');
          forceShowView('register-view');
          return false;
        } else if (e.target && e.target.id === 'btn-login') {
          e.preventDefault();
          e.stopPropagation();
          console.log('🛑 Interceptado clic en btn-login');
          forceShowView('login-view');
          return false;
        }
      }, true); // Usar fase de captura para interceptar antes que otros eventos
      
      // 2. Implementar cambios de vista directamente en los botones
      const btnRegister = document.getElementById('btn-register');
      const btnLogin = document.getElementById('btn-login');
      
      if (btnRegister) {
        btnRegister.onclick = function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log('⚡ Click directo en botón registro');
          forceShowView('register-view');
          return false;
        };
      }
      
      if (btnLogin) {
        btnLogin.onclick = function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log('⚡ Click directo en botón login');
          forceShowView('login-view');
          return false;
        };
      }
    }
    
    // Función para forzar el cambio de vista
    function forceShowView(viewId) {
      console.log(`🔄 Forzando cambio a vista: ${viewId}`);
      
      // Ocultar todas las vistas primero
      const allViews = ['welcome-view', 'register-view', 'login-view', 'select-pet-view'];
      allViews.forEach(id => {
        const view = document.getElementById(id);
        if (view) {
          if (id === viewId) {
            view.classList.remove('hidden');
            console.log(`✅ Vista ${id} mostrada`);
          } else {
            view.classList.add('hidden');
            console.log(`❌ Vista ${id} ocultada`);
          }
        }
      });
    }
    
    // Aplicar las soluciones
    setupForcedNavigation();
    
    // También agregar los manejadores de otros botones de navegación
    document.getElementById('go-login')?.addEventListener('click', function(e) {
      e.preventDefault();
      forceShowView('login-view');
    });
    
    document.getElementById('go-register')?.addEventListener('click', function(e) {
      e.preventDefault();
      forceShowView('register-view');
    });
    
    document.getElementById('back-to-welcome1')?.addEventListener('click', function(e) {
      e.preventDefault();
      forceShowView('welcome-view');
    });
    
    document.getElementById('back-to-welcome2')?.addEventListener('click', function(e) {
      e.preventDefault();
      forceShowView('welcome-view');
    });
    
    console.log('✅ Configuración de navegación forzada completada');
  }, 1000); // Esperar 1 segundo para asegurarnos de que el DOM esté listo
});
