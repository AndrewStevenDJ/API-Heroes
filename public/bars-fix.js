// Fix para actualizar barras de estado correctamente
(function() {
  console.log('🔧 Aplicando fix para barras de estado...');
  
  // Función para crear las barras de estado si no existen
  function crearBarrasEstado() {
    console.log('🏗️ Verificando si necesitamos crear barras de estado...');
    
    // Verificar si ya existe el contenedor
    let statsContainer = document.getElementById('stats-container');
    if (statsContainer) {
      console.log('✅ Contenedor de estadísticas ya existe');
      return; // Ya existe, no crear de nuevo
    }
    
    // Crear el contenedor principal
    statsContainer = document.createElement('div');
    statsContainer.id = 'stats-container';
    
    // HTML de las barras de estado
    statsContainer.innerHTML = `
      <div class="stat-hunger">
        <div class="stat-bar-label">Hambre <span>100</span></div>
        <div class="stat-bar">
          <div class="stat-bar-fill" style="width: 100%"></div>
        </div>
      </div>
      <div class="stat-energy">
        <div class="stat-bar-label">Energía <span>100</span></div>
        <div class="stat-bar">
          <div class="stat-bar-fill" style="width: 100%"></div>
        </div>
      </div>
      <div class="stat-happiness">
        <div class="stat-bar-label">Felicidad <span>100</span></div>
        <div class="stat-bar">
          <div class="stat-bar-fill" style="width: 100%"></div>
        </div>
      </div>
      <div class="stat-cleanliness">
        <div class="stat-bar-label">Limpieza <span>100</span></div>
        <div class="stat-bar">
          <div class="stat-bar-fill" style="width: 100%"></div>
        </div>
      </div>
    `;
    
    // Agregar al DOM
    document.body.appendChild(statsContainer);
    console.log('✅ Barras de estado creadas dinámicamente en bars-fix');
  }
  
  // Función correcta para actualizar barras de estado
  function actualizarBarrasCorrecta() {
    console.log('📊 Actualizando barras con estado:', window.estadoMascota);
    
    if (!window.estadoMascota) {
      console.log('⚠️ No hay estado de mascota disponible');
      return;
    }
    
    // Asegurar que las barras existan antes de actualizarlas
    crearBarrasEstado();
    
    const mascota = window.estadoMascota;
    
    // Mapeo de datos de mascota a barras de estado
    const stats = {
      'stat-hunger': { 
        value: mascota.hambre || 100, 
        label: 'Hambre' 
      },
      'stat-energy': { 
        value: mascota.energia || 100, 
        label: 'Energía' 
      },
      'stat-happiness': { 
        value: mascota.felicidad || 100, 
        label: 'Felicidad' 
      },
      'stat-cleanliness': { 
        value: mascota.limpieza || 100, 
        label: 'Limpieza' 
      }
    };
    
    console.log('📊 Valores a aplicar:', stats);
    
    // Actualizar cada barra
    Object.entries(stats).forEach(([className, data]) => {
      const statContainer = document.querySelector(`.${className}`);
      if (statContainer) {
        // Encontrar la barra de llenado y el label de valor
        const fillBar = statContainer.querySelector('.stat-bar-fill');
        const labelSpan = statContainer.querySelector('.stat-bar-label span');
        
        if (fillBar) {
          const clampedValue = Math.max(0, Math.min(100, data.value));
          fillBar.style.width = `${clampedValue}%`;
          console.log(`✅ ${data.label}: ${clampedValue}%`);
        }
        
        if (labelSpan) {
          labelSpan.textContent = Math.round(data.value);
        }
      } else {
        console.log(`❌ No se encontró .${className}`);
      }
    });
  }
  
  // Reemplazar la función global actualizarBarras
  window.actualizarBarras = actualizarBarrasCorrecta;
  
  // También crear una función pública para llamar manualmente
  window.actualizarBarrasReales = actualizarBarrasCorrecta;
  
  console.log('✅ Función actualizarBarras corregida');
  
  // Ejecutar actualización cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', () => {
    // Crear las barras inmediatamente
    setTimeout(() => {
      console.log('🏗️ Creando barras de estado en DOMContentLoaded...');
      crearBarrasEstado();
    }, 100);
    
    // Esperar un poco para que la mascota se cargue
    setTimeout(() => {
      if (window.estadoMascota) {
        console.log('🔄 Aplicando actualización inicial de barras...');
        actualizarBarrasCorrecta();
      }
    }, 2000);
  });
})();
