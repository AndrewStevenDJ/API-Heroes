// Script para arreglar el manejo de formularios y navegación
console.log('📝 Arreglando manejo de formularios y navegación...');

document.addEventListener('DOMContentLoaded', function() {
  // PRIMERO: Configurar navegación de botones
  const btnRegister = document.getElementById('btn-register');
  const btnLogin = document.getElementById('btn-login');
  const welcomeView = document.getElementById('welcome-view');
  const registerView = document.getElementById('register-view');
  const loginView = document.getElementById('login-view');
  
  console.log('Elementos de navegación encontrados:');
  console.log('- btnRegister:', btnRegister);
  console.log('- btnLogin:', btnLogin);
  console.log('- welcomeView:', welcomeView);
  console.log('- registerView:', registerView);
  console.log('- loginView:', loginView);
  
  // Configurar botones de navegación
  if (btnRegister) {
    console.log('✅ Configurando botón de registro');
    btnRegister.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('🖱️ Click en botón de registro');
      
      if (welcomeView) welcomeView.classList.add('hidden');
      if (registerView) registerView.classList.remove('hidden');
      if (loginView) loginView.classList.add('hidden');
    });
  }
  
  if (btnLogin) {
    console.log('✅ Configurando botón de login');
    btnLogin.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('🖱️ Click en botón de login');
      
      if (welcomeView) welcomeView.classList.add('hidden');
      if (loginView) loginView.classList.remove('hidden');
      if (registerView) registerView.classList.add('hidden');
    });
  }
  
  // Links para cambiar entre formularios
  const goLogin = document.getElementById('go-login');
  const goRegister = document.getElementById('go-register');
  const backToWelcome1 = document.getElementById('back-to-welcome1');
  const backToWelcome2 = document.getElementById('back-to-welcome2');
  
  if (goLogin) {
    goLogin.addEventListener('click', function(e) {
      e.preventDefault();
      if (registerView) registerView.classList.add('hidden');
      if (loginView) loginView.classList.remove('hidden');
    });
  }
  
  if (goRegister) {
    goRegister.addEventListener('click', function(e) {
      e.preventDefault();
      if (loginView) loginView.classList.add('hidden');
      if (registerView) registerView.classList.remove('hidden');
    });
  }
  
  if (backToWelcome1) {
    backToWelcome1.addEventListener('click', function(e) {
      e.preventDefault();
      if (registerView) registerView.classList.add('hidden');
      if (loginView) loginView.classList.add('hidden');
      if (welcomeView) welcomeView.classList.remove('hidden');
    });
  }
  
  if (backToWelcome2) {
    backToWelcome2.addEventListener('click', function(e) {
      e.preventDefault();
      if (registerView) registerView.classList.add('hidden');
      if (loginView) loginView.classList.add('hidden');
      if (welcomeView) welcomeView.classList.remove('hidden');
    });
  }
  
  // SEGUNDO: Configurar formularios
  const registerForm = document.getElementById('register-form');
  const loginForm = document.getElementById('login-form');
  const registerMessage = document.getElementById('register-message');
  const loginMessage = document.getElementById('login-message');
  
  console.log('Formularios encontrados:');
  console.log('- registerForm:', registerForm);
  console.log('- loginForm:', loginForm);
  console.log('- registerMessage:', registerMessage);
  console.log('- loginMessage:', loginMessage);
  
  // Arreglar formulario de registro
  if (registerForm && registerMessage) {
    console.log('✅ Configurando formulario de registro');
    
    // Remover cualquier event listener existente y agregar uno nuevo
    const newRegisterForm = registerForm.cloneNode(true);
    registerForm.parentNode.replaceChild(newRegisterForm, registerForm);
    
    // Obtener referencias actualizadas
    const updatedRegisterMessage = document.getElementById('register-message');
    
    newRegisterForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('📝 Procesando registro...');
      updatedRegisterMessage.textContent = 'Registrando...';
      updatedRegisterMessage.style.color = 'blue';
      
      const username = document.getElementById('register-username').value.trim();
      const password = document.getElementById('register-password').value;
      
      // Validación básica
      if (!username || username.length < 3) {
        updatedRegisterMessage.textContent = 'El nombre de usuario debe tener al menos 3 caracteres';
        updatedRegisterMessage.style.color = 'red';
        return;
      }
      
      if (!password || password.length < 6) {
        updatedRegisterMessage.textContent = 'La contraseña debe tener al menos 6 caracteres';
        updatedRegisterMessage.style.color = 'red';
        return;
      }
      
      try {
        const API_BASE = window.API_BASE || 'http://localhost:3000';
        console.log(`🔗 Enviando registro a: ${API_BASE}/auth/register`);
        
        const response = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        
        console.log('📡 Respuesta del servidor:', response.status, response.statusText);
        
        let data;
        try {
          data = await response.json();
          console.log('📄 Datos de respuesta:', data);
        } catch (jsonError) {
          console.error('❌ Error al procesar JSON:', jsonError);
          const textResponse = await response.text();
          console.log('📄 Respuesta como texto:', textResponse);
          data = { error: textResponse || 'Error en el formato de respuesta' };
        }
        
        if (response.status === 201 || response.ok) {
          console.log('✅ Registro exitoso');
          updatedRegisterMessage.textContent = '¡Registro exitoso! Redirigiendo...';
          updatedRegisterMessage.style.color = 'green';
          
          // Ir a la selección de mascota
          setTimeout(() => {
            const registerView = document.getElementById('register-view');
            const selectPetView = document.getElementById('select-pet-view');
            
            if (registerView) registerView.classList.add('hidden');
            if (selectPetView) selectPetView.classList.remove('hidden');
          }, 1500);
          
        } else {
          console.log('⚠️ Error en registro:', data);
          let errorMessage = 'Error en el registro';
          
          if (data.error) {
            errorMessage = data.error;
          } else if (data.message) {
            errorMessage = data.message;
          } else if (response.status === 409) {
            errorMessage = 'Este nombre de usuario ya está registrado. Por favor, elige otro.';
          } else if (response.status === 400) {
            errorMessage = 'Datos de registro inválidos. Verifica tu información.';
          }
          
          updatedRegisterMessage.textContent = errorMessage;
          updatedRegisterMessage.style.color = 'red';
          
          // NO redirigir, mantener al usuario en el formulario
          console.log('🚫 Manteniendo al usuario en el formulario de registro para corregir el error');
        }
        
      } catch (error) {
        console.error('❌ Error de conexión:', error);
        updatedRegisterMessage.textContent = 'Error de conexión con el servidor. Intenta de nuevo.';
        updatedRegisterMessage.style.color = 'red';
      }
    });
  }
  
  // Arreglar formulario de login
  if (loginForm && loginMessage) {
    console.log('✅ Configurando formulario de login');
    
    // Remover cualquier event listener existente y agregar uno nuevo
    const newLoginForm = loginForm.cloneNode(true);
    loginForm.parentNode.replaceChild(newLoginForm, loginForm);
    
    // Obtener referencias actualizadas
    const updatedLoginMessage = document.getElementById('login-message');
    
    newLoginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('🔐 Procesando login...');
      updatedLoginMessage.textContent = 'Iniciando sesión...';
      updatedLoginMessage.style.color = 'blue';
      
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value;
      
      if (!username || !password) {
        updatedLoginMessage.textContent = 'Por favor, completa todos los campos';
        updatedLoginMessage.style.color = 'red';
        return;
      }
      
      try {
        const API_BASE = window.API_BASE || 'http://localhost:3000';
        console.log(`🔗 Enviando login a: ${API_BASE}/auth/login`);
        
        const response = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        
        console.log('📡 Respuesta del servidor:', response.status, response.statusText);
        
        let data;
        try {
          data = await response.json();
          console.log('📄 Datos de respuesta:', data);
        } catch (jsonError) {
          console.error('❌ Error al procesar JSON:', jsonError);
          data = { error: 'Error en el formato de respuesta' };
        }
        
        if (response.ok && data.token) {
          console.log('✅ Login exitoso');
          updatedLoginMessage.textContent = '¡Login exitoso! Redirigiendo...';
          updatedLoginMessage.style.color = 'green';
          
          // Guardar token
          localStorage.setItem('token', data.token);
          
          // Ir al juego
          setTimeout(() => {
            const loginView = document.getElementById('login-view');
            const background = document.getElementById('background');
            const welcomeView = document.getElementById('welcome-view');
            
            if (loginView) loginView.classList.add('hidden');
            if (welcomeView) welcomeView.classList.add('hidden');
            if (background) background.classList.remove('hidden');
          }, 1500);
          
        } else {
          console.log('⚠️ Error en login:', data);
          let errorMessage = 'Credenciales incorrectas';
          
          if (data.error) {
            errorMessage = data.error;
          } else if (data.message) {
            errorMessage = data.message;
          } else if (response.status === 401) {
            errorMessage = 'Usuario o contraseña incorrectos';
          } else if (response.status === 404) {
            errorMessage = 'Usuario no encontrado';
          }
          
          updatedLoginMessage.textContent = errorMessage;
          updatedLoginMessage.style.color = 'red';
          
          // NO redirigir, mantener al usuario en el formulario
          console.log('🚫 Manteniendo al usuario en el formulario de login para corregir el error');
        }
        
      } catch (error) {
        console.error('❌ Error de conexión:', error);
        updatedLoginMessage.textContent = 'Error de conexión con el servidor. Intenta de nuevo.';
        updatedLoginMessage.style.color = 'red';
      }
    });
  }
});
