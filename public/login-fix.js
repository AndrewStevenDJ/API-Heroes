// Script de emergencia para arreglar el login
(function() {
  console.log('🔑 Aplicando solución de emergencia para el login...');
  
  // Escuchar el formulario de login
  document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      console.log('📝 Formulario de login encontrado, aplicando fix...');
      
      // Sobrescribir el evento submit
      loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const message = document.getElementById('login-message');
        
        if (message) message.textContent = 'Iniciando sesión...';
        
        console.log(`🔒 Intentando login con usuario: ${username}`);
        
        // Hacer la petición a la API
        fetch(`${window.API_BASE || 'http://localhost:3000'}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        })
        .then(response => response.json())
        .then(data => {
          if (data.token) {
            console.log('✅ Login exitoso, token recibido');
            
            // Guardar el token en localStorage
            localStorage.setItem('token', data.token);
            
            // Mostrar mensaje de éxito
            if (message) message.textContent = '¡Login exitoso!';
            message.style.color = 'green';
            
            // Forzar la navegación al juego inmediatamente
            const background = document.getElementById('background');
            const welcomeView = document.getElementById('welcome-view');
            const loginView = document.getElementById('login-view');
            
            if (background && welcomeView && loginView) {
              console.log('🎮 Redirigiendo al juego...');
              
              background.classList.remove('hidden');
              welcomeView.classList.add('hidden');
              loginView.classList.add('hidden');
              
              // Forzar una recarga de la mascota
              setTimeout(() => {
                fetch(`${window.API_BASE || 'http://localhost:3000'}/mis-mascotas/mi-mascota`, {
                  headers: { 'Authorization': `Bearer ${data.token}` }
                })
                .then(res => res.json())
                .then(mascota => {
                  console.log('🐶 Mascota cargada correctamente');
                  
                  // Renderizar la mascota
                  const petSvgGame = document.getElementById('pet-svg-game');
                  if (petSvgGame && mascota.svg) {
                    petSvgGame.innerHTML = mascota.svg;
                    
                    // Hacer visible el contenedor de la mascota
                    const petContainer = document.getElementById('pet-container');
                    if (petContainer) {
                      petContainer.style.display = 'block';
                      petContainer.style.position = 'relative';
                      petContainer.style.zIndex = '10';
                      petContainer.style.opacity = '1';
                      petContainer.style.visibility = 'visible';
                    }
                  }
                })
                .catch(error => console.error('Error cargando mascota:', error));
              }, 500);
            }
          } else {
            console.error('❌ Error en login:', data.message || 'Error desconocido');
            if (message) {
              message.textContent = data.message || 'Error en el inicio de sesión';
              message.style.color = 'red';
            }
          }
        })
        .catch(error => {
          console.error('❌ Error de red:', error);
          if (message) {
            message.textContent = 'Error de conexión';
            message.style.color = 'red';
          }
        });
      });
    }
  });
})();
