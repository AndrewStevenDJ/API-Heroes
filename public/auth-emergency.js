// Script específicamente diseñado para corregir el problema de iniciar sesión
// Este script se ejecuta en último lugar para asegurarse de que todas las demás correcciones
// ya se han aplicado correctamente

document.addEventListener('DOMContentLoaded', function() {
  // Esperar a que todo lo demás esté cargado
  setTimeout(() => {
    console.log('🔒 Corrector de autenticación avanzado iniciado...');
    
    // Referencias a las vistas
    const welcomeView = document.getElementById('welcome-view');
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const selectPetView = document.getElementById('select-pet-view');
    const backgroundView = document.getElementById('background');
    
    // 1. Solución para los formularios de login y registro
    const fixLoginForm = () => {
      const loginForm = document.getElementById('login-form');
      if (!loginForm) return;
      
      console.log('🔧 Reemplazando manejador de eventos del formulario de login...');
      
      // Reemplazar el handler del formulario de login
      loginForm.onsubmit = async function(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        const loginMessage = document.getElementById('login-message');
        
        if (!username || !password) {
          loginMessage.textContent = 'Por favor, completa todos los campos';
          loginMessage.style.color = 'red';
          return;
        }
        
        loginMessage.textContent = 'Conectando...';
        loginMessage.style.color = 'blue';
        
        // Usar la API_BASE definida globalmente o usar un valor por defecto
        const API_BASE = window.API_BASE || "http://localhost:3000";
        console.log(`🔄 Iniciando sesión en: ${API_BASE}/auth/login`);
        
        try {
          const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          
          console.log('📊 Status de respuesta de login:', res.status);
          
          // Si la respuesta es exitosa, procesar datos
          if (res.ok) {
            const data = await res.json();
            
            if (data && data.token) {
              loginMessage.textContent = '¡Inicio de sesión exitoso!';
              loginMessage.style.color = 'green';
              
              // Asegurarse que el token tenga el formato correcto
              const tokenWithBearer = data.token.startsWith('Bearer ') 
                ? data.token 
                : `Bearer ${data.token}`;
              
              // Guardar token en localStorage
              localStorage.setItem('token', tokenWithBearer);
              console.log('💾 Token guardado correctamente');
              
              // Guardar userId si está disponible
              if (data.userId) {
                localStorage.setItem('userId', data.userId);
              }
              
              // Verificar si el usuario ya tiene una mascota
              console.log('🔍 Verificando si el usuario ya tiene mascota...');
              const petRes = await fetch(`${API_BASE}/mis-mascotas/mi-mascota`, {
                headers: {
                  'Authorization': tokenWithBearer
                }
              });
              
              console.log('📊 Status de respuesta de mascota:', petRes.status);
              
              // REDIRECCIONAMIENTO FORZADO:
              // Este es el punto crítico donde estamos asegurando que la navegación se
              // realice correctamente según si el usuario tiene o no mascota
              if (petRes.ok) {
                // El usuario ya tiene mascota, mostrar pantalla de juego
                const mascota = await petRes.json();
                console.log('✅ Mascota encontrada, mostrando juego');
                
                // Guardar ID de mascota
                if (mascota && mascota._id) {
                  localStorage.setItem('currentPetId', mascota._id);
                }
                
                // IMPORTANTE: Ocultar todas las vistas excepto el fondo de juego
                welcomeView.classList.add('hidden');
                loginView.classList.add('hidden');
                registerView.classList.add('hidden');
                selectPetView.classList.add('hidden');
                backgroundView.classList.remove('hidden');
                
                // Mostrar la mascota en pantalla
                const petSvgGame = document.getElementById('pet-svg-game');
                if (petSvgGame && mascota.svg) {
                  petSvgGame.innerHTML = mascota.svg;
                  // Activar animación si existe la función
                  setTimeout(() => {
                    if (typeof animarParpadeo === 'function') {
                      animarParpadeo();
                    }
                  }, 500);
                }
                
                // Iniciar actualización de estado si existe la función
                if (typeof iniciarActualizacionEstado === 'function') {
                  setTimeout(iniciarActualizacionEstado, 1000);
                }
                
              } else if (petRes.status === 404) {
                // El usuario no tiene mascota, mostrar pantalla de selección
                console.log('ℹ️ Usuario autenticado sin mascota, mostrando selección');
                
                // IMPORTANTE: Ocultar todas las vistas excepto selección de mascota
                welcomeView.classList.add('hidden');
                loginView.classList.add('hidden');
                registerView.classList.add('hidden');
                backgroundView.classList.add('hidden');
                selectPetView.classList.remove('hidden');
                
                // Cargar mascotas disponibles si existe la función
                if (typeof cargarMascotasDisponibles === 'function') {
                  setTimeout(cargarMascotasDisponibles, 500);
                }
              } else {
                // Problema con la autenticación
                console.warn('⚠️ Problema verificando mascota:', petRes.status);
                alert('Ocurrió un problema al verificar tu información. Por favor, intenta de nuevo.');
              }
            } else {
              loginMessage.textContent = 'Formato de respuesta inválido';
              loginMessage.style.color = 'red';
            }
          } else {
            // Si hay error en el login
            const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }));
            loginMessage.textContent = errorData.error || 'Usuario o contraseña incorrectos';
            loginMessage.style.color = 'red';
          }
        } catch (error) {
          console.error('❌ Error en login:', error);
          loginMessage.textContent = 'Error de conexión. Intenta más tarde.';
          loginMessage.style.color = 'red';
        }
      };
    };
    
    // 2. Botón de emergencia para redirigir directamente
    const addEmergencyLoginButton = () => {
      const existingButton = document.getElementById('emergency-login-button');
      if (existingButton) return;
      
      console.log('➕ Añadiendo botón de login de emergencia...');
      
      const button = document.createElement('button');
      button.id = 'emergency-login-button';
      button.textContent = '🚪 Acceso de Emergencia';
      button.style.position = 'fixed';
      button.style.top = '50px';
      button.style.right = '10px';
      button.style.zIndex = '9999';
      button.style.padding = '5px 10px';
      button.style.backgroundColor = '#4CAF50';
      button.style.color = 'white';
      button.style.border = 'none';
      button.style.borderRadius = '4px';
      
      button.onclick = async () => {
        const username = prompt('Ingresa tu nombre de usuario:');
        if (!username) return;
        
        const password = prompt('Ingresa tu contraseña:');
        if (!password) return;
        
        try {
          const API_BASE = window.API_BASE || "http://localhost:3000";
          
          // Intentar login directo
          const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          
          if (res.ok) {
            const data = await res.json();
            if (data.token) {
              // Guardar token con formato correcto
              const tokenWithBearer = data.token.startsWith('Bearer ') 
                ? data.token 
                : `Bearer ${data.token}`;
              
              localStorage.setItem('token', tokenWithBearer);
              
              // Forzar vista de juego o selección de mascota
              const petRes = await fetch(`${API_BASE}/mis-mascotas/mi-mascota`, {
                headers: {
                  'Authorization': tokenWithBearer
                }
              });
              
              if (petRes.ok) {
                // Mostrar juego directamente
                welcomeView.classList.add('hidden');
                loginView.classList.add('hidden');
                registerView.classList.add('hidden');
                selectPetView.classList.add('hidden');
                backgroundView.classList.remove('hidden');
                
                alert('¡Acceso de emergencia exitoso! Ahora verás tu mascota.');
                
                // Recargar la página para aplicar todos los cambios
                setTimeout(() => window.location.reload(), 1000);
              } else {
                // Mostrar selección de mascota
                welcomeView.classList.add('hidden');
                loginView.classList.add('hidden');
                registerView.classList.add('hidden');
                backgroundView.classList.add('hidden');
                selectPetView.classList.remove('hidden');
                
                alert('¡Acceso de emergencia exitoso! Por favor, selecciona una mascota.');
              }
            } else {
              alert('Error en el formato de la respuesta.');
            }
          } else {
            alert('Credenciales incorrectas o error de servidor.');
          }
        } catch (error) {
          console.error('Error en acceso de emergencia:', error);
          alert('Error de conexión al intentar acceder.');
        }
      };
      
      document.body.appendChild(button);
    };
    
    // Ejecutar todas las correcciones
    fixLoginForm();
    addEmergencyLoginButton();
    
    console.log('✅ Corrector de autenticación completado');
  }, 3000); // Dar tiempo a que todo lo demás se cargue
});
