// Script para detectar cambios en el token y recargar la página
// Esto asegura que siempre se use el token más reciente

(function() {
  console.log('🔄 Iniciando monitor de token...');
  
  // Almacenar el token inicial
  let lastToken = localStorage.getItem('token');
  
  // Verificar el token cada 3 segundos
  setInterval(() => {
    const currentToken = localStorage.getItem('token');
    
    // Si el token ha cambiado, recargar la página
    if (currentToken !== lastToken) {
      console.log('🔄 El token ha cambiado, recargando página...');
      lastToken = currentToken;
      
      // Usar timeout para permitir que otros scripts se ejecuten primero
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }, 3000);
})();
