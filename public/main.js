const API_BASE = window.location.hostname.includes('localhost')
  ? "http://localhost:3000"
  : "https://api-heroes-2lw9.onrender.com";

// ...el resto de tu código...

// Mascotas reales desde backend
let mascotas = [];
let currentPet = 0;

async function cargarMascotasDisponibles() {
  try {
    const res = await authFetch(`${API_BASE}/userpet/disponibles`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      mascotas = data;
      currentPet = 0;
      renderPetCarousel();
    } else {
      document.getElementById('pet-svg-container').innerHTML = '<p>No hay mascotas disponibles.</p>';
      document.getElementById('pet-name').textContent = '';
      document.getElementById('pet-desc').textContent = '';
    }
  } catch (err) {
    document.getElementById('pet-svg-container').innerHTML = '<p>Error al cargar mascotas.</p>';
    document.getElementById('pet-name').textContent = '';
    document.getElementById('pet-desc').textContent = '';
  }
}

function renderPetCarousel() {
  if (!mascotas.length) return;
  // Si tienes un campo SVG en la mascota, úsalo. Si no, pon una imagen por defecto o el nombre.
  document.getElementById('pet-svg-container').innerHTML = mascotas[currentPet].svg || `<div style="font-size:2em;">🐾</div>`;
  document.getElementById('pet-name').textContent = mascotas[currentPet].nombre;
  document.getElementById('pet-desc').textContent = mascotas[currentPet].desc || '';
}

document.getElementById('prev-pet').onclick = () => {
  if (!mascotas.length) return;
  currentPet = (currentPet - 1 + mascotas.length) % mascotas.length;
  renderPetCarousel();
};
document.getElementById('next-pet').onclick = () => {
  if (!mascotas.length) return;
  currentPet = (currentPet + 1) % mascotas.length;
  renderPetCarousel();
};

document.getElementById('select-pet-btn').onclick = async () => {
  if (!mascotas.length) return;
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Debes iniciar sesión para adoptar una mascota.');
    return;
  }
  const petId = mascotas[currentPet]._id;
  try {
    const res = await authFetch(`${API_BASE}/userpet/adoptar/${petId}`, { method: 'POST' });
    const data = await res.json();
    if (res.ok) {
      document.getElementById('select-pet-view').classList.add('hidden');
      document.getElementById('background').classList.remove('hidden');
      // Si tienes un campo SVG, úsalo. Si no, pon una imagen por defecto
      const petImg = document.getElementById('pet-img');
      petImg.src = mascotas[currentPet].svg || '';
      setTimeout(() => animarParpadeo(), 500);
      alert('¡Mascota adoptada con éxito!');
    } else {
      alert(data.error || 'No se pudo adoptar la mascota.');
    }
  } catch (err) {
    alert('Error de conexión con el servidor.');
  }
};

// Cargar mascotas reales al mostrar la vista de selección
// Asegúrate de declarar selectPetView solo una vez y antes de usarla
const selectPetView = document.getElementById('select-pet-view');
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (!selectPetView.classList.contains('hidden')) {
      cargarMascotasDisponibles();
    }
  });
});
observer.observe(selectPetView, { attributes: true, attributeFilter: ['class'] });

// Utilidad para hacer fetch autenticado con Bearer token
function authFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = options.headers || {};
  if (token) {
    headers['Authorization'] = 'Bearer ' + token;
  }
  return fetch(url, { ...options, headers });
}

// Render inicial
if (document.getElementById('pet-svg-container')) renderPetCarousel();

// Estado de ejemplo de la mascota
const estadoMascota = {
  salud: 100,
  comida: 100,
  energia: 100,
  felicidad: 100,
  escenario: 'home', // home, bath, kitchen, park
};

// Actualiza las barras de estado visualmente
function actualizarBarras() {
  document.getElementById('bar-salud').style.width = estadoMascota.salud + '%';
  document.getElementById('val-salud').textContent = estadoMascota.salud;
  document.getElementById('bar-comida').style.width = estadoMascota.comida + '%';
  document.getElementById('val-comida').textContent = estadoMascota.comida;
  document.getElementById('bar-energia').style.width = estadoMascota.energia + '%';
  document.getElementById('val-energia').textContent = estadoMascota.energia;
  document.getElementById('bar-felicidad').style.width = estadoMascota.felicidad + '%';
  document.getElementById('val-felicidad').textContent = estadoMascota.felicidad;
}

// Animación de nubes para transición de escenario
function transicionNubes(nuevoEscenario, callback) {
  const clouds = document.getElementById('clouds-overlay');
  clouds.classList.remove('hidden');
  clouds.classList.add('active');
  setTimeout(() => {
    document.getElementById('background').className = 'room-' + nuevoEscenario;
    if (callback) callback();
    setTimeout(() => {
      clouds.classList.remove('active');
      setTimeout(() => clouds.classList.add('hidden'), 1000);
    }, 1000);
  }, 1000);
}

// Acciones de la mascota
function doAction(accion) {
  switch (accion) {
    case 'alimentar':
      transicionNubes('kitchen', () => {
        estadoMascota.comida = Math.min(100, estadoMascota.comida + 20);
        estadoMascota.felicidad = Math.min(100, estadoMascota.felicidad + 5);
        actualizarBarras();
      });
      break;
    case 'banar':
      transicionNubes('bath', () => {
        estadoMascota.salud = Math.min(100, estadoMascota.salud + 10);
        estadoMascota.felicidad = Math.max(0, estadoMascota.felicidad - 5);
        actualizarBarras();
      });
      break;
    case 'jugar':
      transicionNubes('park', () => {
        estadoMascota.felicidad = Math.min(100, estadoMascota.felicidad + 20);
        estadoMascota.energia = Math.max(0, estadoMascota.energia - 10);
        actualizarBarras();
      });
      break;
    case 'dormir':
      transicionNubes('home', () => {
        estadoMascota.energia = Math.min(100, estadoMascota.energia + 30);
        estadoMascota.salud = Math.min(100, estadoMascota.salud + 5);
        actualizarBarras();
      });
      break;
  }
}

// Animación de parpadeo de la mascota (simulación)
function animarParpadeo() {
  const petImg = document.getElementById('pet-img');
  setInterval(() => {
    petImg.style.filter = 'brightness(0.7)';
    setTimeout(() => {
      petImg.style.filter = '';
    }, 120);
  }, 3500 + Math.random() * 2000);
}

// Inicialización
window.onload = () => {
  actualizarBarras();
  animarParpadeo();

  // Lógica de navegación entre vistas
  const welcomeView = document.getElementById('welcome-view');
  // selectPetView ya está declarada arriba
  const backgroundView = document.getElementById('background');
  const registerView = document.getElementById('register-view');
  const loginView = document.getElementById('login-view');

  // Botones de bienvenida
  const btnRegister = document.getElementById('btn-register');
  const btnLogin = document.getElementById('btn-login');

  btnRegister.onclick = () => {
    welcomeView.classList.add('hidden');
    registerView.classList.remove('hidden');
    loginView.classList.add('hidden');
    selectPetView.classList.add('hidden');
  };
  btnLogin.onclick = () => {
    welcomeView.classList.add('hidden');
    loginView.classList.remove('hidden');
    registerView.classList.add('hidden');
    selectPetView.classList.add('hidden');
  };

  // Alternar entre login y registro
  document.getElementById('go-login').onclick = (e) => {
    e.preventDefault();
    registerView.classList.add('hidden');
    loginView.classList.remove('hidden');
  };
  document.getElementById('go-register').onclick = (e) => {
    e.preventDefault();
    loginView.classList.add('hidden');
    registerView.classList.remove('hidden');
  };

  // Volver a la bienvenida desde registro/login
  document.getElementById('back-to-welcome1').onclick = (e) => {
    e.preventDefault();
    registerView.classList.add('hidden');
    welcomeView.classList.remove('hidden');
  };
  document.getElementById('back-to-welcome2').onclick = (e) => {
    e.preventDefault();
    loginView.classList.add('hidden');
    welcomeView.classList.remove('hidden');
  };

  // Manejo de mensajes de validación (simulado, puedes conectar con tu backend luego)
  const registerForm = document.getElementById('register-form');
  const registerMessage = document.getElementById('register-message');
  registerForm.onsubmit = async (e) => {
    e.preventDefault();
    registerMessage.textContent = '';
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.status === 201) {
        registerMessage.textContent = '¡Registro exitoso!';
        registerMessage.style.color = 'green';
        setTimeout(() => {
          registerView.classList.add('hidden');
          selectPetView.classList.remove('hidden');
        }, 1000);
      } else {
        registerMessage.textContent = data.error || 'Error en el registro';
        registerMessage.style.color = 'red';
      }
    } catch (err) {
      registerMessage.textContent = 'Error de conexión con el servidor';
      registerMessage.style.color = 'red';
    }
  };

  const loginForm = document.getElementById('login-form');
  const loginMessage = document.getElementById('login-message');
  loginForm.onsubmit = async (e) => {
    e.preventDefault();
    loginMessage.textContent = '';
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        loginMessage.textContent = '¡Inicio de sesión exitoso!';
        loginMessage.style.color = 'green';
        // Guarda el token en localStorage
        localStorage.setItem('token', data.token);
        setTimeout(() => {
          loginView.classList.add('hidden');
          selectPetView.classList.remove('hidden');
        }, 1000);
      } else {
        loginMessage.textContent = data.error || 'Usuario o contraseña incorrectos';
        loginMessage.style.color = 'red';
      }
    } catch (err) {
      loginMessage.textContent = 'Error de conexión con el servidor';
      loginMessage.style.color = 'red';
    }
  };
}; 