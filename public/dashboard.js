// Dashboard de alimentos
document.addEventListener('DOMContentLoaded', () => {
  // Agregar función de mensaje de error de respaldo en caso de que no exista en window
  if (!window.mostrarMensaje) {
    window.mostrarMensaje = function(mensaje, tipo = 'success') {
      console.log(`Mensaje (${tipo}): ${mensaje}`);
      alert(mensaje);
    };
  }
  
  // Referencias a los elementos del dashboard
  const foodDashboard = document.getElementById('food-dashboard');
  const dashboardOverlay = document.getElementById('dashboard-overlay');
  const dashboardClose = document.getElementById('dashboard-close');
  const foodPanelToggle = document.getElementById('food-panel-toggle');
  const dashboardTabs = document.querySelectorAll('.dashboard-tab');
  
  // Asegurarnos que el botón de comidas esté visible en escena kitchen
  if (foodPanelToggle) {
    const isKitchen = document.querySelector('.scene-kitchen.scene-active');
    if (isKitchen) {
      foodPanelToggle.style.display = 'flex';
    }
  }
  
  // Evento para abrir el dashboard
  if (foodPanelToggle) {
    foodPanelToggle.addEventListener('click', () => {
      foodDashboard.classList.toggle('visible');
      // Ya no mostramos el overlay
      // dashboardOverlay.classList.toggle('visible');
      foodPanelToggle.classList.toggle('active');
      
      // Ya no necesitamos la zona de alimentación con el sistema de click-to-feed
    });
  }
  
  // Evento para cerrar el dashboard con el botón X
  dashboardClose.addEventListener('click', () => {
    foodDashboard.classList.remove('visible');
    // Ya no ocultamos el overlay porque no lo mostramos
    // dashboardOverlay.classList.remove('visible');
    foodPanelToggle.classList.remove('active');
  });
  
  // Ya no necesitamos este evento porque no estamos mostrando el overlay
  /* 
  dashboardOverlay.addEventListener('mousedown', (e) => {
    if (e.target === dashboardOverlay && !document.querySelector('.dragging')) {
      foodDashboard.classList.remove('visible');
      dashboardOverlay.classList.remove('visible');
      foodPanelToggle.classList.remove('active');
    }
  });
  */
  
  // Sistema de pestañas
  dashboardTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Desactivar todas las pestañas
      dashboardTabs.forEach(t => t.classList.remove('active'));
      // Activar la pestaña actual
      tab.classList.add('active');
      
      // Obtener el ID del contenido de la pestaña
      const tabId = tab.getAttribute('data-tab');
      
      // Ocultar todos los contenidos
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      // Mostrar el contenido correspondiente
      document.getElementById(`tab-${tabId}`).classList.add('active');
    });
  });
});

// Función para renderizar el dashboard de comidas
function renderFoodDashboard() {
  // Referencias a los elementos del dashboard
  const foodDashboard = document.getElementById('food-dashboard');
  const dashboardOverlay = document.getElementById('dashboard-overlay');
  const foodPanelToggle = document.getElementById('food-panel-toggle');
  
  // Asegurar que el botón esté visible en la cocina
  if (document.querySelector('.scene-kitchen.scene-active') && foodPanelToggle) {
    foodPanelToggle.style.display = 'flex';
  }
  
  // Limpiar los paneles de comida por categoría
  document.querySelectorAll('.food-panel').forEach(panel => {
    panel.innerHTML = '';
  });
  
  // Clasificar los alimentos por categoría
  const foodByCategory = {
    comida: [],
    bebida: [],
    snack: [],
    postre: []
  };
  
  // Mapeo de los tipos originales a las nuevas categorías
  const typeToCategory = {
    'comida': 'comida',
    'fruta': 'comida',
    'verdura': 'comida',
    'bebida': 'bebida',
    'croqueta': 'snack',
    'snack': 'snack',
    'postre': 'postre'
  };
  
  // Clasificar los alimentos en las nuevas categorías
  foodItems.forEach(food => {
    const category = typeToCategory[food.tipo] || 'comida';
    foodByCategory[category].push(food);
  });
  
  // Nombres amigables para las subcategorías
  const subCategoryNames = {
    'comida': '🍽️ Platos principales',
    'fruta': '🍎 Frutas',
    'verdura': '🥬 Verduras',
    'bebida': '🥤 Bebidas refrescantes',
    'croqueta': '🦴 Croquetas especiales',
    'snack': '🍪 Snacks deliciosos',
    'postre': '🍰 Postres dulces'
  };
  
  // Renderizar cada categoría en su pestaña correspondiente
  Object.entries(foodByCategory).forEach(([category, items]) => {
    if (items.length === 0) return;
    
    const panelId = `food-panel-${category}`;
    const panel = document.getElementById(panelId);
    if (!panel) return;
    
    // Agrupar por subtipo dentro de cada categoría
    const itemsByType = items.reduce((acc, food) => {
      if (!acc[food.tipo]) {
        acc[food.tipo] = [];
      }
      acc[food.tipo].push(food);
      return acc;
    }, {});
    
    // Renderizar las subcategorías
    Object.entries(itemsByType).forEach(([tipo, subtypeItems]) => {
      const foodCategory = document.createElement('div');
      foodCategory.className = 'food-category';
      
      const title = document.createElement('div');
      title.className = 'food-category-title';
      title.textContent = subCategoryNames[tipo] || tipo;
      foodCategory.appendChild(title);
      
      const itemsGrid = document.createElement('div');
      itemsGrid.className = 'food-items-grid';
      
      subtypeItems.forEach(food => {
        const foodItem = document.createElement('div');
        foodItem.className = `food-item food-type-${tipo}`;
        foodItem.setAttribute('data-food-id', food.id);
        foodItem.setAttribute('draggable', 'true');
        
        // Indicador de categoría (círculo de color)
        const categoryIndicator = document.createElement('div');
        categoryIndicator.className = 'category-indicator';
        foodItem.appendChild(categoryIndicator);
        
        const emoji = document.createElement('span');
        emoji.className = 'food-emoji';
        // Usar icono personalizado o emoji por defecto
        let emojiValue = getFoodEmoji(food.tipo);
        if (food.icono && food.icono !== '') {
          emojiValue = food.icono;
        }
        emoji.textContent = emojiValue;
        
        const nombre = document.createElement('div');
        nombre.className = 'food-name';
        nombre.textContent = food.nombre;
        
        const tooltip = document.createElement('div');
        tooltip.className = 'food-tooltip';
        tooltip.textContent = `${food.nombre} - Hambre: ${Math.abs(food.efectos.hambre)}`;
        
        // Agregar elementos al foodItem
        foodItem.appendChild(emoji);
        foodItem.appendChild(nombre);
        foodItem.appendChild(tooltip);
        
        // Reemplazar arrastre por sistema de click para alimentar a la mascota
        foodItem.addEventListener('click', async function() {
          // Añadir clase de animación al hacer clic
          this.classList.add('food-item-clicked');
          
          try {
            console.log(`Alimentando mascota con comida ID: ${food.id}`);
            
            // Crear payload para la solicitud
            const payload = { foodId: food.id };
            
            // Enviar solicitud de alimentación
            const response = await window.authFetch(`${window.API_BASE}/mis-mascotas/mi-mascota/alimentar`, {
              method: 'POST',
              body: JSON.stringify(payload),
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            if (response.ok) {
              const result = await response.json();
              console.log("Alimentación exitosa:", result);
              
              // Añadir animación de alimentación a la mascota
              const petSvg = document.getElementById('pet-svg-game');
              if (petSvg) {
                petSvg.classList.add('eating');
                setTimeout(() => {
                  petSvg.classList.remove('eating');
                  if (window.obtenerEstadoActualizado) {
                  window.obtenerEstadoActualizado();
                } else {
                  console.log("La función obtenerEstadoActualizado no está disponible");
                }
                }, 1000);
              }
              
              window.mostrarMensaje(result.mensaje || "¡Mascota alimentada con éxito!");
            } else {
              console.error("Error al alimentar mascota:", response.status);
              window.mostrarMensaje("Error al alimentar mascota", "error");
            }
          } catch (error) {
            console.error("Error en solicitud de alimentación:", error);
            window.mostrarMensaje("Error de conexión", "error");
          }
          
          // Eliminar clase de animación después de un tiempo
          setTimeout(() => {
            this.classList.remove('food-item-clicked');
          }, 500);
        });
        
        // Agregar foodItem a la grid
        itemsGrid.appendChild(foodItem);
      });
      
      // Agregar la grid a la categoría
      foodCategory.appendChild(itemsGrid);
      // Agregar la categoría al panel
      panel.appendChild(foodCategory);
    });
  });
  
  // Mostrar el botón de comida si no está visible
  if (foodPanelToggle.style.display === 'none') {
    foodPanelToggle.style.display = 'flex';
  }
}
