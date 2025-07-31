// Script para limpiar elementos de diagnóstico SOLAMENTE
(function() {
  console.log('🧹 Limpiando elementos de diagnóstico para restaurar diseño original...');
  
  // Función para eliminar elementos de diagnóstico únicamente
  function cleanDiagnosticElements() {
    console.log('🗑️ Eliminando elementos de diagnóstico...');
    
    // Lista de selectores específicos para eliminar
    const selectorsToRemove = [
      '#diagnostics-panel', '#emergency-login-button', '#reset-auth-button',
      '#emergency-pet-button', '#debug-panel', '#token-debug', '#auth-debug',
      '#api-test-panel', '#emergency-access', '#debug-tools',
      '.radial-btn', '.center-btn', '.debug-container', '.diagnostics-wrapper',
      '.test-buttons', '.dev-tools', '.error-panel', '.warning-box',
      '[id*="force-"]', '[class*="debug"]', '[class*="test"]', '[class*="emergency"]',
      'button[style*="background: rgb(255, 92, 92)"]'
    ];
    
    selectorsToRemove.forEach(selector => {
      try {
        document.querySelectorAll(selector).forEach(element => {
          console.log('🗑️ Eliminando:', element.id || element.className || element.tagName);
          element.remove();
        });
      } catch (e) {
        console.log('⚠️ Error eliminando selector:', selector);
      }
    });
  }
  
  // Función para aplicar solo CSS de limpieza (sin forzar diseño)
  function applyCleanupCSS() {
    const style = document.createElement('style');
    style.id = 'whiblu-cleanup-only';
    style.textContent = `
      /* Solo ocultar elementos de diagnóstico - NO forzar diseño */
      #diagnostics-panel, #emergency-login-button, #reset-auth-button, 
      #emergency-pet-button, #debug-panel, #token-debug, #auth-debug, 
      #api-test-panel, #emergency-access, #debug-tools,
      .radial-btn, .center-btn, .debug-container, .diagnostics-wrapper, 
      .test-buttons, .dev-tools, .error-panel, .warning-box,
      [id*="force-"], [class*="debug"], [class*="test"], [class*="emergency"],
      button[style*="background: rgb(255, 92, 92)"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }
    `;
    document.head.appendChild(style);
    console.log('✅ CSS de limpieza aplicado');
  }
  
  // Aplicar limpieza inmediatamente
  applyCleanupCSS();
  cleanDiagnosticElements();
  
  // Ejecutar cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 DOM listo, aplicando limpieza final...');
    cleanDiagnosticElements();
    
    // Limpieza adicional después de cargar
    setTimeout(() => {
      cleanDiagnosticElements();
    }, 1000);
    
    // Limpieza final
    setTimeout(() => {
      cleanDiagnosticElements();
    }, 3000);
  });
})();
