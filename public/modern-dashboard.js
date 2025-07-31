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
    const response = await authFetch(`${API_BASE}/mis-mascotas`);
    if (response.ok) {
      myPets = await response.json();
      renderMyPets();
    }
  } catch (error) {
    console.error('Error cargando mis mascotas:', error);
  }
}

async function loadAvailablePets() {
  try {
    const response = await authFetch(`${API_BASE}/mascotas`);
    if (response.ok) {
      const allPets = await response.json();
      // Filtrar solo las mascotas disponibles (sin owner)
      availablePets = allPets.filter(pet => !pet.ownerId);
      renderAvailablePets();
    }
  } catch (error) {
    console.error('Error cargando mascotas disponibles:', error);
  }
}

// ========== RENDERIZADO ==========
function renderMyPets() {
  const container = document.getElementById('my-pets-container');
  const noMascPetsMsg = document.getElementById('no-pets-message');
  const myPetsGrid = document.getElementById('my-pets-grid');
  const petsCount = document.getElementById('my-pets-count');
  
  petsCount.textContent = `(${myPets.length})`;
  
  if (myPets.length === 0) {
    noMascPetsMsg.style.display = 'block';
    myPetsGrid.style.display = 'none';
  } else {
    noMascPetsMsg.style.display = 'none';
    myPetsGrid.style.display = 'grid';
    
    myPetsGrid.innerHTML = myPets.map(pet => createPetCard(pet, true)).join('');
    
    // Agregar event listeners para las mascotas propias
    myPets.forEach(pet => {
      const petId = pet.id || pet._id;
      const card = document.getElementById(`my-pet-${petId}`);
      if (card) {
        card.addEventListener('click', () => openPetModal(pet, true));
      }
    });
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
      alert('🎉 ¡Mascota adoptada exitosamente!');
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

console.log('✅ Dashboard Moderno cargado exitosamente');
