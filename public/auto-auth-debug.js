// Script de auto-diagnóstico de autenticación
(function() {
  'use strict';
  
  // Esperar a que la página cargue completamente
  window.addEventListener('load', function() {
    // Verificar si estamos en modo debug
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth_debug') === 'true') {
      console.log('🔧 Modo diagnóstico de autenticación activado');
      
      // Cargar y ejecutar el script de diagnóstico
      const script = document.createElement('script');
      script.src = '/auth-diagnostic.js';
      script.onload = function() {
        console.log('✅ Script de diagnóstico cargado');
      };
      script.onerror = function() {
        console.error('❌ Error al cargar script de diagnóstico');
        // Ejecutar diagnóstico básico inline
        runBasicDiagnostic();
      };
      document.head.appendChild(script);
    }
  });
  
  function runBasicDiagnostic() {
    console.log('🔍 DIAGNÓSTICO BÁSICO DE AUTENTICACIÓN');
    
    const token = localStorage.getItem('token');
    console.log('Token presente:', !!token);
    
    if (token) {
      console.log('Token (inicio):', token.substring(0, 20) + '...');
      
      // Verificar llamadas authFetch que fallan
      const originalAuthFetch = window.authFetch;
      if (originalAuthFetch) {
        window.authFetch = function(url, options = {}) {
          console.log('🔗 authFetch llamado:', url);
          return originalAuthFetch(url, options)
            .then(response => {
              console.log('📡 Respuesta authFetch:', response.status, response.statusText);
              if (response.status === 401) {
                console.warn('🚫 ERROR 401: Token rechazado para:', url);
              }
              return response;
            })
            .catch(error => {
              console.error('❌ Error en authFetch:', error);
              throw error;
            });
        };
        console.log('✅ authFetch interceptado para debugging');
      }
    }
  }
})();
