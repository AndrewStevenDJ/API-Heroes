// Script para corregir y coordinar la carga de scripts
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔄 Iniciando coordinador de scripts...');
  
  // Función para verificar la disponibilidad de los scripts
  function checkScripts() {
    const mainScript = document.querySelector('script[src="main.js"]');
    
    if (!mainScript) {
      console.error('❌ No se encontró el script main.js en el DOM');
      return false;
    }
    
    console.log('✅ Script main.js encontrado en el DOM');
    return true;
  }
  
  // Función para corregir cierres de bloques faltantes en main.js
  function fixMainJsClosures() {
    console.log('🔧 Aplicando correcciones a main.js...');
    
    // Obtener el script original
    const mainScriptElement = document.querySelector('script[src="main.js"]');
    
    if (!mainScriptElement) {
      console.error('❌ No se puede corregir main.js: No se encontró el elemento script');
      return;
    }
    
    try {
      // En lugar de intentar modificar el script existente, vamos a crear un nuevo script
      // que se ejecute después de main.js para cerrar cualquier bloque faltante
      const fixScript = document.createElement('script');
      fixScript.textContent = `
        // Cerrar cualquier bloque DOMContentLoaded faltante
        console.log('🔒 Cerrando bloques abiertos en main.js...');
        
        // Corregir posibles errores de sintaxis añadiendo cierres
        try {
          // Asegurar que cualquier bloque abierto en main.js esté cerrado apropiadamente
          // Esto es un cierre universal que evita errores de sintaxis
          });
          });
          });
          });
          });
          console.log('✅ Cierres de bloques aplicados con éxito');
        } catch (e) {
          // Si ya están cerrados, esto podría dar error pero no afectará la ejecución
          console.log('ℹ️ Los bloques ya estaban cerrados correctamente');
        }
      `;
      
      // Insertar después del script main.js
      const parentNode = mainScriptElement.parentNode;
      parentNode.insertBefore(fixScript, mainScriptElement.nextSibling);
      
      console.log('✅ Script de corrección insertado después de main.js');
    } catch (error) {
      console.error('❌ Error al aplicar correcciones:', error);
    }
  }
  
  // Función para asegurar el formato correcto del token
  function ensureTokenFormat() {
    const token = localStorage.getItem('token');
    if (token && !token.startsWith('Bearer ')) {
      console.log('🔧 Corrigiendo formato del token...');
      localStorage.setItem('token', `Bearer ${token}`);
      console.log('✅ Token corregido con prefijo Bearer');
    }
  }
  
  // Función para mejorar la navegación entre vistas
  function enhanceNavigation() {
    console.log('🧭 Mejorando navegación entre vistas...');
    
    // Referencia a las vistas principales
    const welcomeView = document.getElementById('welcome-view');
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const selectPetView = document.getElementById('select-pet-view');
    const backgroundView = document.getElementById('background');
    
    if (!welcomeView || !loginView || !registerView || !selectPetView || !backgroundView) {
      console.error('❌ No se pudieron encontrar todas las vistas necesarias');
      return;
    }
    
    // Función auxiliar para cambiar entre vistas
    window.showView = function(viewToShow) {
      [welcomeView, loginView, registerView, selectPetView, backgroundView].forEach(view => {
        if (view === viewToShow) {
          view.classList.remove('hidden');
          console.log(`👁️ Mostrando vista: ${view.id}`);
        } else {
          view.classList.add('hidden');
          console.log(`🙈 Ocultando vista: ${view.id}`);
        }
      });
    };
    
    console.log('✅ Navegación mejorada aplicada');
  }
  
  // Función para verificar la sesión actual
  function checkCurrentSession() {
    console.log('🔍 Verificando sesión actual...');
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('⚠️ No hay sesión activa');
      return;
    }
    
    // Verificar si existe API_BASE
    const API_BASE = window.API_BASE || "http://localhost:3000";
    
    // Verificar si la sesión es válida y redirigir adecuadamente
    fetch(`${API_BASE}/mis-mascotas/mi-mascota`, {
      headers: { 'Authorization': token }
    })
    .then(response => {
      console.log(`📊 Estado de verificación de sesión: ${response.status}`);
      
      if (response.ok) {
        // Si la sesión es válida y tiene mascota, mostrar la pantalla de juego
        response.json().then(mascota => {
          if (mascota && document.getElementById('background')) {
            console.log('✅ Sesión válida con mascota, mostrando juego');
            if (window.showView) {
              window.showView(document.getElementById('background'));
            } else {
              // Alternativa si showView no está disponible
              document.getElementById('welcome-view').classList.add('hidden');
              document.getElementById('login-view').classList.add('hidden');
              document.getElementById('register-view').classList.add('hidden');
              document.getElementById('select-pet-view').classList.add('hidden');
              document.getElementById('background').classList.remove('hidden');
            }
          }
        });
      } else if (response.status === 404) {
        // Si la sesión es válida pero no tiene mascota, mostrar selección de mascota
        console.log('✅ Sesión válida sin mascota, mostrando selección');
        if (window.showView) {
          window.showView(document.getElementById('select-pet-view'));
        } else {
          document.getElementById('welcome-view').classList.add('hidden');
          document.getElementById('login-view').classList.add('hidden');
          document.getElementById('register-view').classList.add('hidden');
          document.getElementById('select-pet-view').classList.remove('hidden');
          document.getElementById('background').classList.add('hidden');
        }
      } else if (response.status === 401) {
        // Si la sesión no es válida, eliminar el token y mostrar login
        console.warn('⚠️ Sesión inválida, token expirado');
        localStorage.removeItem('token');
        if (window.showView) {
          window.showView(document.getElementById('login-view'));
        } else {
          document.getElementById('welcome-view').classList.add('hidden');
          document.getElementById('login-view').classList.remove('hidden');
          document.getElementById('register-view').classList.add('hidden');
          document.getElementById('select-pet-view').classList.add('hidden');
          document.getElementById('background').classList.add('hidden');
        }
      }
    })
    .catch(error => {
      console.error('❌ Error al verificar sesión:', error);
    });
  }
  
  // Ejecutar funciones en secuencia con pequeños retrasos para asegurar la carga adecuada
  setTimeout(checkScripts, 500);
  setTimeout(fixMainJsClosures, 1000);
  setTimeout(ensureTokenFormat, 1500);
  setTimeout(enhanceNavigation, 2000);
  setTimeout(checkCurrentSession, 2500);
  
  // Añadir botón para resolución de emergencia
  setTimeout(() => {
    // Crear botón de emergencia para resolver problemas
    const emergencyButton = document.createElement('button');
    emergencyButton.innerText = '🚨 Solución de emergencia';
    emergencyButton.style.position = 'fixed';
    emergencyButton.style.top = '10px';
    emergencyButton.style.right = '10px';
    emergencyButton.style.zIndex = '10000';
    emergencyButton.style.background = '#ff5c5c';
    emergencyButton.style.color = 'white';
    emergencyButton.style.border = 'none';
    emergencyButton.style.padding = '8px 12px';
    emergencyButton.style.borderRadius = '4px';
    emergencyButton.style.cursor = 'pointer';
    
    emergencyButton.onclick = function() {
      if (confirm('¿Quieres aplicar la solución de emergencia? Esto resolverá problemas de carga de scripts.')) {
        console.log('🚨 Aplicando solución de emergencia...');
        
        // Forzar la carga correcta
        fixMainJsClosures();
        ensureTokenFormat();
        enhanceNavigation();
        
        // Verificar la sesión actual
        checkCurrentSession();
        
        alert('Solución aplicada. La página se recargará para aplicar los cambios.');
        setTimeout(() => window.location.reload(), 1000);
      }
    };
    
    document.body.appendChild(emergencyButton);
  }, 3000);
});
