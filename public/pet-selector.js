// Script para manejar la selección de mascotas en el carrusel
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎯 Iniciando sistema de selección de mascotas...');
  console.log('🌐 Location hostname:', window.location.hostname);
  
  // Variables globales para el carrusel
  let mascotas = [];
  let currentPet = 0;
  
  // API Base
  const API_BASE = window.location.hostname.includes('localhost')
    ? "http://localhost:3000"
    : "https://api-heroes-2lw9.onrender.com";
    
  console.log('🌐 API_BASE configurado como:', API_BASE);
    
  // Función para hacer peticiones autenticadas
  async function authFetch(url, options = {}) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No hay token de autenticación');
      throw new Error('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
    }
    
    console.log('🔑 Usando token:', token.substring(0, 20) + '...');
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };
    
    const response = await fetch(url, { ...options, headers });
    
    // Si hay error de autenticación, limpiar token y redirigir
    if (response.status === 401) {
      console.error('❌ Token inválido o expirado');
      localStorage.removeItem('token');
      alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      window.location.reload();
      throw new Error('Token inválido');
    }
    
    return response;
  }
  
  // Cargar mascotas disponibles desde el servidor
  async function cargarMascotasDisponibles() {
    try {
      console.log('📡 Cargando mascotas disponibles...');
      
      // Intentar endpoint público primero (más confiable)
      console.log('🌐 Intentando endpoint público: /mascotas/disponibles');
      const publicRes = await fetch(`${API_BASE}/mascotas/disponibles`);
      
      if (publicRes.ok) {
        const data = await publicRes.json();
        console.log('✅ Mascotas cargadas desde endpoint público:', data.length);
        
        if (Array.isArray(data) && data.length > 0) {
          mascotas = data;
          currentPet = 0;
          renderPetCarousel();
          setupCarouselControls();
          return;
        }
      }
      
      // Fallback: intentar endpoint autenticado
      console.log('🔑 Fallback a endpoint autenticado...');
      const token = localStorage.getItem('token');
      console.log('🔑 Token disponible:', token ? 'Sí' : 'No');
      
      if (!token) {
        throw new Error('No hay token disponible y endpoint público falló');
      }
      
      const res = await authFetch(`${API_BASE}/mis-mascotas/disponibles`);
      console.log('📊 Respuesta autenticada - Status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Error HTTP autenticado:', res.status, errorText);
        throw new Error(`Error en ambos endpoints: público y autenticado fallaron`);
      }
      
      const data = await res.json();
      console.log('✅ Mascotas cargadas desde endpoint autenticado:', data.length);
      
      if (Array.isArray(data) && data.length > 0) {
        mascotas = data;
        currentPet = 0;
        renderPetCarousel();
        setupCarouselControls();
      } else {
        console.warn('⚠️ No hay mascotas disponibles en la respuesta');
        mostrarError('No hay mascotas disponibles para adoptar.');
      }
    } catch (err) {
      console.error('❌ Error detallado al cargar mascotas:', err);
      mostrarError('Error al cargar mascotas. Por favor, intenta más tarde.');
    }
  }
  
  // Renderizar el carrusel de mascotas
  function renderPetCarousel() {
    if (!mascotas.length) {
      mostrarError('No hay mascotas disponibles.');
      return;
    }
    
    const mascotaActual = mascotas[currentPet];
    console.log('🐾 Renderizando mascota:', mascotaActual.nombre);
    
    // Contenedor SVG
    const svgContainer = document.getElementById('pet-svg-container');
    if (svgContainer) {
      const svg = mascotaActual.svg || `<div style="font-size:4em; text-align:center; padding:40px;">🐾</div>`;
      svgContainer.innerHTML = svg;
    }
    
    // Nombre de la mascota
    const petName = document.getElementById('pet-name');
    if (petName) {
      petName.textContent = mascotaActual.nombre || 'Mascota sin nombre';
    }
    
    // Descripción de la mascota
    const petDesc = document.getElementById('pet-desc');
    if (petDesc) {
      petDesc.textContent = mascotaActual.desc || mascotaActual.descripcion || 'Una mascota adorable esperando por ti.';
    }
    
    // Actualizar botón de seleccionar
    const selectBtn = document.getElementById('select-pet-btn');
    if (selectBtn) {
      console.log('🐾 Configurando botón para mascota:', {
        id: mascotaActual.id,
        _id: mascotaActual._id,
        nombre: mascotaActual.nombre,
        tipo_id: typeof mascotaActual.id,
        tipo_id_mongo: typeof mascotaActual._id
      });
      selectBtn.onclick = () => adoptarMascota(mascotaActual.id);
    }
  }
  
  // Configurar controles del carrusel
  function setupCarouselControls() {
    const prevBtn = document.getElementById('prev-pet');
    const nextBtn = document.getElementById('next-pet');
    
    if (prevBtn) {
      prevBtn.onclick = () => {
        if (!mascotas.length) return;
        currentPet = (currentPet - 1 + mascotas.length) % mascotas.length;
        renderPetCarousel();
      };
    }
    
    if (nextBtn) {
      nextBtn.onclick = () => {
        if (!mascotas.length) return;
        currentPet = (currentPet + 1) % mascotas.length;
        renderPetCarousel();
      };
    }
  }
  
  // Adoptar mascota
  async function adoptarMascota(petId) {
    // Prevenir múltiples clics
    const selectBtn = document.getElementById('select-pet-btn');
    if (selectBtn.disabled) {
      console.log('⚠️ Adopción ya en progreso, ignorando clic adicional');
      return;
    }
    
    try {
      // Deshabilitar botón durante la adopción
      selectBtn.disabled = true;
      selectBtn.textContent = 'Adoptando...';
      
      console.log('💕 Adoptando mascota con ID:', petId);
      console.log('🔍 Tipo de petId:', typeof petId);
      console.log('🔍 Valor exacto de petId:', JSON.stringify(petId));
      
      const url = `${API_BASE}/mis-mascotas/adoptar/${petId}`;
      console.log('🌐 URL completa:', url);
      
      const response = await authFetch(url, {
        method: 'POST'
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error data:', errorData);
        throw new Error(errorData.error || 'Error al adoptar mascota');
      }
      
      const result = await response.json();
      console.log('✅ Mascota adoptada:', result);
      
      alert('¡Felicidades! Has adoptado a ' + result.mascota.nombre);
      
      // Redirigir al juego principal
      document.getElementById('select-pet-view').classList.add('hidden');
      document.getElementById('background').classList.remove('hidden');
      
      // Recargar la página para inicializar el juego
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('❌ Error al adoptar mascota:', error);
      alert('Error al adoptar mascota: ' + error.message);
      
      // Rehabilitar botón en caso de error
      selectBtn.disabled = false;
      selectBtn.textContent = 'Seleccionar';
    }
  }
  
  // Mostrar mensaje de error
  function mostrarError(mensaje) {
    const svgContainer = document.getElementById('pet-svg-container');
    const petName = document.getElementById('pet-name');
    const petDesc = document.getElementById('pet-desc');
    
    if (svgContainer) {
      svgContainer.innerHTML = `<div style="text-align:center; padding:40px; color:#999; font-size:1.2em;">${mensaje}</div>`;
    }
    if (petName) petName.textContent = '';
    if (petDesc) petDesc.textContent = '';
  }
  
  // Verificar si estamos en la vista de selección de mascotas
  function checkIfInSelectionView() {
    const selectPetView = document.getElementById('select-pet-view');
    return selectPetView && !selectPetView.classList.contains('hidden');
  }
  
  // Observer para detectar cuando se muestra la vista de selección
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.target.id === 'select-pet-view' && mutation.attributeName === 'class') {
        const selectPetView = mutation.target;
        if (!selectPetView.classList.contains('hidden')) {
          console.log('👀 Vista de selección de mascotas activada');
          setTimeout(cargarMascotasDisponibles, 200);
        }
      }
    });
  });
  
  // Observar cambios en la vista de selección
  const selectPetView = document.getElementById('select-pet-view');
  if (selectPetView) {
    observer.observe(selectPetView, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
  
  // Si ya estamos en la vista de selección, cargar mascotas inmediatamente
  if (checkIfInSelectionView()) {
    console.log('🚀 Vista de selección ya activa, cargando mascotas...');
    setTimeout(cargarMascotasDisponibles, 500);
  }
  
  console.log('✅ Sistema de selección de mascotas inicializado');
});
