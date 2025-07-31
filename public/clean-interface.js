// Limpieza temprana para evitar barras en página principal
(function() {
  console.log('🧹 Ejecutando limpieza temprana...');
  
  // Función de limpieza específica para página principal
  function limpiezaPaginaPrincipal() {
    const welcomeView = document.getElementById('welcome-view');
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const gameView = document.getElementById('pet-container');
    
    // Solo limpiar si estamos en formularios o página principal
    const enPaginaPrincipal = (welcomeView && !welcomeView.classList.contains('hidden')) ||
                              (loginView && !loginView.classList.contains('hidden')) ||
                              (registerView && !registerView.classList.contains('hidden')) ||
                              !gameView || gameView.classList.contains('hidden');
    
    if (enPaginaPrincipal) {
      // Eliminar barras de estado
      const statsContainer = document.getElementById('stats-container');
      if (statsContainer) {
        statsContainer.remove();
        console.log('🗑️ Stats container eliminado (página principal)');
      }
      
      // Eliminar botones de acción
      const actionButtons = document.getElementById('action-buttons');
      if (actionButtons) {
        actionButtons.remove();
        console.log('🗑️ Action buttons eliminados (página principal)');
      }
    }
  }
  
  // Ejecutar limpieza inmediata
  limpiezaPaginaPrincipal();
  
  // Ejecutar limpieza cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🧹 Limpieza en DOM ready');
    limpiezaPaginaPrincipal();
  });
  
  // Si el DOM ya está listo
  if (document.readyState !== 'loading') {
    console.log('🧹 Limpieza en DOM already loaded');
    limpiezaPaginaPrincipal();
  }
  
  // Limpieza periódica durante los primeros 3 segundos
  const intervalCleanup = setInterval(() => {
    limpiezaPaginaPrincipal();
  }, 200);
  
  // Detener la limpieza periódica después de 3 segundos
  setTimeout(() => {
    clearInterval(intervalCleanup);
    console.log('🛑 Limpieza periódica detenida');
  }, 3000);
})();
