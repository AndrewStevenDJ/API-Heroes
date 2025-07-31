// Script para verificar y corregir problemas comunes con la API
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔌 API-Test: Iniciando diagnóstico de conexión');
  
  // Configurar un panel de diagnóstico en la interfaz
  function createDiagnosticsPanel() {
    // Crear el panel si no existe
    if (!document.getElementById('diagnostics-panel')) {
      const panel = document.createElement('div');
      panel.id = 'diagnostics-panel';
      panel.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        width: 300px;
        max-height: 200px;
        background-color: rgba(0, 0, 0, 0.8);
        color: #00ff00;
        font-family: monospace;
        padding: 10px;
        border-radius: 5px;
        font-size: 12px;
        overflow-y: auto;
        z-index: 9999;
        display: none;
      `;
      
      // Agregar botón para cerrar
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'X';
      closeBtn.style.cssText = `
        position: absolute;
        top: 5px;
        right: 5px;
        background: none;
        border: none;
        color: white;
        cursor: pointer;
      `;
      closeBtn.onclick = () => panel.style.display = 'none';
      
      // Agregar título
      const title = document.createElement('div');
      title.textContent = 'Diagnóstico de WhiBlu';
      title.style.fontWeight = 'bold';
      title.style.marginBottom = '10px';
      
      // Agregar contenedor para mensajes
      const messagesContainer = document.createElement('div');
      messagesContainer.id = 'diagnostics-messages';
      
      // Ensamblar el panel
      panel.appendChild(closeBtn);
      panel.appendChild(title);
      panel.appendChild(messagesContainer);
      document.body.appendChild(panel);
      
      // Crear botón para mostrar el panel
      const showButton = document.createElement('button');
      showButton.textContent = '🛠️';
      showButton.title = 'Ver diagnóstico';
      showButton.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        width: 30px;
        height: 30px;
        background-color: #333;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 16px;
        cursor: pointer;
        z-index: 9998;
      `;
      showButton.onclick = () => {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      };
      
      document.body.appendChild(showButton);
    }
    
    return document.getElementById('diagnostics-messages');
  }
  
  // Añadir mensaje al panel
  function addDiagnosticMessage(message, type = 'info') {
    const messagesContainer = createDiagnosticsPanel();
    const messageEl = document.createElement('div');
    messageEl.textContent = message;
    
    // Estilo según tipo de mensaje
    switch (type) {
      case 'error':
        messageEl.style.color = '#ff5555';
        break;
      case 'success':
        messageEl.style.color = '#55ff55';
        break;
      case 'warning':
        messageEl.style.color = '#ffff55';
        break;
      default:
        messageEl.style.color = '#55ffff';
    }
    
    messagesContainer.appendChild(messageEl);
    
    // Mostrar el panel
    const panel = document.getElementById('diagnostics-panel');
    panel.style.display = 'block';
    
    // Scroll al final
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  // Verificar conectividad con el backend
  async function testApiConnection() {
    try {
      // Obtener la URL base
      const apiBase = window.API_BASE || (window.location.hostname.includes('localhost')
        ? "http://localhost:3000"
        : "https://api-heroes-2lw9.onrender.com");
      
      addDiagnosticMessage(`Probando API en: ${apiBase}`, 'info');
      
      // Intentar una petición simple
      const startTime = Date.now();
      const response = await fetch(`${apiBase}/auth/login`, {
        method: 'OPTIONS',
        headers: { 'Content-Type': 'application/json' }
      }).catch(async error => {
        addDiagnosticMessage(`Error en /auth/login: ${error.message}`, 'error');
        
        // Intentar otra ruta como fallback
        const fallbackResponse = await fetch(`${apiBase}/`, {
          method: 'HEAD'
        }).catch(e => null);
        
        return fallbackResponse;
      });
      
      const elapsed = Date.now() - startTime;
      
      if (response && response.ok) {
        addDiagnosticMessage(`✅ API conectada (${elapsed}ms)`, 'success');
        return true;
      } else {
        addDiagnosticMessage(`❌ Error al conectar con API: ${response?.status || 'Error de red'}`, 'error');
        return false;
      }
    } catch (error) {
      addDiagnosticMessage(`❌ Error de conexión: ${error.message}`, 'error');
      return false;
    }
  }
  
  // Verificar funcionamiento de autenticación
  async function testAuthEndpoints() {
    try {
      const apiBase = window.API_BASE || (window.location.hostname.includes('localhost')
        ? "http://localhost:3000"
        : "https://api-heroes-2lw9.onrender.com");
      
      addDiagnosticMessage('Probando endpoints de autenticación', 'info');
      
      // Datos de prueba
      const username = `test_${Math.floor(Math.random() * 10000)}`;
      const password = 'test123456';
      
      // Probar registro
      try {
        addDiagnosticMessage(`Intentando registro con: ${username}`, 'info');
        
        const regResponse = await fetch(`${apiBase}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        
        if (regResponse.ok) {
          addDiagnosticMessage('✅ Registro exitoso', 'success');
        } else {
          addDiagnosticMessage(`⚠️ Registro fallido: ${regResponse.status}`, 'warning');
        }
      } catch (regError) {
        addDiagnosticMessage(`❌ Error en registro: ${regError.message}`, 'error');
      }
      
      // Probar login
      try {
        addDiagnosticMessage(`Intentando login con: ${username}`, 'info');
        
        const loginResponse = await fetch(`${apiBase}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        
        if (loginResponse.ok) {
          addDiagnosticMessage('✅ Login exitoso', 'success');
        } else {
          addDiagnosticMessage(`⚠️ Login fallido: ${loginResponse.status}`, 'warning');
        }
      } catch (loginError) {
        addDiagnosticMessage(`❌ Error en login: ${loginError.message}`, 'error');
      }
    } catch (error) {
      addDiagnosticMessage(`❌ Error en pruebas de autenticación: ${error.message}`, 'error');
    }
  }
  
  // Esperar un poco para asegurarnos de que la página está cargada
  setTimeout(() => {
    // Crear panel y mostrar mensaje de inicio
    addDiagnosticMessage('🔍 Iniciando diagnóstico...', 'info');
    
    // Ejecutar pruebas
    testApiConnection().then(isConnected => {
      if (isConnected) {
        testAuthEndpoints();
      }
    });
    
    // Exponer funciones en window para uso desde consola
    window.testApi = {
      testConnection: testApiConnection,
      testAuth: testAuthEndpoints,
      showDiagnostics: () => {
        document.getElementById('diagnostics-panel').style.display = 'block';
      },
      hideDiagnostics: () => {
        document.getElementById('diagnostics-panel').style.display = 'none';
      }
    };
    
    addDiagnosticMessage('💡 Consejo: Usa window.testApi para diagnóstico manual', 'info');
  }, 2000);
});
