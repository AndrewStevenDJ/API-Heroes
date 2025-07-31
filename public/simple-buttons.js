// Script simple para test de botones
console.log('🧪 Test simple de botones iniciado');

// Ejecutar inmediatamente sin esperar DOMContentLoaded
setTimeout(() => {
  console.log('🔍 Buscando botones...');
  
  const btnRegister = document.getElementById('btn-register');
  const btnLogin = document.getElementById('btn-login');
  
  console.log('Botones encontrados:');
  console.log('- btnRegister:', btnRegister);
  console.log('- btnLogin:', btnLogin);
  
  if (btnRegister) {
    console.log('✅ Agregando listener a registro');
    btnRegister.onclick = function() {
      console.log('🖱️ CLICK REGISTRO!');
      const welcomeView = document.getElementById('welcome-view');
      const registerView = document.getElementById('register-view');
      const loginView = document.getElementById('login-view');
      
      console.log('Elementos encontrados:');
      console.log('- welcomeView:', welcomeView);
      console.log('- registerView:', registerView);
      console.log('- loginView:', loginView);
      
      // Ocultar welcome y login
      if (welcomeView) {
        welcomeView.style.display = 'none';
        welcomeView.classList.add('hidden');
        console.log('✅ Welcome ocultado');
      }
      if (loginView) {
        loginView.style.display = 'none';
        loginView.classList.add('hidden');
        console.log('✅ Login ocultado');
      }
      
      // Mostrar registro
      if (registerView) {
        registerView.style.display = 'flex';
        registerView.style.flexDirection = 'column';
        registerView.style.alignItems = 'center';
        registerView.style.justifyContent = 'center';
        registerView.style.width = '100%';
        registerView.style.height = '100vh';
        registerView.style.position = 'fixed';
        registerView.style.top = '0';
        registerView.style.left = '0';
        registerView.style.backgroundColor = '#f5f5f5';
        registerView.classList.remove('hidden');
        console.log('✅ Register mostrado');
      }
    };
  }
  
  if (btnLogin) {
    console.log('✅ Agregando listener a login');
    btnLogin.onclick = function() {
      console.log('🖱️ CLICK LOGIN!');
      const welcomeView = document.getElementById('welcome-view');
      const registerView = document.getElementById('register-view');
      const loginView = document.getElementById('login-view');
      
      console.log('Elementos encontrados:');
      console.log('- welcomeView:', welcomeView);
      console.log('- registerView:', registerView);
      console.log('- loginView:', loginView);
      
      // Ocultar welcome y register
      if (welcomeView) {
        welcomeView.style.display = 'none';
        welcomeView.classList.add('hidden');
        console.log('✅ Welcome ocultado');
      }
      if (registerView) {
        registerView.style.display = 'none';
        registerView.classList.add('hidden');
        console.log('✅ Register ocultado');
      }
      
      // Mostrar login
      if (loginView) {
        loginView.style.display = 'flex';
        loginView.style.flexDirection = 'column';
        loginView.style.alignItems = 'center';
        loginView.style.justifyContent = 'center';
        loginView.style.width = '100%';
        loginView.style.height = '100vh';
        loginView.style.position = 'fixed';
        loginView.style.top = '0';
        loginView.style.left = '0';
        loginView.style.backgroundColor = '#f5f5f5';
        loginView.classList.remove('hidden');
        console.log('✅ Login mostrado');
      }
    };
  }
}, 500);

// También intentar con DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM cargado, configurando botones otra vez...');
  
  const btnRegister = document.getElementById('btn-register');
  const btnLogin = document.getElementById('btn-login');
  
  if (btnRegister && !btnRegister.onclick) {
    btnRegister.onclick = function() {
      console.log('🖱️ CLICK REGISTRO (DOM)!');
      const welcomeView = document.getElementById('welcome-view');
      const registerView = document.getElementById('register-view');
      const loginView = document.getElementById('login-view');
      
      if (welcomeView) {
        welcomeView.style.display = 'none';
        welcomeView.classList.add('hidden');
      }
      if (loginView) {
        loginView.style.display = 'none';
        loginView.classList.add('hidden');
      }
      if (registerView) {
        registerView.style.display = 'flex';
        registerView.style.flexDirection = 'column';
        registerView.style.alignItems = 'center';
        registerView.style.justifyContent = 'center';
        registerView.style.width = '100%';
        registerView.style.height = '100vh';
        registerView.style.position = 'fixed';
        registerView.style.top = '0';
        registerView.style.left = '0';
        registerView.style.backgroundColor = '#f5f5f5';
        registerView.classList.remove('hidden');
      }
    };
  }
  
  if (btnLogin && !btnLogin.onclick) {
    btnLogin.onclick = function() {
      console.log('🖱️ CLICK LOGIN (DOM)!');
      const welcomeView = document.getElementById('welcome-view');
      const registerView = document.getElementById('register-view');
      const loginView = document.getElementById('login-view');
      
      if (welcomeView) {
        welcomeView.style.display = 'none';
        welcomeView.classList.add('hidden');
      }
      if (registerView) {
        registerView.style.display = 'none';
        registerView.classList.add('hidden');
      }
      if (loginView) {
        loginView.style.display = 'flex';
        loginView.style.flexDirection = 'column';
        loginView.style.alignItems = 'center';
        loginView.style.justifyContent = 'center';
        loginView.style.width = '100%';
        loginView.style.height = '100vh';
        loginView.style.position = 'fixed';
        loginView.style.top = '0';
        loginView.style.left = '0';
        loginView.style.backgroundColor = '#f5f5f5';
        loginView.classList.remove('hidden');
      }
    };
  }
  
  // Agregar botones de "Volver" para poder regresar a la pantalla de bienvenida
  setTimeout(() => {
    const backToWelcome1 = document.getElementById('back-to-welcome1');
    const backToWelcome2 = document.getElementById('back-to-welcome2');
    
    if (backToWelcome1) {
      backToWelcome1.onclick = function(e) {
        e.preventDefault();
        console.log('🔙 Volviendo a bienvenida desde registro');
        
        const welcomeView = document.getElementById('welcome-view');
        const registerView = document.getElementById('register-view');
        const loginView = document.getElementById('login-view');
        
        if (registerView) {
          registerView.style.display = 'none';
          registerView.classList.add('hidden');
        }
        if (loginView) {
          loginView.style.display = 'none';
          loginView.classList.add('hidden');
        }
        if (welcomeView) {
          welcomeView.style.display = 'flex';
          welcomeView.style.flexDirection = 'column';
          welcomeView.style.alignItems = 'center';
          welcomeView.style.justifyContent = 'center';
          welcomeView.style.width = '100%';
          welcomeView.style.height = '100vh';
          welcomeView.style.position = 'fixed';
          welcomeView.style.top = '0';
          welcomeView.style.left = '0';
          welcomeView.style.backgroundColor = '#f5f5f5';
          welcomeView.classList.remove('hidden');
        }
      };
    }
    
    if (backToWelcome2) {
      backToWelcome2.onclick = function(e) {
        e.preventDefault();
        console.log('🔙 Volviendo a bienvenida desde login');
        
        const welcomeView = document.getElementById('welcome-view');
        const registerView = document.getElementById('register-view');
        const loginView = document.getElementById('login-view');
        
        if (registerView) {
          registerView.style.display = 'none';
          registerView.classList.add('hidden');
        }
        if (loginView) {
          loginView.style.display = 'none';
          loginView.classList.add('hidden');
        }
        if (welcomeView) {
          welcomeView.style.display = 'flex';
          welcomeView.style.flexDirection = 'column';
          welcomeView.style.alignItems = 'center';
          welcomeView.style.justifyContent = 'center';
          welcomeView.style.width = '100%';
          welcomeView.style.height = '100vh';
          welcomeView.style.position = 'fixed';
          welcomeView.style.top = '0';
          welcomeView.style.left = '0';
          welcomeView.style.backgroundColor = '#f5f5f5';
          welcomeView.classList.remove('hidden');
        }
      };
    }
  }, 1000);
  
  // AGREGAR MANEJO DE FORMULARIOS
  setTimeout(() => {
    console.log('📝 Configurando manejo de formularios...');
    
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) {
      console.log('✅ Configurando formulario de login');
      
      // Remover event listeners existentes
      const newLoginForm = loginForm.cloneNode(true);
      loginForm.parentNode.replaceChild(newLoginForm, loginForm);
      
      newLoginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🔐 Procesando login...');
        const loginMessage = document.getElementById('login-message');
        
        if (loginMessage) {
          loginMessage.textContent = 'Iniciando sesión...';
          loginMessage.style.color = 'blue';
        }
        
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        
        if (!username || !password) {
          if (loginMessage) {
            loginMessage.textContent = 'Por favor, completa todos los campos';
            loginMessage.style.color = 'red';
          }
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
            if (loginMessage) {
              loginMessage.textContent = '¡Login exitoso! Redirigiendo...';
              loginMessage.style.color = 'green';
            }
            
            // Guardar token
            localStorage.setItem('token', data.token);
            console.log('💾 Token guardado en localStorage');
            
            // Esperar un poco y luego redirigir al juego
            setTimeout(() => {
              console.log('🎮 Redirigiendo al juego...');
              
              const loginView = document.getElementById('login-view');
              const background = document.getElementById('background');
              const welcomeView = document.getElementById('welcome-view');
              const registerView = document.getElementById('register-view');
              
              // Ocultar todas las vistas de auth
              if (loginView) {
                loginView.style.display = 'none';
                loginView.classList.add('hidden');
              }
              if (welcomeView) {
                welcomeView.style.display = 'none';
                welcomeView.classList.add('hidden');
              }
              if (registerView) {
                registerView.style.display = 'none';
                registerView.classList.add('hidden');
              }
              
              // Mostrar el juego
              if (background) {
                background.style.display = 'block';
                background.classList.remove('hidden');
                console.log('✅ Vista del juego activada');
                
                // Ejecutar diagnóstico de mascota después de mostrar el juego
                setTimeout(() => {
                  if (window.petDiagnostic && window.petDiagnostic.diagnosticarMascota) {
                    console.log('🔍 Ejecutando diagnóstico post-login...');
                    window.petDiagnostic.diagnosticarMascota();
                  }
                }, 1000);
              } else {
                console.error('❌ No se encontró el elemento background');
              }
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
            
            if (loginMessage) {
              loginMessage.textContent = errorMessage;
              loginMessage.style.color = 'red';
            }
            
            console.log('🚫 Manteniendo al usuario en el formulario de login');
          }
          
        } catch (error) {
          console.error('❌ Error de conexión:', error);
          if (loginMessage) {
            loginMessage.textContent = 'Error de conexión con el servidor';
            loginMessage.style.color = 'red';
          }
        }
      });
    }
    
    if (registerForm) {
      console.log('✅ Configurando formulario de registro');
      
      // Remover event listeners existentes
      const newRegisterForm = registerForm.cloneNode(true);
      registerForm.parentNode.replaceChild(newRegisterForm, registerForm);
      
      newRegisterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('📝 Procesando registro...');
        const registerMessage = document.getElementById('register-message');
        
        if (registerMessage) {
          registerMessage.textContent = 'Registrando...';
          registerMessage.style.color = 'blue';
        }
        
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value;
        
        // Validación básica
        if (!username || username.length < 3) {
          if (registerMessage) {
            registerMessage.textContent = 'El nombre de usuario debe tener al menos 3 caracteres';
            registerMessage.style.color = 'red';
          }
          return;
        }
        
        if (!password || password.length < 6) {
          if (registerMessage) {
            registerMessage.textContent = 'La contraseña debe tener al menos 6 caracteres';
            registerMessage.style.color = 'red';
          }
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
            if (registerMessage) {
              registerMessage.textContent = '¡Registro exitoso! Redirigiendo...';
              registerMessage.style.color = 'green';
            }
            
            // Ir a la selección de mascota
            setTimeout(() => {
              const registerView = document.getElementById('register-view');
              const selectPetView = document.getElementById('select-pet-view');
              
              if (registerView) {
                registerView.style.display = 'none';
                registerView.classList.add('hidden');
              }
              if (selectPetView) {
                selectPetView.style.display = 'flex';
                selectPetView.style.flexDirection = 'column';
                selectPetView.style.alignItems = 'center';
                selectPetView.style.justifyContent = 'center';
                selectPetView.style.width = '100%';
                selectPetView.style.height = '100vh';
                selectPetView.style.position = 'fixed';
                selectPetView.style.top = '0';
                selectPetView.style.left = '0';
                selectPetView.style.backgroundColor = '#f5f5f5';
                selectPetView.classList.remove('hidden');
              }
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
            
            if (registerMessage) {
              registerMessage.textContent = errorMessage;
              registerMessage.style.color = 'red';
            }
            
            console.log('🚫 Manteniendo al usuario en el formulario de registro');
          }
          
        } catch (error) {
          console.error('❌ Error de conexión:', error);
          if (registerMessage) {
            registerMessage.textContent = 'Error de conexión con el servidor';
            registerMessage.style.color = 'red';
          }
        }
      });
    }
  }, 1500);
});
