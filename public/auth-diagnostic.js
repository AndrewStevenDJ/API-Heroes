// Diagnóstico de autenticación
console.log('🔍 ===== DIAGNÓSTICO DE AUTENTICACIÓN =====');

// 1. Verificar token en localStorage
const token = localStorage.getItem('token');
console.log('📦 Token en localStorage:', token ? 'Presente' : 'Ausente');

if (token) {
  console.log('🔑 Token (primeros 50 chars):', token.substring(0, 50) + '...');
  
  // 2. Verificar formato del token
  try {
    let jwtToken = token;
    if (token.startsWith('Bearer ')) {
      jwtToken = token.substring(7);
    }
    
    const parts = jwtToken.split('.');
    if (parts.length === 3) {
      console.log('✅ Token tiene formato JWT válido (3 partes)');
      
      // Decodificar payload
      try {
        const payload = JSON.parse(atob(parts[1]));
        console.log('📄 Payload del token:', payload);
        
        // Verificar expiración
        if (payload.exp) {
          const expDate = new Date(payload.exp * 1000);
          const now = new Date();
          console.log('⏰ Token expira el:', expDate.toLocaleString());
          console.log('🕐 Tiempo actual:', now.toLocaleString());
          
          if (expDate > now) {
            const timeLeft = Math.floor((expDate - now) / 1000 / 60); // minutos
            console.log('✅ Token válido por', timeLeft, 'minutos más');
          } else {
            console.log('❌ TOKEN EXPIRADO hace', Math.floor((now - expDate) / 1000 / 60), 'minutos');
          }
        }
      } catch (e) {
        console.error('❌ Error al decodificar payload:', e);
      }
    } else {
      console.log('❌ Token NO tiene formato JWT válido');
    }
  } catch (e) {
    console.error('❌ Error al analizar token:', e);
  }
}

// 3. Probar una llamada de autenticación
async function testAuth() {
  console.log('\n🧪 ===== PRUEBA DE AUTENTICACIÓN =====');
  
  if (!token) {
    console.log('❌ No hay token para probar');
    return;
  }
  
  try {
    const API_BASE = window.API_BASE || 'http://localhost:3000';
    const response = await fetch(`${API_BASE}/mis-mascotas`, {
      headers: {
        'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
      }
    });
    
    console.log('📡 Estado de respuesta:', response.status);
    console.log('📡 Estado texto:', response.statusText);
    
    if (response.ok) {
      console.log('✅ Autenticación exitosa');
      const data = await response.json();
      console.log('📊 Datos recibidos:', data);
    } else {
      console.log('❌ Autenticación falló');
      
      if (response.status === 401) {
        console.log('🚫 Error 401: Token inválido o expirado');
      }
      
      try {
        const errorData = await response.json();
        console.log('💬 Mensaje de error:', errorData);
      } catch (e) {
        console.log('💬 No se pudo obtener mensaje de error');
      }
    }
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}

// 4. Verificar estado de la aplicación
console.log('\n📱 ===== ESTADO DE LA APLICACIÓN =====');
console.log('🌍 URL actual:', window.location.href);
console.log('🔗 API Base:', window.API_BASE || 'No definido');

// Verificar qué vista está activa
const views = ['welcome-view', 'login-view', 'register-view', 'select-pet-view', 'background'];
views.forEach(viewId => {
  const view = document.getElementById(viewId);
  if (view) {
    const isHidden = view.classList.contains('hidden');
    console.log(`👁️ ${viewId}:`, isHidden ? 'Oculta' : 'Visible');
  }
});

// Ejecutar prueba de autenticación
testAuth();

// 5. Función para regenerar token si es necesario
window.refreshToken = async function() {
  console.log('\n🔄 ===== REGENERACIÓN DE TOKEN =====');
  // Nota: Esto requeriría implementar un endpoint de refresh en el backend
  console.log('ℹ️ Esta funcionalidad requiere un endpoint de refresh token en el backend');
};

// 6. Función para limpiar sesión
window.clearSession = function() {
  console.log('\n🧹 ===== LIMPIAR SESIÓN =====');
  localStorage.removeItem('token');
  localStorage.removeItem('currentPetId');
  console.log('✅ Sesión limpiada');
  console.log('ℹ️ Recarga la página para aplicar cambios');
};

console.log('\n💡 Funciones disponibles:');
console.log('   - refreshToken() - Para regenerar token (no implementado)');
console.log('   - clearSession() - Para limpiar sesión y empezar de nuevo');
