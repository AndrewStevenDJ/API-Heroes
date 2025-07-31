// Estado global de la mascota (lo hacemos disponible en window para debug)
let estadoMascota = {};
window.estadoMascota = estadoMascota;
// --- MENÃš CIRCULAR DE ACCIONES ---
const actionsMenu = document.getElementById('actions-menu');
const btnFeed = document.getElementById('btn-feed');
const btnBath = document.getElementById('btn-bath');
const btnPlay = document.getElementById('btn-play');
const btnSleep = document.getElementById('btn-sleep');
// Definir API_BASE al principio para que estÃ© disponible para todas las funciones
const API_BASE = window.location.hostname.includes('localhost')
  ? "http://localhost:3000"
  : "https://api-heroes-2lw9.onrender.com";
  
// Hacerlo disponible en window para debug
window.API_BASE = API_BASE;

const btnCenter = document.getElementById('btn-center');

// --- SISTEMA DE COMIDAS ---
// Referencia al dashboard en lugar del panel
const foodPanel = document.getElementById('food-dashboard');
// El petFeedZone ya no es necesario con el sistema de click-to-feed
let draggingFood = null;
let foodItems = [];

// Cargar comidas desde la base de datos
async function loadFoodItems() {
  try {
    const response = await authFetch(`${API_BASE}/comidas`);
    if (!response.ok) {
      throw new Error('Error al cargar comidas');
    }
    foodItems = await response.json();
    renderFoodPanel();
  } catch (error) {
    console.error('Error al cargar comidas:', error);
  }
}

// Cargar comidas cuando se inicia el juego
document.addEventListener('DOMContentLoaded', () => {
  loadFoodItems();
  // Ocultar el panel de comidas al inicio
  if (foodPanel) {
    foodPanel.classList.remove('visible');
  }
  // No agregamos el event listener aquÃ­ porque ya existe en dashboard.js
  // y estaba causando conflicto entre los dos listeners
  
  // Limpiar el clon si se cancela el arrastre (por ejemplo, al presionar ESC)
  document.addEventListener('dragend', () => {
    const clone = document.getElementById('food-drag-clone');
    if (clone && document.body.contains(clone)) {
      document.body.removeChild(clone);
    }
    document.removeEventListener('dragover', moveFoodClone);
  });
});

// Renderizar panel de comidas (ahora usa el dashboard)
function renderFoodPanel() {
  // Llamamos a la nueva funciÃ³n de renderizado del dashboard
  if (typeof renderFoodDashboard === 'function') {
    renderFoodDashboard();
    // No es necesario hacer visible el dashboard aquÃ­, 
    // ya que el botÃ³n de toggle se encarga de eso
  } else if (foodPanel) {
    // CÃ³digo de respaldo por si el dashboard.js no estÃ¡ disponible
    // Simplemente aseguramos que el contenido estÃ© listo, 
    // pero no lo hacemos visible
    
    const foodContainer = document.createElement('div');
    foodContainer.className = 'food-container';

    // Agrupar comidas por tipo
    const foodByType = foodItems.reduce((acc, food) => {
      if (!acc[food.tipo]) {
        acc[food.tipo] = [];
      }
      acc[food.tipo].push(food);
      return acc;
    }, {});

    // Nombres amigables para las categorÃ­as
    const categoryNames = {
      'comida': 'ðŸ½ï¸ Comidas',
      'fruta': 'ðŸŽ Frutas',
      'verdura': 'ðŸ¥¬ Verduras',
      'bebida': 'ðŸ¥¤ Bebidas',
      'croqueta': 'ðŸ¦´ Croquetas'
    };

    // Renderizar cada categorÃ­a
    Object.entries(foodByType).forEach(([tipo, items]) => {
      const category = document.createElement('div');
      category.className = 'food-category';
      
      const title = document.createElement('div');
      title.className = 'food-category-title';
      title.textContent = categoryNames[tipo] || tipo;
      category.appendChild(title);

      const itemsContainer = document.createElement('div');
      itemsContainer.className = 'food-container';

      items.forEach(food => {
        const foodItem = document.createElement('div');
        foodItem.className = 'food-item';
        foodItem.setAttribute('data-food-id', food.id);
        foodItem.setAttribute('draggable', 'true');

        const emoji = document.createElement('span');
        emoji.className = 'food-emoji';
        // Usar siempre el icono personalizado si existe, si no, usar el emoji por tipo
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

        // Eventos de arrastre
        foodItem.addEventListener('dragstart', handleDragStart);
        foodItem.addEventListener('dragend', handleDragEnd);

        // Agregar foodItem al contenedor de items
        itemsContainer.appendChild(foodItem);
      });

      // Agregar el contenedor de items a la categorÃ­a
      category.appendChild(itemsContainer);
      // Agregar la categorÃ­a al panel de comidas
      foodPanel.appendChild(category);
    });
  }
}

// Obtener emoji segÃºn tipo de comida
function getFoodEmoji(tipo) {
  const emojis = {
    'comida': 'ðŸ”',
    'fruta': 'ðŸŽ',
    'verdura': 'ðŸ¥•',
    'bebida': 'ðŸ¥¤',
    'croqueta': 'ðŸ¦´'
  };
  return emojis[tipo] || 'ðŸ½ï¸';
}

// Eventos de arrastre - Ahora acepta un parÃ¡metro opcional food para manejar ambos casos
function handleDragStart(e, foodObject = null) {
  // Encontrar el elemento food-item mÃ¡s cercano de forma robusta
  let foodItem;
  if (e.target.closest) {
    foodItem = e.target.closest('.food-item');
  } else {
    foodItem = e.currentTarget;
  }
  
  if (!foodItem) {
    return;
  }
  
  // Si no se estableciÃ³ en el event listener especÃ­fico
  if (!draggingFood) {
    draggingFood = foodItem;
    foodItem.classList.add('dragging');
  }
  
  // Si se proporciona el objeto food directamente (desde dashboard.js), usar su ID
  let foodId;
  if (foodObject && foodObject.id) {
    foodId = foodObject.id.toString();
    console.log("Main: Usando ID directo del objeto food:", foodId);
  } else {
    // Si no, obtener del atributo data-food-id
    foodId = foodItem.getAttribute('data-food-id');
    console.log("Main: Usando ID del atributo data-food-id:", foodId);
  }
  
  // Intentar establecer el ID en dataTransfer de mÃºltiples maneras
  try {
    e.dataTransfer.setData('text/plain', foodId);
    e.dataTransfer.setData('application/json', JSON.stringify({id: foodId}));
    // TambiÃ©n guardar en text/food-id para ser mÃ¡s especÃ­fico
    e.dataTransfer.setData('text/food-id', foodId);
  } catch (error) {
    console.error("Error al establecer datos de transferencia:", error);
  }
  
  // Almacenar el ID en el elemento para respaldo
  foodItem.dataset.draggingId = foodId;
  
  e.dataTransfer.effectAllowed = 'move';
  
  // Asegurarnos de que la zona de alimentaciÃ³n estÃ© posicionada sobre la mascota
  // Usamos la variable global petFeedZone en lugar de redeclararla
  const petSvg = document.getElementById('pet-svg-game');
  
  if (petFeedZone && petSvg) {
    const petRect = petSvg.getBoundingClientRect();
    // Asegurarnos que el feed zone estÃ¡ directamente sobre la mascota
    petFeedZone.style.position = 'absolute';
    petFeedZone.style.left = '50%'; 
    petFeedZone.style.top = '50%';
    
    // Hacer la zona visible mientras se arrastra
    petFeedZone.style.opacity = '0.5';
    petFeedZone.style.visibility = 'visible';
  }
  
  // Eliminar cualquier clon existente (por si acaso)
  const existingClone = document.getElementById('food-drag-clone');
  if (existingClone) {
    document.body.removeChild(existingClone);
  }

  // Crear un elemento clon que seguirÃ¡ al cursor
  const clone = document.createElement('div');
  clone.className = 'food-clone';
  clone.id = 'food-drag-clone';
  clone.style.display = 'flex';
  clone.style.zIndex = '9500'; // Asegurarnos de que estÃ© por encima de todo
  
  // Establecer posiciÃ³n inicial para evitar saltos
  clone.style.left = (e.clientX - 37) + 'px';
  clone.style.top = (e.clientY - 37) + 'px';

  // Obtener el emoji para mostrarlo en el clon
  const emoji = foodItem.querySelector('.food-emoji');
  if (emoji) {
    const emojiClone = document.createElement('span');
    emojiClone.style.fontSize = '60px'; // MÃ¡s grande para mejor visibilidad
    emojiClone.textContent = emoji.textContent;
    emojiClone.style.filter = 'drop-shadow(0 10px 25px rgba(255, 183, 178, 0.9))';
    emojiClone.style.animation = 'wiggle 0.5s ease infinite alternate';
    // AÃ±adir un efecto de brillo
    emojiClone.style.position = 'relative';
    emojiClone.style.zIndex = '9999';
    clone.appendChild(emojiClone);
    
    // AÃ±adir un fondo de brillo para hacer el arrastre mÃ¡s visible
    const glow = document.createElement('div');
    glow.style.position = 'absolute';
    glow.style.width = '70px';
    glow.style.height = '70px';
    glow.style.borderRadius = '50%';
    glow.style.background = 'radial-gradient(circle, rgba(255,183,178,0.7) 0%, rgba(255,183,178,0.2) 70%)';
    glow.style.filter = 'blur(5px)';
    glow.style.zIndex = '9990';
    glow.style.top = '50%';
    glow.style.left = '50%';
    glow.style.transform = 'translate(-50%, -50%)';
    clone.appendChild(glow);
    
    // Agregar al body explÃ­citamente al final del DOM para estar por encima de todo
    document.body.appendChild(clone);
    
    // Forzar un repaint para asegurar que el clon se muestre
    clone.getBoundingClientRect();
  }

  // Crear un elemento invisible pequeÃ±o para la imagen de arrastre nativa
  // Esto oculta la imagen de arrastre predeterminada del navegador
  const invisibleDrag = document.createElement('div');
  invisibleDrag.style.width = '1px';
  invisibleDrag.style.height = '1px';
  invisibleDrag.style.position = 'absolute';
  invisibleDrag.style.top = '-9999px';
  invisibleDrag.style.opacity = '0';
  document.body.appendChild(invisibleDrag);
  
  try {
    e.dataTransfer.setDragImage(invisibleDrag, 0, 0);
  } catch (error) {
    console.error('Error al configurar imagen de arrastre:', error);
  }
  
  // Eliminar el elemento invisible despuÃ©s
  setTimeout(() => {
    if (document.body.contains(invisibleDrag)) {
      document.body.removeChild(invisibleDrag);
    }
  }, 100);

  // Configurar evento para mover el clon con el cursor
  document.addEventListener('dragover', moveFoodClone);

  // Avisar que se iniciÃ³ el arrastre
  console.log('Iniciando arrastre de comida:', foodId);
  
  // Hacer la zona muy visible mientras se arrastra
  if (petFeedZone) {
    petFeedZone.style.opacity = '1';
    petFeedZone.style.visibility = 'visible';
    petFeedZone.style.zIndex = '9000';
    petFeedZone.style.background = 'rgba(255, 183, 178, 0.3)';
    petFeedZone.style.border = '4px dashed rgba(255, 183, 178, 0.8)';
    petFeedZone.style.boxShadow = '0 0 30px rgba(255, 183, 178, 0.6)';
  }
} // Cierre de la funciÃ³n handleDragStart

// FunciÃ³n para mover el clon con el cursor
function moveFoodClone(e) {
  e.preventDefault(); // Prevenir comportamiento por defecto para facilitar el drop
  
  const clone = document.getElementById('food-drag-clone');
  if (clone) {
    // Actualizar la posiciÃ³n del clon para que siga al cursor
    // Restamos la mitad del tamaÃ±o del clon para centrarlo en el cursor
    requestAnimationFrame(() => {
      clone.style.left = (e.clientX - 37) + 'px';
      clone.style.top = (e.clientY - 37) + 'px';
      
      // Asegurarnos de que el clon sea visible
      if (clone.style.display !== 'flex') {
        clone.style.display = 'flex';
        clone.style.visibility = 'visible';
        clone.style.opacity = '0.95';
      }
    });
  }
  
  // Resaltar la zona de alimentaciÃ³n mientras se arrastra
  if (petFeedZone) {
    petFeedZone.style.opacity = '1';
    petFeedZone.style.visibility = 'visible';
    
    // Asegurarnos de que la zona estÃ© al frente si hay un overlay
    petFeedZone.style.zIndex = '2000'; 
    
    // Revisar si estamos sobre la zona de alimentaciÃ³n para destacarla mÃ¡s
    const rect = petFeedZone.getBoundingClientRect();
    const isOver = (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    );
    
    if (isOver) {
      petFeedZone.classList.add('drag-over');
      e.dataTransfer.dropEffect = 'move'; // Indicar que aquÃ­ se puede soltar
    } else {
      petFeedZone.classList.remove('drag-over');
    }
  }
}

function handleDragEnd(e) {
  if (draggingFood) {
    draggingFood.classList.remove('dragging');
    draggingFood = null;
  }
  
  // Eliminar el clon
  const clone = document.getElementById('food-drag-clone');
  if (clone) {
    document.body.removeChild(clone);
  }
  
  // Eliminar el evento de seguimiento del cursor
  document.removeEventListener('dragover', moveFoodClone);
}

// Configurar zona para alimentar mascota
// AÃ±adimos estilos para el sistema click-to-feed
const feedStyles = document.createElement('style');
feedStyles.textContent = `
  .food-item-clicked {
    animation: food-click-animation 0.5s forwards;
    opacity: 0;
  }
  @keyframes food-click-animation {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); }
    100% { transform: scale(0); opacity: 0; }
  }
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(feedStyles);

// Verificar si existe la zona de alimentaciÃ³n antes de asignar eventos
const petFeedZone = document.getElementById('pet-feed-zone');
if (petFeedZone) {
  petFeedZone.addEventListener('dragenter', (e) => {
  e.preventDefault();
  e.stopPropagation(); // Evitar que el evento se propague
  
  console.log("Dragenter en zona de alimentaciÃ³n");
  
  // Asegurar que la zona tenga el z-index correcto
  petFeedZone.style.zIndex = "9000";
  
  // Mostrar claramente la zona de alimentaciÃ³n
  petFeedZone.style.opacity = '1';
  petFeedZone.style.visibility = 'visible';
  
  // Animar ligeramente la mascota
  const petSvg = document.getElementById('pet-svg-game');
  if (petSvg) {
    petSvg.classList.add('excited');
  }
  
  if (e.dataTransfer.types.includes('text/plain')) {
    console.log("Tipo de datos correcto, aÃ±adiendo clase drag-over");
    petFeedZone.classList.add('drag-over');
    e.dataTransfer.dropEffect = 'move';
  }
});

petFeedZone.addEventListener('dragleave', (e) => {
  e.preventDefault();
  petFeedZone.classList.remove('drag-over');
  
  // Dejar de animar la mascota
  const petSvg = document.getElementById('pet-svg-game');
  if (petSvg) {
    petSvg.classList.remove('excited');
  }
});

petFeedZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation(); // Evitar que el evento se propague
  
  // Asegurarnos de que la zona sea visible
  petFeedZone.style.opacity = '1';
  petFeedZone.style.visibility = 'visible';
  
  // Asegurarnos de que el cursor muestre que se puede soltar
  if (e.dataTransfer.types && e.dataTransfer.types.includes('text/plain')) {
    e.dataTransfer.dropEffect = 'move';
    
    // Revisar si estamos sobre la zona de alimentaciÃ³n para destacarla mÃ¡s
    const rect = petFeedZone.getBoundingClientRect();
    const isOver = (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    );
    
    if (isOver) {
      petFeedZone.classList.add('drag-over');
    }
  }
});

petFeedZone.addEventListener('drop', async (e) => {
  e.preventDefault();
  e.stopPropagation(); // Detener propagaciÃ³n para evitar que otros elementos capturen el evento
  
  console.log("Â¡Comida soltada en la zona de alimentaciÃ³n!");
  console.log("Tipos de datos disponibles:", e.dataTransfer.types ? Array.from(e.dataTransfer.types) : []);
  
  // Intentar obtener el ID de comida de diferentes maneras - con mejor manejo de errores
  let foodId;
  let foundSource = "";
  
  // Estrategia 1: Intentar obtener especÃ­ficamente de text/food-id
  try {
    if (e.dataTransfer.types && e.dataTransfer.types.includes('text/food-id')) {
      foodId = e.dataTransfer.getData('text/food-id');
      foundSource = "text/food-id";
    }
  } catch (error) {
    console.error("Error al obtener text/food-id:", error);
  }
  
  // Estrategia 2: Probar con text/plain si aÃºn no tenemos ID
  if (!foodId) {
    try {
      foodId = e.dataTransfer.getData('text/plain');
      console.log("Datos transferidos (text/plain):", foodId);
      foundSource = "text/plain";
    } catch (error) {
      console.error("Error al obtener text/plain:", error);
    }
  }
  
  // Estrategia 3: Intentar con JSON
  if (!foodId) {
    try {
      const jsonData = e.dataTransfer.getData('application/json');
      if (jsonData) {
        const parsed = JSON.parse(jsonData);
        if (parsed && parsed.id) {
          foodId = parsed.id;
          foundSource = "application/json";
        }
      }
    } catch (error) {
      console.error("Error al parsear application/json:", error);
    }
  }
  
  // Estrategia 4: Usar el elemento que se estÃ¡ arrastrando como Ãºltimo recurso
  if (!foodId && draggingFood) {
    foodId = draggingFood.getAttribute('data-food-id') || draggingFood.dataset.draggingId;
    console.log("Usando ID desde draggingFood:", foodId);
    foundSource = "draggingFood element";
  }
  
  console.log(`ID de comida encontrado: ${foodId} (fuente: ${foundSource})`);
  
  // Si aÃºn no tenemos ID pero hay comidas disponibles, usamos la primera (como Ãºltimo recurso)
  if (!foodId && foodItems && foodItems.length > 0) {
    foodId = foodItems[0].id;
    console.log("Usando la primera comida disponible como Ãºltimo recurso:", foodId);
    foundSource = "default first food";
  }
  
  petFeedZone.classList.remove('drag-over');
  console.log("ID de comida recibida:", foodId);
  
  // Limpiar y normalizar el foodId
  let parsedFoodId;
  
  // Manejar diferentes formatos de ID
  if (typeof foodId === 'string') {
    // Eliminar cualquier carÃ¡cter extraÃ±o y espacios
    const cleanId = foodId.trim().replace(/[^a-zA-Z0-9]/g, '');
    // Intentar convertir a nÃºmero si es posible
    parsedFoodId = /^\d+$/.test(cleanId) ? parseInt(cleanId, 10) : cleanId;
  } else if (typeof foodId === 'number') {
    parsedFoodId = foodId;
  } else {
    // Si no es string ni nÃºmero, usamos un ID por defecto
    parsedFoodId = 1;
  }
  
  console.log("ID de comida normalizado:", parsedFoodId);
  console.log("NÃºmero de foodItems disponibles:", foodItems?.length || 0);
  
  // Buscar la comida de manera mÃ¡s flexible
  let food;
  if (foodItems && foodItems.length > 0) {
    // Primero intentar bÃºsqueda exacta por ID
    food = foodItems.find(f => {
      if (!f || !f.id) return false;
      
      // Comparar como strings para manejar diferentes tipos
      const foodItemId = String(f.id).trim();
      const targetId = String(parsedFoodId).trim();
      
      return foodItemId === targetId;
    });
    
    console.log("Â¿Se encontrÃ³ comida por ID exacto?", food ? "SÃ" : "NO");
    
    // Si no se encuentra, buscar de forma mÃ¡s flexible
    if (!food) {
      console.log("Intentando bÃºsqueda flexible...");
      // Intentar coincidencia parcial en nombre o ID si es string
      food = foodItems.find(f => {
        if (!f) return false;
        if (typeof parsedFoodId === 'string' && f.nombre && 
            f.nombre.toLowerCase().includes(parsedFoodId.toLowerCase())) {
          return true;
        }
        return false;
      });
    }
    
    // Si aÃºn no se encuentra, usar la primera como fallback
    if (!food) {
      console.log("No se encontrÃ³ comida especÃ­fica, usando la primera disponible");
      food = foodItems[0];
    }
  }
  
  // Si no hay foodItems o no se encontrÃ³ ninguna comida, crear una de respaldo
  if (!food) {
    console.log("Creando comida de respaldo");
    food = {
      id: parsedFoodId || 1,
      nombre: "Comida de respaldo",
      tipo: "comida",
      efectos: { hambre: 15 }
    };
  }
  
  if (food) {
    console.log("Comida encontrada:", food.nombre, "con ID:", food.id);
    // AnimaciÃ³n de la comida siendo "comida" por la mascota
    const clone = document.getElementById('food-drag-clone');
    if (clone) {
      // Crear un destello visual para indicar que la comida fue aceptada
      const flash = document.createElement('div');
      flash.style.position = 'fixed';
      flash.style.zIndex = '9999'; // Aumentado para estar por encima de todo
      flash.style.width = '150px'; // MÃ¡s grande para mejor visibilidad
      flash.style.height = '150px';
      flash.style.borderRadius = '50%';
      flash.style.background = 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,183,178,0.7) 60%, transparent 100%)';
      flash.style.transform = 'translate(-50%, -50%)';
      flash.style.left = e.clientX + 'px';
      flash.style.top = e.clientY + 'px';
      flash.style.animation = 'flash-effect 0.8s ease-out forwards'; // Ligeramente mÃ¡s lenta
      document.body.appendChild(flash);
      
      // Definir la animaciÃ³n del destello
      const flashAnimation = document.createElement('style');
      flashAnimation.textContent = `
        @keyframes flash-effect {
          0% { transform: translate(-50%, -50%) scale(0.2); opacity: 0.1; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.7; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
      `;
      document.head.appendChild(flashAnimation);
      
      setTimeout(() => {
        if (document.body.contains(flash)) {
          document.body.removeChild(flash);
        }
        if (document.head.contains(flashAnimation)) {
          document.head.removeChild(flashAnimation);
        }
      }, 600);
      
      // Mover el clon al centro de la mascota con animaciÃ³n
      const petSvg = document.getElementById('pet-svg-game');
      const petRect = petSvg.getBoundingClientRect();
      const petCenterX = petRect.left + petRect.width / 2;
      const petCenterY = petRect.top + petRect.height / 2;
      
      // Aseguramos que el clon estÃ© visible
      clone.style.display = 'flex';
      clone.style.visibility = 'visible';
      clone.style.opacity = '1';
      clone.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      clone.style.left = (petCenterX - 37) + 'px';
      clone.style.top = (petCenterY - 37) + 'px';
      clone.style.transform = 'scale(0.1)';
      clone.style.opacity = '0';
      
      setTimeout(() => {
        if (document.body.contains(clone)) {
          document.body.removeChild(clone);
        }
      }, 500);
    }
    
    // AnimaciÃ³n de la mascota comiendo
    const petSvg = document.getElementById('pet-svg-game');
    petSvg.classList.add('eating');
    
    // Remover la clase despuÃ©s de que termine la animaciÃ³n
    setTimeout(() => {
      petSvg.classList.remove('eating');
      // Forzar una actualizaciÃ³n de las barras despuÃ©s de la animaciÃ³n
      obtenerEstadoActualizado();
    }, 1000);

    try {
      console.log(`Enviando solicitud de alimentaciÃ³n con comida:`, food);
      
      // DepuraciÃ³n avanzada
      console.log("Detalles de la comida que se enviarÃ¡:");
      console.log("- ID:", food.id);
      console.log("- Nombre:", food.nombre);
      console.log("- Tipo:", food.tipo);
      console.log("- Efectos:", JSON.stringify(food.efectos));
      
      // Registrar el estado del token antes de hacer la peticiÃ³n
      const token = localStorage.getItem('token');
      console.log("Token utilizado:", token ? `${token.substring(0, 15)}...` : "No hay token");
      
      // Crear payload para la solicitud
      const payload = { foodId: food.id };
      console.log("Payload de la solicitud:", JSON.stringify(payload));
      
      // Realizar la peticiÃ³n con seguimiento detallado
      console.log(`Enviando POST a ${API_BASE}/mis-mascotas/mi-mascota/alimentar`);
      
      const response = await authFetch(`${API_BASE}/mis-mascotas/mi-mascota/alimentar`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Respuesta del servidor:", response.status);
      console.log("URL de la solicitud:", `${API_BASE}/mis-mascotas/mi-mascota/alimentar`);
      
      if (response.ok) {
        const result = await response.json();
        console.log("Datos recibidos:", result);
        
        // Verificar si la respuesta incluye la mascota completa
        if (result.mascota) {
          console.log("Mascota recibida en la respuesta:", result.mascota);
          // Actualizar el estado global con la mascota completa
          estadoMascota = result.mascota;
        } else {
          // Si no hay objeto mascota, obtener el estado actualizado explÃ­citamente
          console.log("La respuesta no incluye objeto mascota, obteniendo estado actualizado...");
          await obtenerEstadoActualizado();
        }
        
        console.log("Estado actualizado de la mascota:", estadoMascota);
        
        // Forzar la actualizaciÃ³n de las barras inmediatamente
        if (estadoMascota && typeof estadoMascota.hambre === 'number') {
          console.log("Actualizando hambre a:", estadoMascota.hambre);
          
          // Actualizar visualmente la barra de hambre de inmediato
          const barComida = document.getElementById('bar-comida');
          const valComida = document.getElementById('val-comida');
          if (barComida && valComida) {
            const hambre = estadoMascota.hambre;
            // ActualizaciÃ³n directa sin reset que puede causar problemas
            barComida.style.transition = 'width 0.5s ease-in-out';
            barComida.style.width = hambre + '%';
            valComida.textContent = Math.round(hambre);
            console.log("Barra de hambre actualizada visualmente a:", hambre + "%");
          }
        }
        
        // Obtener explÃ­citamente el estado actualizado desde el servidor
        await obtenerEstadoActualizado();
        
        // Forzar una actualizaciÃ³n visual inmediata de las barras
        actualizarBarras();
        spawnParticles('feed', '#FF9AA2');
        updateActionArcs();
        
        // Programar mÃºltiples actualizaciones para asegurar que los cambios se muestren
        setTimeout(async () => {
          await obtenerEstadoActualizado();
          actualizarBarras();
          console.log("Primera actualizaciÃ³n programada completada");
        }, 500);
        
        setTimeout(async () => {
          await obtenerEstadoActualizado();
          actualizarBarras();
          console.log("Segunda actualizaciÃ³n programada completada");
        }, 2000);
        
        // Mostrar mensaje de Ã©xito
        mostrarMensaje(result.mensaje || "Â¡Mascota alimentada con Ã©xito!");
      } else if (response.status === 404) {
        console.warn('No se encontrÃ³ la mascota activa');
        mostrarMensaje("No se encontrÃ³ la mascota", "error");
        // Redirigir a la vista de selecciÃ³n de mascota
        document.getElementById('background').classList.add('hidden');
        document.getElementById('select-pet-view').classList.remove('hidden');
      } else {
        // Procesar otros errores
        const errorData = await response.json();
        console.error("Error del servidor:", errorData);
        mostrarMensaje(errorData.error || "Error al alimentar mascota", "error");
      }
    } catch (error) {
      console.error('Error al alimentar mascota:', error);
      mostrarMensaje("Error de conexiÃ³n al alimentar mascota", "error");
    }
  }
});

// Helper para asignar eventos solo si el botÃ³n existe
function safeAddEventListener(btn, event, handler) {
  if (btn) btn.addEventListener(event, handler);
}
const particlesContainer = document.getElementById('action-particles');

// Sonido pop deshabilitado por error de carga
const popSound = { play: () => {} };

// Estado de ejemplo (reemplaza por tu lÃ³gica real)
// Usa el objeto global estadoMascota si ya existe, si no, crea uno de ejemplo

// --- Feedback visual: arcos de progreso ---
function setProgressArc(btn, value, colorFrom, colorTo) {
  if (!btn) return;
  const arc = btn.querySelector('.progress-arc');
  if (!arc) return;
  const percent = Math.max(0, Math.min(1, value / 100));
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - percent);
  // Gradiente simple (no SVG gradient, solo colorTo si >50%)
  const color = percent < 0.5 ? colorFrom : colorTo;
  arc.innerHTML = `<svg><circle r="34" cx="38" cy="38" stroke="${color}" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${offset}"/></svg>`;
}

function updateActionArcs() {
  setProgressArc(btnFeed, estadoMascota.hambre, '#FF9AA2', '#6ee7b7');
  setProgressArc(btnBath, estadoMascota.limpieza, '#A0522D', '#A2D2FF');
  setProgressArc(btnPlay, estadoMascota.energia, '#FFD166', '#3b82f6');
  setProgressArc(btnSleep, 100 - estadoMascota.energia, '#FFD166', '#B399D4');
}

// --- Tooltips ---
function showTooltip(btn, text) {
  const tooltip = btn.querySelector('.tooltip');
  if (tooltip) {
    tooltip.textContent = text;
    btn.classList.add('show-tooltip');
  }
}
function hideTooltip(btn) {
  btn.classList.remove('show-tooltip');
}

// --- PartÃ­culas temÃ¡ticas ---
function spawnParticles(type, color) {
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.background = color;
    p.style.left = (50 + 30 * Math.cos((i / 8) * 2 * Math.PI)) + '%';
    p.style.top = (50 + 30 * Math.sin((i / 8) * 2 * Math.PI)) + '%';
    particlesContainer.appendChild(p);
    setTimeout(() => p.remove(), 700);
  }
}

// --- Feedback y lÃ³gica de botones ---
safeAddEventListener(btnFeed, 'click', () => {
  popSound.currentTime = 0; popSound.play();
  spawnParticles('feed', '#FF9AA2');
  doAction('alimentar');
  updateActionArcs();
  updateActionStates();
});
safeAddEventListener(btnBath, 'click', () => {
  popSound.currentTime = 0; popSound.play();
  spawnParticles('bath', '#A2D2FF');
  doAction('banar');
  updateActionArcs();
  updateActionStates();
});
safeAddEventListener(btnPlay, 'click', () => {
  popSound.currentTime = 0; popSound.play();
  spawnParticles('play', '#FFD166');
  doAction('jugar');
  updateActionArcs();
  updateActionStates();
});
safeAddEventListener(btnSleep, 'click', () => {
  popSound.currentTime = 0; popSound.play();
  spawnParticles('sleep', '#B399D4');
  doAction('dormir');
  updateActionArcs();
  updateActionStates();
});

// Tooltips al mantener presionado
// Tooltips solo si el botÃ³n existe
[btnFeed, btnBath, btnPlay, btnSleep].forEach(btn => {
  if (!btn) return;
  let pressTimer;
  btn.addEventListener('mousedown', () => {
    pressTimer = setTimeout(() => {
      let msg = btn.title;
      if (btn === btnPlay && estadoMascota.energia < 30) msg = 'Â¡Necesita mÃ¡s energÃ­a para jugar!';
      if (btn === btnSleep && estadoMascota.energia > 70) msg = 'Â¡No tiene sueÃ±o!';
      showTooltip(btn, msg);
    }, 400);
  });
  btn.addEventListener('mouseup', () => { clearTimeout(pressTimer); hideTooltip(btn); });
  btn.addEventListener('mouseleave', () => { clearTimeout(pressTimer); hideTooltip(btn); });
});

// Estado inactivo segÃºn lÃ³gica
function updateActionStates() {
  if (btnPlay) btnPlay.disabled = estadoMascota.energia < 30;
  if (btnSleep) btnSleep.disabled = estadoMascota.energia > 70;
}

// Inicializar menÃº
function initActionsMenu() {
  updateActionArcs();
  updateActionStates();
}

window.addEventListener('DOMContentLoaded', initActionsMenu);
// Escenarios y sus iconos
const SCENES = [
  { name: 'home', icon: 'ðŸ ', btn: 'menu-home', div: 'scene-home' },
  { name: 'park', icon: 'ðŸŒ³', btn: 'menu-park', div: 'scene-park' },
  { name: 'kitchen', icon: 'ðŸ½ï¸', btn: 'menu-kitchen', div: 'scene-kitchen' },
  { name: 'bath', icon: 'ðŸ›', btn: 'menu-bath', div: 'scene-bath' },
  { name: 'bed', icon: 'ðŸ›ï¸', btn: 'menu-bed', div: 'scene-bed' }
];

function setScene(sceneName) {
  // Cambia la clase del fondo
  const bg = document.getElementById('background');
  SCENES.forEach(s => bg.classList.remove('room-' + s.name));
  bg.classList.add('room-' + sceneName);
  // Cambia el indicador
  const scene = SCENES.find(s => s.name === sceneName);
  document.getElementById('scene-icon').textContent = scene ? scene.icon : '';
  // Muestra solo los elementos del escenario activo
  SCENES.forEach(s => {
    const el = document.querySelector('.' + s.div);
    if (el) el.classList.remove('scene-active');
  });
  const activeDiv = document.querySelector('.scene-' + sceneName);
  if (activeDiv) activeDiv.classList.add('scene-active');

  // Mostrar el botÃ³n flotante solo en la cocina
  const foodPanelToggle = document.getElementById('food-panel-toggle');
  const dashboardOverlay = document.getElementById('dashboard-overlay');
  
  if (foodPanelToggle) {
    if (sceneName === 'kitchen') {
      foodPanelToggle.style.display = 'flex';
      // Asegurar que el botÃ³n sea visible
      foodPanelToggle.style.visibility = 'visible';
      foodPanelToggle.style.opacity = '1';
      
      // Renderizar el panel de comida si estamos en la cocina
      if (typeof renderFoodDashboard === 'function') {
        renderFoodDashboard();
      }
    } else {
      foodPanelToggle.style.display = 'none';
      if (foodPanel) {
        foodPanel.classList.remove('visible');
        dashboardOverlay.classList.remove('visible');
        if (foodPanelToggle) {
          foodPanelToggle.classList.remove('active');
        }
      }
    }
  }
}

// MenÃº: listeners para cambiar de escenario
window.addEventListener('DOMContentLoaded', () => {
  SCENES.forEach(s => {
    const btn = document.getElementById(s.btn);
    if (btn) {
      btn.onclick = () => {
        setScene(s.name);
        // Si es el botÃ³n de dormir, ejecutar la acciÃ³n
        if (s.name === 'bed') {
          doAction('dormir');
        }
      };
    }
  });
  // Reloj digital en casa
  function updateClock() {
    const clock = document.getElementById('clock');
    if (clock) {
      const now = new Date();
      clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }
  setInterval(updateClock, 1000);
  updateClock();
});

// ...el resto de tu cÃ³digo...

// Mascotas reales desde backend
let mascotas = [];
let currentPet = 0;

async function cargarMascotasDisponibles() {
  try {
    // Usar endpoint público que no requiere autenticación
    const res = await fetch(`${API_BASE}/mascotas/disponibles`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      mascotas = data;
      currentPet = 0;
      renderPetCarousel();
    } else {
      document.getElementById('pet-svg-container').innerHTML = '<p>No hay mascotas disponibles.</p>';
      document.getElementById('pet-name').textContent = '';
      document.getElementById('pet-desc').textContent = '';
    }
  } catch (err) {
    console.error('Error cargando mascotas:', err);
    document.getElementById('pet-svg-container').innerHTML = '<p>Error al cargar mascotas.</p>';
    document.getElementById('pet-name').textContent = '';
    document.getElementById('pet-desc').textContent = '';
  }
}

function renderPetCarousel() {
  if (!mascotas.length) {
    document.getElementById('pet-svg-container').innerHTML = '<p>No hay mascotas disponibles.</p>';
    document.getElementById('pet-name').textContent = '';
    document.getElementById('pet-desc').textContent = '';
    return;
  }
  // Si tienes un campo SVG en la mascota, Ãºsalo. Si no, pon una imagen por defecto o el nombre.
  const svg = mascotas[currentPet].svg || `<div style=\"font-size:2em;\">ðŸ¾</div>`;
  document.getElementById('pet-svg-container').innerHTML = svg;
  document.getElementById('pet-name').textContent = mascotas[currentPet].nombre;
  document.getElementById('pet-desc').textContent = mascotas[currentPet].desc || '';
}

document.getElementById('prev-pet').onclick = () => {
  if (!mascotas.length) return;
  currentPet = (currentPet - 1 + mascotas.length) % mascotas.length;
  renderPetCarousel();
};
document.getElementById('next-pet').onclick = () => {
  if (!mascotas.length) return;
  currentPet = (currentPet + 1) % mascotas.length;
  renderPetCarousel();
};

document.getElementById('select-pet-btn').onclick = async () => {
  if (!mascotas.length) return;
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Debes iniciar sesiÃ³n para adoptar una mascota.');
    return;
  }
  const petId = mascotas[currentPet].id;
  try {
    const res = await authFetch(`${API_BASE}/mis-mascotas/adoptar/${petId}`, { method: 'POST' });
    const data = await res.json();
    if (res.ok) {
      // Guardar el ID de la mascota actual
      localStorage.setItem('currentPetId', petId);
      
      document.getElementById('select-pet-view').classList.add('hidden');
      document.getElementById('background').classList.remove('hidden');
      // Renderiza el SVG de la mascota en el juego
      const petSvgGame = document.getElementById('pet-svg-game');
      petSvgGame.innerHTML = mascotas[currentPet].svg || '<div style="font-size:2em;">ðŸ¾</div>';
      setTimeout(() => animarParpadeo(), 500);
      // Iniciar la actualizaciÃ³n periÃ³dica del estado
      iniciarActualizacionEstado();
      alert('Â¡Mascota adoptada con Ã©xito!');
    } else {
      alert(data.error || 'No se pudo adoptar la mascota.');
    }
  } catch (err) {
    alert('Error de conexiÃ³n con el servidor.');
  }
};

// Cargar mascotas reales al mostrar la vista de selecciÃ³n
// AsegÃºrate de declarar selectPetView solo una vez y antes de usarla
const selectPetView = document.getElementById('select-pet-view');
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (!selectPetView.classList.contains('hidden')) {
      cargarMascotasDisponibles();
    }
  });
});
observer.observe(selectPetView, { attributes: true, attributeFilter: ['class'] });

// Utilidad para hacer fetch autenticado con Bearer token
function authFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = options.headers || {};
  
  if (!token) {
    console.warn('authFetch: No hay token disponible');
    // Redirigir al login si no hay token
    setTimeout(() => {
      if (document.getElementById('login-view').classList.contains('hidden')) {
        alert('Tu sesiÃ³n ha expirado. Por favor, inicia sesiÃ³n nuevamente.');
        document.getElementById('welcome-view').classList.remove('hidden');
        document.getElementById('background').classList.add('hidden');
        document.getElementById('select-pet-view').classList.add('hidden');
        document.getElementById('login-view').classList.remove('hidden');
        document.getElementById('register-view').classList.add('hidden');
      }
    }, 500);
  } else {
    console.log('authFetch: Usando token', token.substring(0, 15) + '...');
    // Es necesario aÃ±adir el prefijo 'Bearer ' porque el middleware lo espera
    headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }
  
  // Asegurarse que siempre enviamos JSON
  if (!headers['Content-Type'] && options.body && typeof options.body === 'string') {
    try {
      JSON.parse(options.body);
      headers['Content-Type'] = 'application/json';
    } catch (e) {
      // No es JSON, no hacemos nada
    }
  }
  
  return fetch(url, { ...options, headers })
    .then(response => {
      // Si recibimos un 401 Unauthorized, el token no es vÃ¡lido
      if (response.status === 401) {
        console.warn('Token invÃ¡lido o expirado, redirigiendo al login');
        localStorage.removeItem('token'); // Eliminamos el token invÃ¡lido
        
        // Solo mostrar alerta si no estamos ya en la vista de login
        if (document.getElementById('login-view').classList.contains('hidden')) {
          alert('Tu sesiÃ³n ha expirado. Por favor, inicia sesiÃ³n nuevamente.');
          document.getElementById('welcome-view').classList.remove('hidden');
          document.getElementById('background').classList.add('hidden');
          document.getElementById('select-pet-view').classList.add('hidden');
          document.getElementById('login-view').classList.remove('hidden');
          document.getElementById('register-view').classList.add('hidden');
        }
      }
      return response;
    });
}

// Hacer disponible la funciÃ³n authFetch para scripts de debug
window.authFetch = authFetch;

// Render inicial
if (document.getElementById('pet-svg-container')) renderPetCarousel();



// FunciÃ³n para obtener el estado actualizado del servidor
async function obtenerEstadoActualizado() {
  try {
    // Obtenemos directamente la mascota actual del usuario, sin necesidad del ID
    // Esta es la ruta correcta que devuelve toda la informaciÃ³n actualizada
    const response = await authFetch(`${API_BASE}/mis-mascotas/mi-mascota`);
    
    if (response.ok) {
      const mascota = await response.json();
      // Guardar el ID de la mascota si no estaba guardado
      if (!localStorage.getItem('currentPetId') && mascota.id) {
        localStorage.setItem('currentPetId', mascota.id);
      }
      
      // Actualizar el estado global con todos los datos de la mascota
      estadoMascota = mascota;
      window.estadoMascota = estadoMascota; // Sincronizar con window.estadoMascota para debug
      console.log('Estado actualizado:', estadoMascota);
      actualizarBarras();
    } else if (response.status === 404) {
      console.warn('No se encontrÃ³ la mascota activa');
      detenerActualizacionEstado();
      document.getElementById('background').classList.add('hidden');
      document.getElementById('select-pet-view').classList.remove('hidden');
    }
  } catch (error) {
    console.error('Error al obtener estado:', error);
  }
}

// Actualiza las barras de estado visualmente y el menÃº circular
function actualizarBarras() {
  console.log('Actualizando barras con estado:', estadoMascota);
  
  // Verificar si el estadoMascota es vÃ¡lido
  if (!estadoMascota) {
    console.error('ERROR: estadoMascota es null o undefined');
    return;
  }

  // Verificar si las barras existen, si no, crearlas
  let statsContainer = document.getElementById('stats-container');
  if (!statsContainer) {
    console.log('🏗️ Creando barras de estado porque no existen...');
    
    // Crear el contenedor principal
    statsContainer = document.createElement('div');
    statsContainer.id = 'stats-container';
    statsContainer.className = 'visible'; // Hacerlas visibles inmediatamente
    
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
      <div class="stat-health">
        <div class="stat-bar-label">Salud <span>100</span></div>
        <div class="stat-bar">
          <div class="stat-bar-fill" style="width: 100%"></div>
        </div>
      </div>
    `;
    
    // Añadir al body
    document.body.appendChild(statsContainer);
    console.log('✅ Barras de estado creadas y añadidas al DOM');
  }

  // Registrar los valores originales para depuraciÃ³n
  console.log('Valores originales:', {
    salud: estadoMascota.salud, 
    limpieza: estadoMascota.limpieza,
    hambre: estadoMascota.hambre,
    energia: estadoMascota.energia,
    felicidad: estadoMascota.felicidad
  });
  
  // Asegurarse de que ningÃºn valor exceda 100 y que los valores sean vÃ¡lidos
  const salud = Math.max(0, Math.min(Number(estadoMascota.salud) || 0, 100));
  const limpieza = Math.max(0, Math.min(Number(estadoMascota.limpieza) || 0, 100));
  const hambre = Math.max(0, Math.min(Number(estadoMascota.hambre) || 0, 100));
  const energia = Math.max(0, Math.min(Number(estadoMascota.energia) || 0, 100));
  const felicidad = Math.max(0, Math.min(Number(estadoMascota.felicidad) || 0, 100));

  console.log(`Estado procesado - Salud: ${salud}, Limpieza: ${limpieza}, Hambre: ${hambre}, EnergÃ­a: ${energia}, Felicidad: ${felicidad}`);

  // FunciÃ³n para determinar el nivel segÃºn el porcentaje
  function determinarNivel(porcentaje) {
    if (porcentaje < 33) return 'low';
    if (porcentaje < 66) return 'medium';
    return 'high';
  }
  
  // Salud
  const barSalud = document.getElementById('bar-salud');
  const valSalud = document.getElementById('val-salud');
  if (barSalud && valSalud) {
    barSalud.style.width = salud + '%';
    valSalud.textContent = Math.round(salud);
    barSalud.setAttribute('data-type', 'salud');
    barSalud.setAttribute('data-value', determinarNivel(salud));
    console.log('Barra de salud actualizada:', salud + '%');
  }

  // Limpieza (barra extra de salud)
  const barLimpieza = document.getElementById('bar-salud-extra');
  const valLimpieza = document.getElementById('val-salud-extra');
  if (barLimpieza && valLimpieza) {
    barLimpieza.style.width = limpieza + '%';
    valLimpieza.textContent = Math.round(limpieza);
    barLimpieza.setAttribute('data-type', 'limpieza');
    barLimpieza.setAttribute('data-value', determinarNivel(limpieza));
  }

  // Hambre (directo, 100 = lleno, 1 = hambriento)
  const barComida = document.getElementById('bar-comida');
  const valComida = document.getElementById('val-comida');
  if (barComida && valComida) {
    console.log('Actualizando barra de comida:', hambre);
    
    // Forzar actualizaciÃ³n del DOM de manera mÃ¡s agresiva
    barComida.style.transition = 'none'; // Quitar transiciÃ³n temporalmente
    
    // Truco para forzar un repintado completo
    barComida.style.display = 'none';
    barComida.offsetHeight; // Esto fuerza un reflow
    barComida.style.display = 'block';
    
    // Aplicar el valor real
    requestAnimationFrame(() => {
      barComida.style.transition = 'width 0.5s ease-in-out';
      barComida.style.width = hambre + '%';
      valComida.textContent = Math.round(hambre);
    });
    
    barComida.setAttribute('data-type', 'hambre');  // Corregido de 'energia' a 'hambre'
    barComida.setAttribute('data-value', determinarNivel(hambre));
    console.log('Estilo de width aplicado:', barComida.style.width);
  }

  // EnergÃ­a
  const barEnergia = document.getElementById('bar-energia');
  const valEnergia = document.getElementById('val-energia');
  if (barEnergia && valEnergia) {
    barEnergia.style.width = energia + '%';
    valEnergia.textContent = Math.round(energia);
    barEnergia.setAttribute('data-type', 'energia');
    barEnergia.setAttribute('data-value', determinarNivel(energia));
  }

  // Felicidad
  const barFelicidad = document.getElementById('bar-felicidad');
  const valFelicidad = document.getElementById('val-felicidad');
  if (barFelicidad && valFelicidad) {
    barFelicidad.style.width = felicidad + '%';
    valFelicidad.textContent = Math.round(felicidad);
    barFelicidad.setAttribute('data-type', 'felicidad');
    barFelicidad.setAttribute('data-value', determinarNivel(felicidad));
  }

  updateActionArcs();
  updateActionStates();
}

// Variable para guardar el ID del intervalo
let estadoInterval = null;

// FunciÃ³n para iniciar la actualizaciÃ³n periÃ³dica
function iniciarActualizacionEstado() {
  // Detener el intervalo anterior si existe
  if (estadoInterval) {
    clearInterval(estadoInterval);
  }
  // Iniciar nuevo intervalo
  obtenerEstadoActualizado(); // Actualizar inmediatamente
  estadoInterval = setInterval(obtenerEstadoActualizado, 5000);
}

// FunciÃ³n para detener la actualizaciÃ³n periÃ³dica
function detenerActualizacionEstado() {
  if (estadoInterval) {
    clearInterval(estadoInterval);
    estadoInterval = null;
  }
}

// AnimaciÃ³n de nubes para transiciÃ³n de escenario
function transicionNubes(nuevoEscenario, callback) {
  const clouds = document.getElementById('clouds-overlay');
  clouds.classList.remove('hidden');
  clouds.classList.add('active');
  setTimeout(() => {
    document.getElementById('background').className = 'room-' + nuevoEscenario;
    if (callback) callback();
    setTimeout(() => {
      clouds.classList.remove('active');
      setTimeout(() => clouds.classList.add('hidden'), 1000);
    }, 1000);
  }, 1000);
}

// Acciones de la mascota
function doAction(accion) {
  switch (accion) {
    case 'alimentar':
      transicionNubes('kitchen', async () => {
        try {
          const res = await authFetch(`${API_BASE}/mis-mascotas/mi-mascota/alimentar`, { method: 'POST' });
          const data = await res.json();
          console.log(data.mensaje);
          await obtenerEstadoActualizado();
        } catch (err) {
          console.error('Error al alimentar:', err);
        }
      });
      break;
    case 'banar':
      transicionNubes('bath', async () => {
        try {
          const res = await authFetch(`${API_BASE}/mis-mascotas/mi-mascota/banar`, { method: 'POST' });
          const data = await res.json();
          console.log(data.mensaje);
          await obtenerEstadoActualizado();
        } catch (err) {
          console.error('Error al baÃ±ar:', err);
        }
      });
      break;
    case 'jugar':
      transicionNubes('park', async () => {
        try {
          const res = await authFetch(`${API_BASE}/mis-mascotas/mi-mascota/jugar`, { method: 'POST' });
          const data = await res.json();
          console.log(data.mensaje);
          await obtenerEstadoActualizado();
        } catch (err) {
          console.error('Error al jugar:', err);
        }
      });
      break;
    case 'dormir':
      transicionNubes('bed', async () => {
        try {
          const res = await authFetch(`${API_BASE}/mis-mascotas/mi-mascota/dormir`, { method: 'POST' });
          const data = await res.json();
          console.log(data.mensaje);
          await obtenerEstadoActualizado();
        } catch (err) {
          console.error('Error al dormir:', err);
        }
      });
      break;
  }
}

// AnimaciÃ³n de parpadeo de la mascota (simulaciÃ³n)
function animarParpadeo() {
  const petSvgGame = document.getElementById('pet-svg-game');
  if (!petSvgGame) return;
  const svg = petSvgGame.querySelector('svg');
  if (!svg) return;
  setInterval(() => {
    svg.style.filter = 'brightness(0.7)';
    setTimeout(() => {
      svg.style.filter = '';
    }, 120);
  }, 3500 + Math.random() * 2000);
}

// InicializaciÃ³n - Reorganizamos para evitar conflictos
document.addEventListener('DOMContentLoaded', function() {
  // Ya que esto se llama despuÃ©s del primer DOMContentLoaded, aseguremos que no cause conflictos
  setTimeout(() => {
    actualizarBarras();
    animarParpadeo();
  }, 100);

  // LÃ³gica de navegaciÃ³n entre vistas
  const welcomeView = document.getElementById('welcome-view');
  // selectPetView ya estÃ¡ declarada arriba
  const backgroundView = document.getElementById('background');
  const registerView = document.getElementById('register-view');
  const loginView = document.getElementById('login-view');

  // Al cargar la pÃ¡gina, si hay token, verificar si ya tiene mascota y saltar el carrusel
  const token = localStorage.getItem('token');
  if (token) {
    authFetch(`${API_BASE}/mis-mascotas/mi-mascota`).then(async res => {
      if (res.ok) {
        const mascota = await res.json();
        // Guardar el ID de la mascota actual
        localStorage.setItem('currentPetId', mascota.id);
        
        welcomeView.classList.add('hidden');
        backgroundView.classList.remove('hidden');
        selectPetView.classList.add('hidden');
        registerView.classList.add('hidden');
        loginView.classList.add('hidden');
        // Renderiza el SVG de la mascota
        const petSvgGame = document.getElementById('pet-svg-game');
        petSvgGame.innerHTML = mascota.svg || '<div style="font-size:2em;">ðŸ¾</div>';
        setTimeout(() => animarParpadeo(), 500);
        // Iniciar la actualizaciÃ³n periÃ³dica del estado
        iniciarActualizacionEstado();
      }
    });
  }

  // Botones de bienvenida
  const btnRegister = document.getElementById('btn-register');
  const btnLogin = document.getElementById('btn-login');

  if (btnRegister) {
    btnRegister.onclick = () => {
      welcomeView.classList.add('hidden');
      registerView.classList.remove('hidden');
      loginView.classList.add('hidden');
      selectPetView.classList.add('hidden');
    };
  }
  if (btnLogin) {
    btnLogin.onclick = () => {
      welcomeView.classList.add('hidden');
      loginView.classList.remove('hidden');
      registerView.classList.add('hidden');
      selectPetView.classList.add('hidden');
    };
  }

  // Alternar entre login y registro
  document.getElementById('go-login').onclick = (e) => {
    e.preventDefault();
    registerView.classList.add('hidden');
    loginView.classList.remove('hidden');
  };
  document.getElementById('go-register').onclick = (e) => {
    e.preventDefault();
    loginView.classList.add('hidden');
    registerView.classList.remove('hidden');
  };

  // Volver a la bienvenida desde registro/login
  document.getElementById('back-to-welcome1').onclick = (e) => {
    e.preventDefault();
    registerView.classList.add('hidden');
    welcomeView.classList.remove('hidden');
  };
  document.getElementById('back-to-welcome2').onclick = (e) => {
    e.preventDefault();
    loginView.classList.add('hidden');
    welcomeView.classList.remove('hidden');
  };

  // BotÃ³n para volver a la bienvenida desde selecciÃ³n de mascota
  document.getElementById('back-to-welcome-pet').onclick = (e) => {
    e.preventDefault();
    selectPetView.classList.add('hidden');
    document.getElementById('welcome-view').classList.remove('hidden');
  };

  // Manejo de mensajes de validaciÃ³n (simulado, puedes conectar con tu backend luego)
  // Limpiar cualquier token existente al mostrar la pantalla de registro o login
  if (document.getElementById('welcome-view') && !document.getElementById('welcome-view').classList.contains('hidden')) {
    localStorage.removeItem('token');
    console.log('Token eliminado al mostrar la pantalla de bienvenida');
  }

  const registerForm = document.getElementById('register-form');
  const registerMessage = document.getElementById('register-message');
  registerForm.onsubmit = async (e) => {
    e.preventDefault();
    registerMessage.textContent = '';
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;
    
    // ValidaciÃ³n bÃ¡sica
    if (!username || username.length < 3) {
      registerMessage.textContent = 'El nombre de usuario debe tener al menos 3 caracteres';
      registerMessage.style.color = 'red';
      return;
    }
    
    if (!password || password.length < 6) {
      registerMessage.textContent = 'La contraseÃ±a debe tener al menos 6 caracteres';
      registerMessage.style.color = 'red';
      return;
    }
    
    console.log('Intentando registrar usuario:', username);
    
    try {
      console.log(`URL de registro: ${API_BASE}/auth/register`);
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      // Manejar respuesta que no es JSON
      const contentType = res.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await res.json();
          console.log('Respuesta del servidor (registro):', data);
        } catch (jsonError) {
          console.error('Error al procesar JSON de respuesta:', jsonError);
          registerMessage.textContent = 'Error en el formato de la respuesta del servidor';
          registerMessage.style.color = 'red';
          return;
        }
      } else {
        // Si no es JSON, obtener como texto
        const textResponse = await res.text();
        console.log('Respuesta no-JSON del servidor:', textResponse);
        data = { mensaje: textResponse };
      }
      
      if (res.status === 201) {
        registerMessage.textContent = 'Â¡Registro exitoso!';
        registerMessage.style.color = 'green';
        setTimeout(() => {
          registerView.classList.add('hidden');
          selectPetView.classList.remove('hidden');
        }, 1000);
      } else {
        registerMessage.textContent = data.error || 'Error en el registro';
        registerMessage.style.color = 'red';
        console.error('Error en registro:', data.error || 'Error desconocido');
      }
    } catch (err) {
      console.error('Error en la solicitud de registro:', err);
      registerMessage.textContent = 'Error de conexiÃ³n con el servidor';
      registerMessage.style.color = 'red';
    }
  };

  const loginForm = document.getElementById('login-form');
  const loginMessage = document.getElementById('login-message');
  loginForm.onsubmit = async (e) => {
    e.preventDefault();
    loginMessage.textContent = '';
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    
    // ValidaciÃ³n bÃ¡sica
    if (!username) {
      loginMessage.textContent = 'Por favor, ingresa tu nombre de usuario';
      loginMessage.style.color = 'red';
      return;
    }
    
    if (!password) {
      loginMessage.textContent = 'Por favor, ingresa tu contraseÃ±a';
      loginMessage.style.color = 'red';
      return;
    }
    
    console.log('Intentando iniciar sesiÃ³n con usuario:', username);
    
    try {
      loginMessage.textContent = 'Conectando...';
      loginMessage.style.color = 'blue';
      
      console.log(`URL de login: ${API_BASE}/auth/login`);
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      // Manejar respuesta que no es JSON
      const contentType = res.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await res.json();
          console.log('Respuesta del servidor (login):', data);
        } catch (jsonError) {
          console.error('Error al procesar JSON de respuesta:', jsonError);
          loginMessage.textContent = 'Error en el formato de la respuesta del servidor';
          loginMessage.style.color = 'red';
          return;
        }
      } else {
        // Si no es JSON, obtener como texto
        const textResponse = await res.text();
        console.log('Respuesta no-JSON del servidor:', textResponse);
        data = { error: 'Formato de respuesta no vÃ¡lido' };
      }
      
      if (res.ok && data && data.token) {
        loginMessage.textContent = 'Â¡Inicio de sesiÃ³n exitoso!';
        loginMessage.style.color = 'green';
        
        // Guarda el token en localStorage con el prefijo Bearer
        let tokenWithBearer;
        if (typeof data.token === 'string') {
          tokenWithBearer = data.token.startsWith('Bearer ') ? data.token : `Bearer ${data.token}`;
          localStorage.setItem('token', tokenWithBearer);
          console.log('Token guardado con Bearer:', tokenWithBearer.substring(0, 20) + '...');
          
          // Guardar en localStorage tambiÃ©n el ID de usuario si estÃ¡ disponible
          if (data.userId) {
            localStorage.setItem('userId', data.userId);
            console.log('ID de usuario guardado:', data.userId);
          }
        } else {
          console.error('Token recibido con formato incorrecto:', data.token);
          loginMessage.textContent = 'Error en el formato del token recibido';
          loginMessage.style.color = 'red';
          return;
        }
        
        // Verificar el token inmediatamente para confirmar que es vÃ¡lido
        console.log('Verificando token con el servidor...');
        
        // Al iniciar sesiÃ³n, verificar si ya tiene mascota
        try {
          // Asegurarnos que el welcome-view estÃ© oculto primero
          welcomeView.classList.add('hidden');
          
          // Intentar obtener la mascota del usuario
          console.log('Verificando mascota con token:', tokenWithBearer.substring(0, 20) + '...');
          const petRes = await fetch(`${API_BASE}/mis-mascotas/mi-mascota`, {
            headers: {
              'Authorization': tokenWithBearer
            }
          });
          console.log('Respuesta de verificaciÃ³n de mascota:', petRes.status, petRes.statusText);
          
          if (petRes.ok) {
            const mascota = await petRes.json();
            console.log('Mascota encontrada:', mascota);
            
            // Guardar ID de mascota para futuras operaciones
            if (mascota && mascota.id) {
              localStorage.setItem('currentPetId', mascota.id);
              console.log('ID de mascota guardado:', mascota.id);
            }
            
            // Ocultar todas las vistas excepto background
            loginView.classList.add('hidden');
            registerView.classList.add('hidden');
            selectPetView.classList.add('hidden');
            welcomeView.classList.add('hidden');
            backgroundView.classList.remove('hidden');
            
            // Renderiza el SVG de la mascota
            const petSvgGame = document.getElementById('pet-svg-game');
            if (petSvgGame) {
              petSvgGame.innerHTML = mascota.svg || '<div style="font-size:2em;">ðŸ¾</div>';
              setTimeout(() => {
                if (typeof animarParpadeo === 'function') {
                  animarParpadeo();
                }
              }, 500);
            } else {
              console.error('No se encontrÃ³ el elemento pet-svg-game para mostrar la mascota');
            }
          } else {
            console.log('No tiene mascota, redirigiendo a selecciÃ³n de mascota');
            // Ocultar todas las vistas excepto selectPetView
            loginView.classList.add('hidden');
            registerView.classList.add('hidden');
            welcomeView.classList.add('hidden');
            backgroundView.classList.add('hidden');
            selectPetView.classList.remove('hidden');
            
            // Mostrar un mensaje al usuario
            alert('Bienvenido. Por favor, selecciona una mascota virtual.');
          }
        } catch (error) {
          console.error('Error al verificar mascota:', error);
          // Si hay error al verificar la mascota, llevamos al usuario a seleccionar una
          loginView.classList.add('hidden');
          registerView.classList.add('hidden');
          welcomeView.classList.add('hidden');
          backgroundView.classList.add('hidden');
          selectPetView.classList.remove('hidden');
          
          alert('OcurriÃ³ un error al verificar tu mascota. Por favor, selecciona una mascota nueva.');
        }
      } else {
        loginMessage.textContent = data.error || 'Usuario o contraseÃ±a incorrectos';
        loginMessage.style.color = 'red';
        console.error('Error en login:', data.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      console.error('Error en la solicitud de login:', err);
      loginMessage.textContent = 'Error de conexiÃ³n con el servidor';
      loginMessage.style.color = 'red';
    }
  };

// FunciÃ³n para mostrar mensajes temporales al usuario
function mostrarMensaje(mensaje, tipo = 'success') {
  // Eliminar mensaje anterior si existe
  const mensajeExistente = document.getElementById('mensaje-temporal');
  if (mensajeExistente) {
    document.body.removeChild(mensajeExistente);
  }

  // Crear nuevo mensaje
  const mensajeDiv = document.createElement('div');
  mensajeDiv.id = 'mensaje-temporal';
  mensajeDiv.textContent = mensaje;
  mensajeDiv.style.position = 'fixed';
  mensajeDiv.style.top = '20px';
  mensajeDiv.style.left = '50%';
  mensajeDiv.style.transform = 'translateX(-50%)';
  mensajeDiv.style.padding = '10px 20px';
  mensajeDiv.style.borderRadius = '5px';
  mensajeDiv.style.zIndex = '9999';
  mensajeDiv.style.fontFamily = 'Arial, sans-serif';
  mensajeDiv.style.fontWeight = 'bold';
  mensajeDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';

  // Estilos segÃºn el tipo de mensaje
  if (tipo === 'error') {
    mensajeDiv.style.backgroundColor = '#ff5c5c';
    mensajeDiv.style.color = 'white';
  } else {
    mensajeDiv.style.backgroundColor = '#4CAF50';
    mensajeDiv.style.color = 'white';
  }

  // AÃ±adir mensaje al body
  document.body.appendChild(mensajeDiv);

  // AnimaciÃ³n de entrada
  mensajeDiv.style.opacity = '0';
  mensajeDiv.style.transition = 'opacity 0.3s ease-in-out';
  setTimeout(() => {
    mensajeDiv.style.opacity = '1';
  }, 10);

  // Desaparecer despuÃ©s de 3 segundos
  setTimeout(() => {
    mensajeDiv.style.opacity = '0';
    setTimeout(() => {
      if (document.body.contains(mensajeDiv)) {
        document.body.removeChild(mensajeDiv);
      }
    }, 300);
  }, 3000);
}

// Cerramos el bloque de DOMContentLoaded que reemplazÃ³ al window.onload
});
// }); // Cierre adicional comentado temporalmente

console.log('✅ main.js cargado completamente');
