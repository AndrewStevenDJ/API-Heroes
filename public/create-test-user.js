// Script para crear un usuario administrador de prueba
document.addEventListener('DOMContentLoaded', () => {
  console.log('%c🔧 Admin Creator: Script para crear usuario admin de prueba activado', 'color: #4CAF50; font-size: 14px; font-weight: bold;');
  
  // Crear botón para añadir usuario de prueba
  const createTestUserBtn = document.createElement('button');
  createTestUserBtn.textContent = '👤 Crear Usuario Prueba';
  createTestUserBtn.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: #8e44ad;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    cursor: pointer;
    z-index: 9999;
  `;
  
  createTestUserBtn.addEventListener('click', async () => {
    const username = prompt('Nombre de usuario a crear:', 'test');
    if (!username) return;
    
    const password = prompt('Contraseña:', 'password');
    if (!password) return;
    
    try {
      console.log('Intentando registrar usuario de prueba...');
      const API_BASE = window.API_BASE || "http://localhost:3000";
      
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      console.log('Estado de la respuesta:', response.status, response.statusText);
      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ Usuario creado exitosamente:', data);
        alert('Usuario creado exitosamente. Ahora puedes iniciar sesión.');
        
        // Intentar login automático con el nuevo usuario
        if (confirm('¿Quieres iniciar sesión con este usuario?')) {
          await loginUser(username, password);
        }
      } else {
        console.error('❌ Error al crear usuario:', data);
        alert(`Error al crear usuario: ${data.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('❌ Error en la creación del usuario:', error);
      alert('Error de conexión al intentar crear usuario');
    }
  });
  
  // Función para login automático
  async function loginUser(username, password) {
    try {
      console.log('Iniciando sesión automáticamente...');
      const API_BASE = window.API_BASE || "http://localhost:3000";
      
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      console.log('Estado de la respuesta login:', response.status, response.statusText);
      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        console.log('✅ Login exitoso, token guardado');
        
        // Recargar para aplicar el nuevo token
        alert('Login exitoso. La página se recargará.');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.error('❌ Login fallido:', data);
        alert('Login fallido: ' + (data.error || 'Error desconocido'));
        
        // Ocultar todo excepto la vista de bienvenida para reintentar
        document.getElementById('welcome-view').classList.remove('hidden');
        document.getElementById('login-view').classList.add('hidden');
        document.getElementById('register-view').classList.add('hidden');
        document.getElementById('select-pet-view').classList.add('hidden');
        document.getElementById('background').classList.add('hidden');
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      alert('Error de conexión al intentar login');
    }
  }
  
  document.body.appendChild(createTestUserBtn);
});
