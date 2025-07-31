// Script para verificar la conectividad con la API
document.addEventListener('DOMContentLoaded', function() {
  console.log('🌐 Verificando conectividad con la API...');
  
  // Función para probar la conectividad con la API
  async function checkApiConnectivity() {
    try {
      // Obtener la URL base de la API
      const apiBase = window.API_BASE || (window.location.hostname.includes('localhost')
        ? "http://localhost:3000"
        : "https://api-heroes-2lw9.onrender.com");
      
      console.log(`🔗 URL base de la API: ${apiBase}`);
      
      // Intenta una solicitud simple para verificar conectividad
      const startTime = performance.now();
      const response = await fetch(`${apiBase}/auth/login`, {
        method: 'OPTIONS',
        headers: { 'Content-Type': 'application/json' },
      }).catch(error => {
        // Si falla, intentar una ruta alternativa
        console.log(`⚠️ Error al conectar con /auth/login: ${error.message}. Probando ruta alternativa...`);
        return fetch(`${apiBase}/`, {
          method: 'HEAD',
          headers: { 'Content-Type': 'application/json' },
        });
      });
      
      const endTime = performance.now();
      const timeElapsed = (endTime - startTime).toFixed(2);
      
      if (response.ok) {
        console.log(`✅ Conexión exitosa a la API (${timeElapsed}ms). Status: ${response.status}`);
        return true;
      } else {
        console.error(`❌ Error de conexión a la API. Status: ${response.status}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error al verificar la API: ${error.message}`);
      return false;
    }
  }
  
  // Verificar rutas específicas de la API
  async function checkAuthEndpoints() {
    try {
      // Obtener la URL base de la API
      const apiBase = window.API_BASE || (window.location.hostname.includes('localhost')
        ? "http://localhost:3000"
        : "https://api-heroes-2lw9.onrender.com");
      
      // Datos de prueba
      const testCredentials = {
        username: "test_user_" + Math.floor(Math.random() * 10000),
        password: "password123"
      };
      
      console.log(`🔍 Probando endpoints de autenticación con usuario de prueba: ${testCredentials.username}`);
      
      // Probar registro
      console.log(`🔗 Probando registro: ${apiBase}/auth/register`);
      const registerResponse = await fetch(`${apiBase}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testCredentials)
      });
      
      console.log(`📊 Respuesta de registro - Status: ${registerResponse.status}`);
      
      // Probar login (independientemente si el registro fue exitoso)
      console.log(`🔗 Probando login: ${apiBase}/auth/login`);
      const loginResponse = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testCredentials)
      });
      
      console.log(`📊 Respuesta de login - Status: ${loginResponse.status}`);
      
      return {
        registerStatus: registerResponse.status,
        loginStatus: loginResponse.status
      };
    } catch (error) {
      console.error(`❌ Error al verificar endpoints de autenticación: ${error.message}`);
      return {
        error: error.message
      };
    }
  }
  
  // Ejecutar las verificaciones
  setTimeout(async function() {
    const isConnected = await checkApiConnectivity();
    console.log(`🌐 Estado de la API: ${isConnected ? 'Conectada' : 'No disponible'}`);
    
    if (isConnected) {
      const authStatus = await checkAuthEndpoints();
      console.log('📝 Resultado de verificación de endpoints de autenticación:', authStatus);
    }
  }, 2000);
});
