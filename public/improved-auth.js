// Mejora del sistema de autenticación - authFetch mejorado
console.log('🔧 Cargando sistema de autenticación mejorado...');

// Guardar referencia al authFetch original
window.originalAuthFetch = window.authFetch;

// Función authFetch mejorada con mejor manejo de errores
window.authFetch = function(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = options.headers || {};
  
  if (!token) {
    console.warn('⚠️ authFetch: No hay token disponible');
    // En lugar de redirigir inmediatamente, damos oportunidad de manejar el error
    return Promise.reject(new Error('No token available'));
  }
  
  console.log('🔑 authFetch: Usando token para', url);
  
  // Verificar si el token parece válido antes de enviarlo
  try {
    let jwtToken = token;
    if (token.startsWith('Bearer ')) {
      jwtToken = token.substring(7);
    }
    
    const parts = jwtToken.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp) {
        const expDate = new Date(payload.exp * 1000);
        const now = new Date();
        
        if (expDate <= now) {
          console.warn('⚠️ Token expirado, eliminando y rechazando petición');
          localStorage.removeItem('token');
          return Promise.reject(new Error('Token expired'));
        } else {
          const timeLeft = Math.floor((expDate - now) / 1000 / 60);
          console.log(`✅ Token válido por ${timeLeft} minutos más`);
        }
      }
    }
  } catch (e) {
    console.warn('⚠️ Error al verificar token:', e);
  }
  
  // Configurar headers
  headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  
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
      console.log(`📡 Respuesta de ${url}:`, response.status, response.statusText);
      
      if (response.status === 401) {
        console.warn('🚫 Token rechazado por el servidor para:', url);
        
        // En lugar de redirigir inmediatamente, permitir manejo personalizado
        const error = new Error('Authentication failed');
        error.status = 401;
        error.response = response;
        throw error;
      }
      
      return response;
    })
    .catch(error => {
      console.error('❌ Error en authFetch para', url, ':', error);
      
      // Solo redirigir al login en casos específicos
      if (error.status === 401 && !url.includes('/login') && !url.includes('/register')) {
        console.log('🔄 Iniciando proceso de logout por token inválido...');
        
        // Dar tiempo para que la interfaz procese el error
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('currentPetId');
          
          // Solo mostrar alerta si no estamos ya en login
          const loginView = document.getElementById('login-view');
          if (loginView && loginView.classList.contains('hidden')) {
            alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            
            // Redirigir a login
            document.getElementById('welcome-view').classList.remove('hidden');
            document.getElementById('background').classList.add('hidden');
            document.getElementById('select-pet-view').classList.add('hidden');
            document.getElementById('login-view').classList.remove('hidden');
            document.getElementById('register-view').classList.add('hidden');
          }
        }, 1000); // Esperar 1 segundo antes de redirigir
      }
      
      throw error;
    });
};

// Función para verificar salud de la sesión
window.checkSessionHealth = function() {
  console.log('🏥 Verificando salud de la sesión...');
  
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('❌ No hay token');
    return false;
  }
  
  try {
    let jwtToken = token;
    if (token.startsWith('Bearer ')) {
      jwtToken = token.substring(7);
    }
    
    const parts = jwtToken.split('.');
    if (parts.length !== 3) {
      console.log('❌ Token mal formado');
      return false;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp) {
      const expDate = new Date(payload.exp * 1000);
      const now = new Date();
      const timeLeft = Math.floor((expDate - now) / 1000 / 60);
      
      console.log(`⏰ Token expira en ${timeLeft} minutos`);
      
      if (timeLeft <= 0) {
        console.log('❌ Token expirado');
        return false;
      }
      
      if (timeLeft <= 5) {
        console.warn('⚠️ Token expirará pronto (menos de 5 minutos)');
      }
      
      return true;
    }
  } catch (e) {
    console.error('❌ Error al verificar token:', e);
    return false;
  }
  
  return true;
};

// Verificación periódica de salud de sesión
setInterval(() => {
  if (!window.checkSessionHealth()) {
    console.warn('⚠️ Sesión no saludable detectada');
  }
}, 60000); // Verificar cada minuto

console.log('✅ Sistema de autenticación mejorado cargado');
console.log('💡 Funciones disponibles: checkSessionHealth()');
