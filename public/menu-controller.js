// Script específico para ocultar el menú de navegación en la vista de selección de mascotas
console.log('🚫 Controlador de menú de navegación iniciado');

function hideGameMenuInSelection() {
  const selectPetView = document.getElementById('select-pet-view');
  const gameMenu = document.getElementById('game-menu');
  const statusBars = document.getElementById('status-bars');
  
  if (selectPetView && !selectPetView.classList.contains('hidden')) {
    console.log('🎯 Vista de selección de mascotas detectada - ocultando menú de navegación');
    
    if (gameMenu) {
      gameMenu.style.display = 'none';
      console.log('✅ Menú de navegación ocultado');
    }
    
    if (statusBars) {
      statusBars.style.display = 'none';
      console.log('✅ Barras de estado ocultadas');
    }
  } else {
    console.log('ℹ️ No estamos en la vista de selección, menú puede mostrarse');
  }
}

// Ejecutar inmediatamente
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(hideGameMenuInSelection, 50);
  
  // Verificar cada 500ms por 10 segundos
  let checks = 0;
  const interval = setInterval(() => {
    hideGameMenuInSelection();
    checks++;
    if (checks > 20) { // 20 checks * 500ms = 10 segundos
      clearInterval(interval);
    }
  }, 500);
});

// También ejecutar si se detecta un cambio en las clases
if (typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.target.id === 'select-pet-view' && mutation.attributeName === 'class') {
        setTimeout(hideGameMenuInSelection, 100);
      }
    });
  });
  
  document.addEventListener('DOMContentLoaded', function() {
    const selectPetView = document.getElementById('select-pet-view');
    if (selectPetView) {
      observer.observe(selectPetView, { attributes: true, attributeFilter: ['class'] });
    }
  });
}
