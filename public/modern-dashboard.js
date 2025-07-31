// Dashboard Moderno de Mascotas
console.log('🎮 Cargando Dashboard Moderno de Mascotas...');

// Variables globales
let currentUser = null;
let myPets = [];
let availablePets = [];
let selectedPet = null;

// API Base URL
const API_BASE = window.location.hostname.includes('localhost')
  ? "http://localhost:3000"
  : "https://api-heroes-2lw9.onrender.com";

// Función para hacer peticiones autenticadas
async function authFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };
  
  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, finalOptions);
    
    // Si el token expiró, redirigir al login
    if (response.status === 401) {
      console.log('🔒 Token expirado, redirigiendo al login...');
      localStorage.removeItem('token');
      currentUser = null;
      showWelcome();
      return null;
    }
    
    return response;
  } catch (error) {
    console.error('Error en petición autenticada:', error);
    throw error;
  }
}

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 DOM cargado, inicializando dashboard...');
  initializeDashboard();
  
  // Función de prueba para verificar que los elementos existan
  setTimeout(() => {
    console.log('🔍 Verificando elementos:');
    console.log('- welcome-view:', document.getElementById('welcome-view') ? '✅' : '❌');
    console.log('- register-view:', document.getElementById('register-view') ? '✅' : '❌');
    console.log('- login-view:', document.getElementById('login-view') ? '✅' : '❌');
    console.log('- btn-register:', document.getElementById('btn-register') ? '✅' : '❌');
    console.log('- btn-login:', document.getElementById('btn-login') ? '✅' : '❌');
    console.log('- go-login:', document.getElementById('go-login') ? '✅' : '❌');
    console.log('- go-register:', document.getElementById('go-register') ? '✅' : '❌');
  }, 1000);
});

function initializeDashboard() {
  console.log('🚀 Inicializando Dashboard Moderno...');
  
  // Configurar event listeners
  setupEventListeners();
  
  // Event listener para redimensionar el carrusel
  window.addEventListener('resize', () => {
    if (availablePets.length > 0) {
      setTimeout(() => {
        initializeCarousel();
      }, 100);
    }
  });
  
  // Verificar si hay token válido
  const token = localStorage.getItem('token');
  if (token) {
    // Validar token con el servidor
    validateTokenAndShowDashboard();
  } else {
    // No hay sesión, mostrar bienvenida
    showWelcome();
  }
}

// Validar token con el servidor
async function validateTokenAndShowDashboard() {
  try {
    console.log('🔍 Validando token existente...');
    
    const response = await authFetch(`${API_BASE}/auth/validate`);
    
    if (response && response.ok) {
      const data = await response.json();
      currentUser = {
        username: data.username,
        role: data.role || 'user',
        id: data.userId
      };
      console.log('✅ Token válido, usuario:', currentUser.username);
      showDashboard();
    } else {
      console.log('❌ Token inválido o expirado');
      localStorage.removeItem('token');
      showWelcome();
    }
  } catch (error) {
    console.error('Error validando token:', error);
    localStorage.removeItem('token');
    showWelcome();
  }
}

function setupEventListeners() {
  console.log('🔧 Configurando event listeners...');
  
  // Usar delegación de eventos en el documento
  document.addEventListener('click', function(e) {
    const target = e.target;
    
    // Navegación desde la pantalla de bienvenida
    if (target.id === 'btn-register') {
      e.preventDefault();
      console.log('🔄 Clic en btn-register');
      showRegister();
      return;
    }
    
    if (target.id === 'btn-login') {
      e.preventDefault();
      console.log('🔄 Clic en btn-login');
      showLogin();
      return;
    }
    
    // Enlaces entre formularios
    if (target.id === 'go-login') {
      e.preventDefault();
      console.log('🔄 Clic en go-login');
      showLogin();
      return;
    }
    
    if (target.id === 'go-register') {
      e.preventDefault();
      console.log('🔄 Clic en go-register');
      showRegister();
      return;
    }
    
    // Enlaces para volver a la bienvenida
    if (target.id === 'back-to-welcome1' || target.id === 'back-to-welcome2') {
      e.preventDefault();
      console.log('🔄 Clic en volver a bienvenida');
      showWelcome();
      return;
    }
    
    // Botones del dashboard
    if (target.id === 'btn-new-pet') {
      e.preventDefault();
      toggleCreatePetForm();
      return;
    }
    
    if (target.id === 'btn-logout') {
      e.preventDefault();
      handleLogout();
      return;
    }
    
    if (target.id === 'btn-refresh-available') {
      e.preventDefault();
      loadAvailablePets();
      return;
    }
    
    if (target.id === 'btn-view-pet-status') {
      e.preventDefault();
      viewFirstPetStatus();
      return;
    }

    if (target.id === 'modal-close') {
      e.preventDefault();
      closeModal();
      return;
    }
  });
  
  // Event listeners para formularios (submit events)
  document.addEventListener('submit', function(e) {
    if (e.target.id === 'register-form') {
      handleRegister(e);
      return;
    }
    
    if (e.target.id === 'login-form') {
      handleLogin(e);
      return;
    }
    
    if (e.target.id === 'create-pet-form') {
      handleCreatePet(e);
      return;
    }
  });
  
  console.log('🔧 Event listeners configurados con delegación');
}

// ========== NAVEGACIÓN ENTRE VISTAS ==========
function showWelcome() {
  console.log('🏠 Mostrando vista de bienvenida');
  hideAllViews();
  document.getElementById('welcome-view').classList.remove('hidden');
}

function showRegister() {
  console.log('📝 Mostrando formulario de registro');
  hideAllViews();
  document.getElementById('register-view').classList.remove('hidden');
  // Limpiar mensajes anteriores
  document.getElementById('register-message').innerHTML = '';
}

function showLogin() {
  console.log('🔑 Mostrando formulario de login');
  hideAllViews();
  document.getElementById('login-view').classList.remove('hidden');
  // Limpiar mensajes anteriores
  document.getElementById('login-message').innerHTML = '';
}

function showDashboard() {
  console.log('📊 Mostrando dashboard');
  hideAllViews();
  document.getElementById('background').classList.remove('hidden');
  loadUserData();
}

function hideAllViews() {
  console.log('🔄 Ocultando todas las vistas');
  document.getElementById('welcome-view').classList.add('hidden');
  document.getElementById('register-view').classList.add('hidden');
  document.getElementById('login-view').classList.add('hidden');
  document.getElementById('background').classList.add('hidden');
}

// Función de prueba para verificar navegación
window.testNavigation = function() {
  console.log('🧪 Probando navegación...');
  
  console.log('Probando showRegister...');
  showRegister();
  
  setTimeout(() => {
    console.log('Probando showLogin...');
    showLogin();
    
    setTimeout(() => {
      console.log('Probando showWelcome...');
      showWelcome();
    }, 1000);
  }, 1000);
};

// Exponer funciones globalmente para testing
window.showWelcome = showWelcome;
window.showRegister = showRegister;
window.showLogin = showLogin;

// ========== AUTENTICACIÓN ==========
async function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('register-username').value.trim();
  const password = document.getElementById('register-password').value;
  const messageEl = document.getElementById('register-message');
  
  // Validaciones básicas
  if (!username || !password) {
    messageEl.innerHTML = '<div style="color: #ef4444;">❌ Por favor completa todos los campos</div>';
    return;
  }
  
  if (username.length < 3) {
    messageEl.innerHTML = '<div style="color: #ef4444;">❌ El nombre de usuario debe tener al menos 3 caracteres</div>';
    return;
  }
  
  if (password.length < 4) {
    messageEl.innerHTML = '<div style="color: #ef4444;">❌ La contraseña debe tener al menos 4 caracteres</div>';
    return;
  }
  
  // Cambiar botón para mostrar que está procesando
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '⏳ Registrando...';
  submitBtn.disabled = true;
  
  try {
    console.log('📝 Intentando registrar usuario:', username);
    
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    console.log('📝 Respuesta del servidor:', data);
    
    if (response.ok) {
      messageEl.innerHTML = '<div style="color: #10b981; padding: 10px; border-radius: 8px; background: rgba(16, 185, 129, 0.1);">✅ Cuenta creada exitosamente. Redirigiendo...</div>';
      
      // Limpiar formulario
      document.getElementById('register-form').reset();
      
      setTimeout(() => {
        showLogin();
        document.getElementById('login-username').value = username;
        document.getElementById('login-username').focus();
      }, 1500);
    } else {
      messageEl.innerHTML = `<div style="color: #ef4444; padding: 10px; border-radius: 8px; background: rgba(239, 68, 68, 0.1);">❌ ${data.error || 'Error en el registro'}</div>`;
    }
  } catch (error) {
    console.error('Error en registro:', error);
    messageEl.innerHTML = '<div style="color: #ef4444; padding: 10px; border-radius: 8px; background: rgba(239, 68, 68, 0.1);">❌ Error de conexión con el servidor</div>';
  } finally {
    // Restaurar botón
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const messageEl = document.getElementById('login-message');
  
  // Validaciones básicas
  if (!username || !password) {
    messageEl.innerHTML = '<div style="color: #ef4444;">❌ Por favor completa todos los campos</div>';
    return;
  }
  
  // Cambiar botón para mostrar que está procesando
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '⏳ Iniciando sesión...';
  submitBtn.disabled = true;
  
  try {
    console.log('🔑 Intentando login para usuario:', username);
    
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    console.log('🔑 Respuesta del servidor:', data);
    
    if (response.ok) {
      // Guardar token y datos del usuario
      localStorage.setItem('token', data.token);
      currentUser = { 
        username: data.username || username, 
        role: data.role || 'user',
        id: data.userId
      };
      
      messageEl.innerHTML = '<div style="color: #10b981; padding: 10px; border-radius: 8px; background: rgba(16, 185, 129, 0.1);">✅ Iniciando sesión...</div>';
      
      // Limpiar formulario
      document.getElementById('login-form').reset();
      
      setTimeout(() => {
        showDashboard();
      }, 1000);
    } else {
      messageEl.innerHTML = `<div style="color: #ef4444; padding: 10px; border-radius: 8px; background: rgba(239, 68, 68, 0.1);">❌ ${data.error || 'Credenciales incorrectas'}</div>`;
    }
  } catch (error) {
    console.error('Error en login:', error);
    messageEl.innerHTML = '<div style="color: #ef4444; padding: 10px; border-radius: 8px; background: rgba(239, 68, 68, 0.1);">❌ Error de conexión con el servidor</div>';
  } finally {
    // Restaurar botón
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('currentPetId');
  currentUser = null;
  myPets = [];
  availablePets = [];
  showWelcome();
}

// ========== CARGAR DATOS ==========
async function loadUserData() {
  try {
    // Actualizar mensaje de bienvenida
    const welcomeMsg = document.getElementById('welcome-message');
    if (currentUser) {
      welcomeMsg.textContent = `¡Bienvenido, ${currentUser.username}! Cuida de tus mascotas virtuales`;
    }
    
    // Cargar mascotas del usuario
    await loadMyPets();
    
    // Cargar mascotas disponibles
    await loadAvailablePets();
    
  } catch (error) {
    console.error('Error cargando datos del usuario:', error);
  }
}

async function loadMyPets() {
  try {
    console.log('🔍 Cargando mis mascotas...');
    const response = await authFetch(`${API_BASE}/mis-mascotas`);
    console.log('📡 Respuesta del servidor:', response.status);
    
    if (response.ok) {
      myPets = await response.json();
      console.log('✅ Mis mascotas cargadas:', myPets.length, myPets);
      renderMyPets();
    } else {
      console.error('❌ Error al cargar mis mascotas:', response.status);
      const errorText = await response.text();
      console.error('❌ Mensaje de error:', errorText);
    }
  } catch (error) {
    console.error('❌ Error cargando mis mascotas:', error);
  }
}

async function loadAvailablePets() {
  try {
    console.log('🔍 Cargando mascotas disponibles...');
    const response = await authFetch(`${API_BASE}/mascotas/disponibles`);
    if (response.ok) {
      availablePets = await response.json();
      console.log('✅ Mascotas disponibles cargadas:', availablePets.length);
      renderAvailablePets();
    } else {
      console.error('❌ Error en respuesta del servidor:', response.status);
      const errorData = await response.json().catch(() => ({}));
      console.error('Error details:', errorData);
    }
  } catch (error) {
    console.error('Error cargando mascotas disponibles:', error);
  }
}

// ========== RENDERIZADO ==========
function renderMyPets() {
  console.log('🎨 Renderizando mis mascotas...', myPets);
  
  const container = document.getElementById('my-pets-container');
  const noMascPetsMsg = document.getElementById('no-pets-message');
  const myPetsGrid = document.getElementById('my-pets-grid');
  const petsCount = document.getElementById('my-pets-count');
  const viewStatusBtn = document.getElementById('btn-view-pet-status');
  
  console.log('📊 Elementos del DOM encontrados:', {
    container: !!container,
    noMascPetsMsg: !!noMascPetsMsg,
    myPetsGrid: !!myPetsGrid,
    petsCount: !!petsCount,
    viewStatusBtn: !!viewStatusBtn
  });
  
  petsCount.textContent = `${myPets.length} ACTIVOS`;
  
  // Habilitar/deshabilitar botón de ver estado
  if (myPets.length > 0) {
    viewStatusBtn.disabled = false;
    viewStatusBtn.style.opacity = '1';
  } else {
    viewStatusBtn.disabled = true;
    viewStatusBtn.style.opacity = '0.6';
  }
  
  if (myPets.length === 0) {
    console.log('🚫 Sin mascotas - mostrando mensaje vacío');
    noMascPetsMsg.style.display = 'block';
    myPetsGrid.style.display = 'none';
  } else {
    console.log('✅ Renderizando', myPets.length, 'mascotas');
    noMascPetsMsg.style.display = 'none';
    myPetsGrid.style.display = 'grid';
    
    console.log('🏗️ Creando tarjetas de mascotas...');
    myPetsGrid.innerHTML = myPets.map(pet => createPetCard(pet, true)).join('');
    
    // Agregar event listeners para las mascotas propias
    myPets.forEach(pet => {
      const petId = pet.id || pet._id;
      const card = document.getElementById(`my-pet-${petId}`);
      if (card) {
        card.addEventListener('click', () => openPetModal(pet, true));
      }
    });
    
    console.log('🎉 Mascotas renderizadas exitosamente');
  }
}

function renderAvailablePets() {
  const container = document.getElementById('available-pets-container');
  const scanningMessage = document.getElementById('scanning-message');
  const carouselContainer = document.getElementById('carousel-container');
  
  if (availablePets.length === 0) {
    scanningMessage.innerHTML = '<div class="no-pets-message"><h3>🔍 Sin Resultados</h3><p>No hay compañeros disponibles en este sector</p></div>';
    scanningMessage.style.display = 'flex';
    carouselContainer.style.display = 'none';
  } else {
    scanningMessage.style.display = 'none';
    carouselContainer.style.display = 'block';
    initializeCarousel();
  }
}

// Variables globales para el carrusel
let currentSlide = 0;
let petsPerSlide = 3; // Número de mascotas visibles por vez
let totalSlides = 0;

function initializeCarousel() {
  const track = document.getElementById('carousel-track');
  const indicator = document.getElementById('carousel-indicator');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');
  
  // Mostrar solo 1 mascota por vez para mejor visualización
  petsPerSlide = 1;
  
  totalSlides = availablePets.length;
  currentSlide = 0;
  
  // Renderizar las mascotas en el carrusel
  track.innerHTML = availablePets.map(pet => createCarouselCard(pet)).join('');
  
  // Actualizar indicadores
  updateCarouselIndicator();
  createCarouselDots();
  
  // Event listeners para los controles
  prevBtn.onclick = () => moveCarousel(-1);
  nextBtn.onclick = () => moveCarousel(1);
  
  // Agregar event listeners para adopción
  availablePets.forEach(pet => {
    const petId = pet.id || pet._id;
    const card = document.getElementById(`available-pet-${petId}`);
    if (card) {
      card.addEventListener('click', () => selectPetForAdoption(pet));
    }
  });
  
  // Posicionar el carrusel
  updateCarouselPosition();
}

function createCarouselCard(pet) {
  const petEmoji = getPetEmoji(pet.tipo || pet.nombre);
  // Usar el id numérico si está disponible, si no usar _id
  const petId = pet.id || pet._id;
  
  return `
    <div class="carousel-card" id="available-pet-${petId}">
      <div class="pet-avatar" style="font-size: 4rem; text-align: center; margin-bottom: 1.5rem;">${petEmoji}</div>
      <div class="pet-info">
        <div class="pet-name" style="font-weight: 700; color: #ef4444; margin-bottom: 1rem; text-align: center; font-size: 1.3rem;">${pet.nombre}</div>
        <div class="pet-details" style="font-size: 1rem; color: #cbd5e1; line-height: 1.6; text-align: center;">
          <div style="margin-bottom: 0.5rem;">🧬 <strong>Especie:</strong> ${pet.tipo || 'Perro'}</div>
          <div style="margin-bottom: 0.5rem;">⚡ <strong>Poder:</strong> ${pet.poderEspecial || pet.superpoder || 'Ninguno'}</div>
          <div style="margin-bottom: 1.5rem;">🎭 <strong>Personalidad:</strong> ${pet.personalidad || 'Normal'}</div>
        </div>
        <div class="pet-status" style="background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 0.75rem; border-radius: 8px; text-align: center; font-size: 0.9rem; margin-bottom: 1.5rem; font-weight: 600;">
          🌟 DISPONIBLE PARA RECLUTAMIENTO
        </div>
        <button class="action-btn" onclick="adoptPet('${petId}')" style="width: 100%; background: linear-gradient(135deg, #dc2626, #ef4444); color: white; border: none; padding: 1rem; border-radius: 10px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px;">
          🚀 RECLUTAR COMPAÑERO
        </button>
      </div>
    </div>
  `;
}

function moveCarousel(direction) {
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  
  currentSlide += direction;
  
  // Limitar el movimiento
  if (currentSlide < 0) {
    currentSlide = 0;
  } else if (currentSlide >= totalSlides) {
    currentSlide = totalSlides - 1;
  }
  
  updateCarouselPosition();
  updateCarouselIndicator();
  updateCarouselDots();
  
  // Actualizar estado de los botones
  prevBtn.disabled = currentSlide === 0;
  nextBtn.disabled = currentSlide >= totalSlides - 1;
}

function updateCarouselPosition() {
  const track = document.getElementById('carousel-track');
  const containerWidth = track.parentElement.offsetWidth;
  const cardWidth = containerWidth - 40; // Ancho completo menos padding
  const offset = currentSlide * cardWidth;
  track.style.transform = `translateX(-${offset}px)`;
}

function updateCarouselIndicator() {
  const indicator = document.getElementById('carousel-indicator');
  indicator.textContent = `${currentSlide + 1} / ${availablePets.length}`;
}

function createCarouselDots() {
  const dotsContainer = document.getElementById('carousel-dots');
  dotsContainer.innerHTML = '';
  
  // Crear un punto por cada mascota (máximo 10 puntos para no saturar)
  const maxDots = Math.min(totalSlides, 10);
  const step = totalSlides > 10 ? Math.ceil(totalSlides / 10) : 1;
  
  for (let i = 0; i < maxDots; i++) {
    const actualIndex = i * step;
    const dot = document.createElement('div');
    dot.className = `carousel-dot ${actualIndex === currentSlide ? 'active' : ''}`;
    dot.onclick = () => goToSlide(actualIndex);
    dotsContainer.appendChild(dot);
  }
}

function updateCarouselDots() {
  const dots = document.querySelectorAll('.carousel-dot');
  const maxDots = Math.min(totalSlides, 10);
  const step = totalSlides > 10 ? Math.ceil(totalSlides / 10) : 1;
  
  dots.forEach((dot, index) => {
    const actualIndex = index * step;
    dot.classList.toggle('active', actualIndex === currentSlide);
  });
}

function goToSlide(slideIndex) {
  currentSlide = slideIndex;
  updateCarouselPosition();
  updateCarouselIndicator();
  updateCarouselDots();
  
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  prevBtn.disabled = currentSlide === 0;
  nextBtn.disabled = currentSlide >= totalSlides - 1;
}

function createPetCard(pet, isOwned = false) {
  const petEmoji = getPetEmoji(pet.tipo || pet.nombre);
  const petId = pet.id || pet._id;
  const prefix = isOwned ? 'my-pet' : 'available-pet';
  
  return `
    <div class="pet-card" id="${prefix}-${petId}">
      <div class="pet-avatar">${petEmoji}</div>
      <div class="pet-info">
        <div class="pet-name">${pet.nombre}</div>
        <div class="pet-details">
          <div>Tipo: ${pet.tipo || 'Perro'}</div>
          <div>Poder: ${pet.poderEspecial || pet.superpoder || 'Ninguno'}</div>
          <div>Personalidad: ${pet.personalidad || 'Normal'}</div>
        </div>
        ${isOwned ? '<div class="pet-status">✅ Tu mascota</div>' : '<div class="pet-status">🆓 Disponible</div>'}
      </div>
      ${isOwned && pet.hambre !== undefined ? createStatsHTML(pet) : ''}
      ${!isOwned ? '<div style="margin-top: 1rem;"><button class="action-btn" onclick="adoptPet(\'' + petId + '\')">🏠 Adoptar</button></div>' : ''}
    </div>
  `;
}

function createStatsHTML(pet) {
  return `
    <div class="stats-container">
      <div class="stat-bar">
        <span class="stat-label">Salud:</span>
        <div class="stat-progress">
          <div class="stat-fill health" style="width: ${pet.salud || 100}%"></div>
        </div>
        <span class="stat-value">${pet.salud || 100}%</span>
      </div>
      <div class="stat-bar">
        <span class="stat-label">Felicidad:</span>
        <div class="stat-progress">
          <div class="stat-fill happiness" style="width: ${pet.felicidad || 100}%"></div>
        </div>
        <span class="stat-value">${pet.felicidad || 100}%</span>
      </div>
      <div class="stat-bar">
        <span class="stat-label">Sueños:</span>
        <div class="stat-progress">
          <div class="stat-fill energy" style="width: ${pet.energia || 100}%"></div>
        </div>
        <span class="stat-value">${pet.energia || 100}%</span>
      </div>
      <div class="stat-bar">
        <span class="stat-label">Hambre:</span>
        <div class="stat-progress">
          <div class="stat-fill hunger" style="width: ${(100 - (pet.hambre || 0))}%"></div>
        </div>
        <span class="stat-value">${pet.hambre || 0}%</span>
      </div>
      <div class="stat-bar">
        <span class="stat-label">Limpieza:</span>
        <div class="stat-progress">
          <div class="stat-fill cleanliness" style="width: ${pet.limpieza || 100}%"></div>
        </div>
        <span class="stat-value">${pet.limpieza || 100}%</span>
      </div>
    </div>
  `;
}

function getPetEmoji(tipo) {
  const emojis = {
    'perro': '🐕',
    'gato': '🐱',
    'conejo': '🐰',
    'hamster': '🐹',
    'pajaro': '🐦',
    'Astro': '🐕',
    'Luna': '🐱',
    'Max': '🐕',
    'Bella': '🐱',
    'Rocky': '🐕',
    'Nube': '🐱',
    'Rayo': '⚡',
    'Chispa': '✨',
  };
  
  return emojis[tipo?.toLowerCase()] || emojis[tipo] || '🐾';
}

// ========== CREAR MASCOTA ==========
function toggleCreatePetForm() {
  const section = document.getElementById('create-pet-section');
  if (section.style.display === 'none') {
    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth' });
  } else {
    section.style.display = 'none';
  }
}

async function handleCreatePet(e) {
  e.preventDefault();
  
  const petData = {
    nombre: document.getElementById('pet-name').value,
    tipo: document.getElementById('pet-type').value,
    poderEspecial: document.getElementById('pet-power').value,
    personalidad: document.getElementById('pet-personality').value
  };
  
  try {
    const response = await authFetch(`${API_BASE}/mascotas/crear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(petData)
    });
    
    if (response.ok) {
      const result = await response.json();
      alert('✅ ¡Mascota creada exitosamente!');
      document.getElementById('create-pet-form').reset();
      document.getElementById('create-pet-section').style.display = 'none';
      await loadAvailablePets(); // Recargar mascotas disponibles
    } else {
      const error = await response.json();
      alert(`❌ Error: ${error.error}`);
    }
  } catch (error) {
    console.error('Error creando mascota:', error);
    alert('❌ Error al crear la mascota');
  }
}

// ========== ADOPCIÓN ==========
function selectPetForAdoption(pet) {
  selectedPet = pet;
  const petId = pet.id || pet._id;
  const card = document.getElementById(`available-pet-${petId}`);
  
  // Remover selección anterior
  document.querySelectorAll('.pet-card.selected').forEach(c => c.classList.remove('selected'));
  
  // Marcar como seleccionada
  card.classList.add('selected');
  
  // Mostrar botón de adopción si no existe
  if (!card.querySelector('.adopt-btn-container')) {
    const adoptBtn = document.createElement('div');
    adoptBtn.className = 'adopt-btn-container';
    adoptBtn.style.marginTop = '1rem';
    adoptBtn.innerHTML = `<button class="btn btn-primary" onclick="adoptPet('${petId}')" style="width: 100%;">🏠 Adoptar a ${pet.nombre}</button>`;
    card.appendChild(adoptBtn);
  }
}

async function adoptPet(petId) {
  try {
    console.log('🚀 Iniciando adopción de mascota ID:', petId);
    
    const response = await authFetch(`${API_BASE}/mis-mascotas/adoptar/${petId}`, {
      method: 'POST'
    });
    
    console.log('📡 Respuesta del servidor:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Adopción exitosa:', result);
      
      // Mostrar la pantalla de mascota adoptada
      showAdoptedPetView(result.mascota);
      
      // Recargar los datos para actualizar las listas
      await loadMyPets();
      await loadAvailablePets();
    } else {
      const error = await response.json();
      console.error('❌ Error del servidor:', error);
      alert(`❌ ${error.error || error.message || 'Error al adoptar'}`);
    }
  } catch (error) {
    console.error('Error adoptando mascota:', error);
    alert('❌ Error al adoptar la mascota');
  }
}

// ========== MODAL ==========
function openPetModal(pet, isOwned) {
  const modal = document.getElementById('pet-detail-modal');
  const modalName = document.getElementById('modal-pet-name');
  const modalAvatar = document.getElementById('modal-pet-avatar');
  const modalInfo = document.getElementById('modal-pet-info');
  const modalStats = document.getElementById('modal-pet-stats');
  const modalActions = document.getElementById('modal-action-buttons');
  const petId = pet.id || pet._id;
  
  modalName.textContent = pet.nombre;
  modalAvatar.textContent = getPetEmoji(pet.tipo || pet.nombre);
  
  modalInfo.innerHTML = `
    <div style="color: #94a3b8; margin-bottom: 1rem;">
      <div><strong>Tipo:</strong> ${pet.tipo || 'Perro'}</div>
      <div><strong>Poder Especial:</strong> ${pet.poderEspecial || pet.superpoder || 'Ninguno'}</div>
      <div><strong>Personalidad:</strong> ${pet.personalidad || 'Normal'}</div>
      ${isOwned ? '<div style="color: #10b981;"><strong>Estado:</strong> ✅ Tu mascota</div>' : ''}
    </div>
  `;
  
  if (isOwned && pet.hambre !== undefined) {
    modalStats.innerHTML = createStatsHTML(pet);
    modalActions.innerHTML = `
      <button class="action-btn" onclick="feedPet('${petId}')">🍎 Alimentar</button>
      <button class="action-btn" onclick="playWithPet('${petId}')">🎮 Jugar</button>
      <button class="action-btn" onclick="sleepPet('${petId}')">😴 Dormir</button>
      <button class="action-btn" onclick="bathePet('${petId}')">🛁 Bañar</button>
      <button class="action-btn" onclick="healPet('${petId}')">💊 Acariciar</button>
      <button class="action-btn" onclick="deletePet('${petId}')" style="background: #ef4444;">🗑️ Eliminar</button>
    `;
  } else {
    modalStats.innerHTML = '';
    modalActions.innerHTML = `
      <button class="btn btn-primary" onclick="adoptPet('${petId}')" style="width: 100%;">🏠 Adoptar a ${pet.nombre}</button>
    `;
  }
  
  modal.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('pet-detail-modal').classList.add('hidden');
}

// ========== ACCIONES DE MASCOTAS ==========
async function feedPet(petId) {
  await petAction(petId, 'alimentar', '🍎');
}

async function playWithPet(petId) {
  await petAction(petId, 'jugar', '🎮');
}

async function sleepPet(petId) {
  await petAction(petId, 'dormir', '😴');
}

async function bathePet(petId) {
  await petAction(petId, 'limpiar', '🛁');
}

async function healPet(petId) {
  await petAction(petId, 'acariciar', '💊');
}

async function petAction(petId, action, emoji) {
  try {
    const response = await authFetch(`${API_BASE}/mis-mascotas/${petId}/${action}`, {
      method: 'POST'
    });
    
    if (response.ok) {
      alert(`${emoji} ¡Acción realizada exitosamente!`);
      await loadMyPets();
      closeModal();
    } else {
      const error = await response.json();
      alert(`❌ ${error.message}`);
    }
  } catch (error) {
    console.error(`Error en acción ${action}:`, error);
    alert(`❌ Error al ${action}`);
  }
}

async function deletePet(petId) {
  if (confirm('¿Estás seguro de que quieres eliminar esta mascota? Esta acción no se puede deshacer.')) {
    try {
      const response = await authFetch(`${API_BASE}/mis-mascotas/${petId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert('🗑️ Mascota eliminada exitosamente');
        await loadMyPets();
        closeModal();
      } else {
        const error = await response.json();
        alert(`❌ ${error.message}`);
      }
    } catch (error) {
      console.error('Error eliminando mascota:', error);
      alert('❌ Error al eliminar la mascota');
    }
  }
}

// Hacer funciones disponibles globalmente
window.adoptPet = adoptPet;
window.feedPet = feedPet;
window.playWithPet = playWithPet;
window.sleepPet = sleepPet;
window.bathePet = bathePet;
window.healPet = healPet;
window.deletePet = deletePet;
window.viewFirstPetStatus = viewFirstPetStatus;

// Función de debug para probar manualmente
window.debugLoadMyPets = async function() {
  console.log('🔧 [DEBUG] Cargando mascotas manualmente...');
  await loadMyPets();
};

// Función de debug para verificar datos
window.debugShowMyPets = function() {
  console.log('🔧 [DEBUG] Mis mascotas actuales:', myPets);
  console.log('🔧 [DEBUG] Estado de elementos DOM:', {
    container: document.getElementById('my-pets-container'),
    grid: document.getElementById('my-pets-grid'),
    count: document.getElementById('my-pets-count')
  });
};

// ========== INTERFAZ DE MASCOTA ADOPTADA ==========
function viewFirstPetStatus() {
  console.log('👁️ Intentando ver estado de mascota...');
  
  if (myPets.length === 0) {
    console.log('❌ No hay mascotas para mostrar');
    alert('🚫 No tienes mascotas activas para ver su estado');
    return;
  }
  
  // Mostrar la primera mascota (o la seleccionada)
  const firstPet = myPets[0];
  console.log('📊 Mostrando estado de:', firstPet.nombre);
  showAdoptedPetView(firstPet);
}

function showAdoptedPetView(pet) {
  console.log('🎉 Mostrando interfaz de mascota adoptada:', pet);
  
  // Ocultar dashboard principal
  document.getElementById('background').classList.add('hidden');
  
  // Mostrar interfaz de adopción
  const adoptedView = document.getElementById('adopted-pet-view');
  adoptedView.classList.remove('hidden');
  
  // Llenar datos de la mascota
  populateAdoptedPetData(pet);
  
  // Configurar event listeners
  setupAdoptedPetEventListeners(pet);
}

function populateAdoptedPetData(pet) {
  // Avatar y emoji
  const petEmoji = getPetEmoji(pet.tipo || pet.nombre);
  document.getElementById('adopted-pet-avatar').textContent = petEmoji;
  
  // Información básica
  document.getElementById('adopted-pet-name').textContent = pet.nombre;
  document.getElementById('adopted-pet-type').textContent = `Tipo: ${pet.tipo || 'Perro'}`;
  document.getElementById('adopted-pet-power').textContent = `Poder: ${pet.poderEspecial || pet.superpoder || 'Ninguno'}`;
  
  // Barras de estado
  createAdoptedPetStats(pet);
  
  // Descripción personalizada
  const descriptions = {
    'perro': 'Un compañero leal perfecto para misiones de exploración y vigilancia.',
    'gato': 'Ágil y sigiloso, ideal para operaciones de reconocimiento nocturno.',
    'conejo': 'Rápido y eficiente, especialista en comunicaciones de emergencia.',
    'loro': 'Comunicador excepcional con habilidades de traducción intergaláctica.',
    'tortuga': 'Estratega paciente con sabiduría milenaria para decisiones críticas.',
    'hamster': 'Especialista en espacios reducidos y sistemas de ventilación.'
  };
  
  const defaultDesc = 'Tu nuevo compañero está listo para unirse a las misiones espaciales. Cuida de él regularmente para mantenerlo en óptimas condiciones.';
  const petType = (pet.tipo || 'perro').toLowerCase();
  document.getElementById('adopted-pet-description').textContent = descriptions[petType] || defaultDesc;
}

function createAdoptedPetStats(pet) {
  const statsContainer = document.getElementById('adopted-pet-stats');
  
  console.log('📊 Creando barras de estado para:', pet.nombre, pet);
  
  const stats = [
    { 
      label: 'Salud', 
      value: Math.round(pet.salud || 100), 
      class: 'health',
      gradient: 'linear-gradient(90deg, #dc2626, #ef4444)',
      icon: '❤️'
    },
    { 
      label: 'Felicidad', 
      value: Math.round(pet.felicidad || 100), 
      class: 'happiness',
      gradient: 'linear-gradient(90deg, #eab308, #fbbf24)',
      icon: '😊'
    },
    { 
      label: 'Energía', 
      value: Math.round(pet.energia || 100), 
      class: 'energy',
      gradient: 'linear-gradient(90deg, #059669, #10b981)',
      icon: '⚡'
    },
    { 
      label: 'Hambre', 
      value: Math.round(100 - (pet.hambre || 0)), // Invertir: menos hambre = más saciedad
      class: 'hunger',
      gradient: 'linear-gradient(90deg, #7c3aed, #8b5cf6)',
      icon: '🍎'
    },
    { 
      label: 'Limpieza', 
      value: Math.round(pet.limpieza || 100), 
      class: 'cleanliness',
      gradient: 'linear-gradient(90deg, #0891b2, #06b6d4)',
      icon: '✨'
    }
  ];
  
  console.log('📈 Valores de las barras:', stats.map(s => `${s.label}: ${s.value}%`));
  
  statsContainer.innerHTML = stats.map(stat => `
    <div class="stat-bar">
      <div class="stat-header">
        <span class="stat-icon">${stat.icon}</span>
        <span class="stat-label">${stat.label}:</span>
        <span class="stat-value">${stat.value}%</span>
      </div>
      <div class="stat-progress">
        <div class="stat-fill ${stat.class}" 
             style="width: ${stat.value}%; background: ${stat.gradient}; transition: width 0.5s ease;">
        </div>
      </div>
    </div>
  `).join('');
}

// Nueva función para actualizar las barras del carrusel principal
function updateCarouselPetStats(pet) {
  console.log('🔄 Actualizando barras del carrusel para:', pet.nombre, pet);
  
  // Buscar la mascota activa en el carrusel
  const carouselContainer = document.querySelector('#my-pets-carousel .carousel-container');
  if (!carouselContainer) return;
  
  const activeCard = carouselContainer.querySelector('.pet-card.active');
  if (!activeCard) return;
  
  // Verificar que sea la mascota correcta
  const cardTitle = activeCard.querySelector('h3');
  if (!cardTitle || cardTitle.textContent !== pet.nombre) return;
  
  // Actualizar cada barra de estado en el carrusel
  const statsContainer = activeCard.querySelector('.stats-container');
  if (statsContainer) {
    console.log('📊 Actualizando barras del carrusel con valores:', {
      salud: pet.salud,
      felicidad: pet.felicidad,
      energia: pet.energia,
      hambre: pet.hambre,
      limpieza: pet.limpieza
    });
    
    // Actualizar barra de salud
    const healthBar = statsContainer.querySelector('.stat-fill.health');
    const healthValue = statsContainer.querySelector('.stat-bar:nth-child(1) .stat-value');
    if (healthBar && healthValue) {
      const saludValue = Math.round(pet.salud || 100);
      healthBar.style.width = `${saludValue}%`;
      healthValue.textContent = `${saludValue}%`;
    }
    
    // Actualizar barra de felicidad
    const happinessBar = statsContainer.querySelector('.stat-fill.happiness');
    const happinessValue = statsContainer.querySelector('.stat-bar:nth-child(2) .stat-value');
    if (happinessBar && happinessValue) {
      const felicidadValue = Math.round(pet.felicidad || 100);
      happinessBar.style.width = `${felicidadValue}%`;
      happinessValue.textContent = `${felicidadValue}%`;
    }
    
    // Actualizar barra de energía (Sueños)
    const energyBar = statsContainer.querySelector('.stat-fill.energy');
    const energyValue = statsContainer.querySelector('.stat-bar:nth-child(3) .stat-value');
    if (energyBar && energyValue) {
      const energiaValue = Math.round(pet.energia || 100);
      energyBar.style.width = `${energiaValue}%`;
      energyValue.textContent = `${energiaValue}%`;
    }
    
    // Actualizar barra de hambre (invertida)
    const hungerBar = statsContainer.querySelector('.stat-fill.hunger');
    const hungerValue = statsContainer.querySelector('.stat-bar:nth-child(4) .stat-value');
    if (hungerBar && hungerValue) {
      const hambreValue = Math.round(pet.hambre || 0);
      const saciedadValue = 100 - hambreValue; // Invertir para mostrar saciedad
      hungerBar.style.width = `${saciedadValue}%`;
      hungerValue.textContent = `${hambreValue}%`; // Mostrar hambre real, no saciedad
    }
    
    // Actualizar barra de limpieza
    const cleanlinessBar = statsContainer.querySelector('.stat-fill.cleanliness');
    const cleanlinessValue = statsContainer.querySelector('.stat-bar:nth-child(5) .stat-value');
    if (cleanlinessBar && cleanlinessValue) {
      const limpiezaValue = Math.round(pet.limpieza || 100);
      cleanlinessBar.style.width = `${limpiezaValue}%`;
      cleanlinessValue.textContent = `${limpiezaValue}%`;
    }
    
    console.log('✅ Barras del carrusel actualizadas correctamente');
  }
}

function setupAdoptedPetEventListeners(pet) {
  const petId = pet.id || pet._id;
  
  // Botón volver al dashboard
  document.getElementById('btn-back-to-dashboard').onclick = () => {
    hideAdoptedPetView();
  };
  
  // Botones de acción
  document.getElementById('adopted-feed').onclick = () => performPetAction(petId, 'alimentar', '🍎', pet);
  document.getElementById('adopted-play').onclick = () => performPetAction(petId, 'jugar', '🎮', pet);
  document.getElementById('adopted-sleep').onclick = () => performPetAction(petId, 'dormir', '😴', pet);
  document.getElementById('adopted-clean').onclick = () => performPetAction(petId, 'limpiar', '🛁', pet);
  document.getElementById('adopted-heal').onclick = () => performPetAction(petId, 'curar', '💊', pet);
  document.getElementById('adopted-pet').onclick = () => performPetAction(petId, 'acariciar', '💕', pet);
}

async function performPetAction(petId, action, emoji, pet) {
  try {
    console.log(`${emoji} Realizando acción ${action} en mascota ${petId}`);
    
    // Mapear acciones a endpoints
    const actionMap = {
      'alimentar': 'alimentar',
      'jugar': 'jugar', 
      'dormir': 'dormir',
      'limpiar': 'limpiar',
      'acariciar': 'acariciar',
      'curar': 'curar'
    };
    
    const endpoint = actionMap[action] || action;
    
    // Usar el endpoint de mi-mascota que busca por ownerId en lugar de petId específico
    const response = await authFetch(`${API_BASE}/mis-mascotas/mi-mascota/${endpoint}`, {
      method: 'POST'
    });
    
    console.log(`📡 Respuesta del servidor (${action}):`, response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Acción ${action} realizada:`, result);
      
      // Mostrar mensaje de éxito con animación
      showActionFeedback(emoji, result.mensaje || `${action} exitoso`);
      
      // Actualizar las barras de estado con la mascota actualizada
      if (result.mascota) {
        console.log('🔄 Actualizando barras de estado con:', result.mascota);
        
        // Actualizar el objeto pet actual
        Object.assign(pet, result.mascota);
        
        // Recrear las barras de estado con los nuevos valores
        createAdoptedPetStats(result.mascota);
        
        // También actualizar en la lista de mascotas
        const petIndex = myPets.findIndex(p => (p.id || p._id) === petId);
        if (petIndex !== -1) {
          myPets[petIndex] = result.mascota;
          renderMyPets(); // Actualizar el panel izquierdo
        }
        
        // IMPORTANTE: También actualizar las barras del carrusel principal
        updateCarouselPetStats(result.mascota);
      }
      
    } else {
      const error = await response.json();
      console.error(`❌ Error del servidor:`, error);
      showActionFeedback('❌', error.error || 'Error al realizar la acción');
    }
  } catch (error) {
    console.error(`❌ Error en acción ${action}:`, error);
    showActionFeedback('❌', `Error al ${action}`);
  }
}

function showActionFeedback(emoji, message) {
  // Crear elemento de feedback
  const feedback = document.createElement('div');
  feedback.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #dc2626, #ef4444);
    color: white;
    padding: 2rem 3rem;
    border-radius: 20px;
    font-size: 1.2rem;
    font-weight: 700;
    text-align: center;
    z-index: 2000;
    box-shadow: 0 10px 40px rgba(220, 38, 38, 0.5);
    animation: feedbackAnimation 3s ease-out;
    border: 2px solid #ef4444;
    max-width: 400px;
    word-wrap: break-word;
  `;
  
  // Mostrar emoji solo si no es un mensaje de error
  const emojiDisplay = message.includes('Error') || message.includes('❌') ? '❌' : emoji;
  
  feedback.innerHTML = `
    <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">${emojiDisplay}</div>
    <div style="text-transform: none; letter-spacing: 0.5px; line-height: 1.4;">${message}</div>
  `;
  
  // Agregar CSS de animación
  const style = document.createElement('style');
  style.textContent = `
    @keyframes feedbackAnimation {
      0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5);
      }
      15% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.1);
      }
      85% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.9);
      }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(feedback);
  
  // Remover después de la animación
  setTimeout(() => {
    document.body.removeChild(feedback);
    document.head.removeChild(style);
  }, 3000);
}

function hideAdoptedPetView() {
  // Ocultar interfaz de adopción
  document.getElementById('adopted-pet-view').classList.add('hidden');
  
  // Mostrar dashboard principal
  document.getElementById('background').classList.remove('hidden');
  
  console.log('🔄 Volviendo al dashboard principal');
}

console.log('✅ Dashboard Moderno cargado exitosamente');
