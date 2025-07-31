// Versión limpia del script de debug que no crea el panel de diagnóstico
// y solo mantiene funcionalidad mínima para el juego

document.addEventListener('DOMContentLoaded', () => {
  // Mantener las funciones de utilidad pero sin crear interfaces visuales
  
  // Función para verificar si estamos en un ambiente de desarrollo
  window.isDev = function() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1';
  };
  
  // Función simplificada para logear errores de API sin mostrarlos al usuario
  window.logApiError = function(endpoint, error) {
    if (window.isDev()) {
      console.error(`Error en ${endpoint}:`, error);
    }
  };
  
  // Mantener la función de testApi pero sin crear interfaces visuales
  window.testApi = async function() {
    const API_BASE = window.API_BASE || "http://localhost:3000";
    
    try {
      const startTime = performance.now();
      const response = await fetch(`${API_BASE}/`);
      const endTime = performance.now();
      const timeMs = Math.round(endTime - startTime);
      
      if (response.ok) {
        console.log(`✅ API conectada (${timeMs}ms)`);
        return true;
      } else {
        console.error(`❌ Error en API: ${response.status}`);
        return false;
      }
    } catch (error) {
      console.error('❌ Error de conexión a la API:', error);
      return false;
    }
  };
});
