// Script para detectar los clics en botones
document.addEventListener('DOMContentLoaded', function() {
  console.log('🧪 Iniciando test de clics en botones...');

  // Detectar cualquier clic en el documento
  document.addEventListener('click', function(e) {
    console.log('🔍 Clic detectado en:', e.target);
    console.log('🏷️ ID del elemento:', e.target.id);
    console.log('🏷️ Clase del elemento:', e.target.className);
    console.log('📝 Texto del elemento:', e.target.textContent.trim());
    
    // Si el elemento es un botón o parece serlo
    if (e.target.tagName === 'BUTTON' || 
        e.target.id.includes('btn') || 
        e.target.className.includes('btn')) {
      console.log('✨ BOTÓN DETECTADO: Acción detectada pero posiblemente no procesada');
    }
  });

  // Monitorear cambios en las clases de vistas principales
  const views = ['welcome-view', 'register-view', 'login-view', 'select-pet-view'];
  
  // Configurar un MutationObserver para cada vista
  views.forEach(viewId => {
    const view = document.getElementById(viewId);
    if (view) {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.attributeName === 'class') {
            const isHidden = view.classList.contains('hidden');
            console.log(`🔄 Vista "${viewId}" cambió: ${isHidden ? 'oculta' : 'visible'}`);
          }
        });
      });
      
      observer.observe(view, { attributes: true });
    }
  });
});
