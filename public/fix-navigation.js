// Script para verificar botones de navegación
console.log('🔍 Verificando botones de navegación...');

document.addEventListener('DOMContentLoaded', function() {
  // Botones de bienvenida
  const btnRegister = document.getElementById('btn-register');
  const btnLogin = document.getElementById('btn-login');
  const welcomeView = document.getElementById('welcome-view');
  const registerView = document.getElementById('register-view');
  const loginView = document.getElementById('login-view');
  
  console.log('Elementos encontrados:');
  console.log('- btnRegister:', btnRegister ? '✅' : '❌');
  console.log('- btnLogin:', btnLogin ? '✅' : '❌');
  console.log('- welcomeView:', welcomeView ? '✅' : '❌');
  console.log('- registerView:', registerView ? '✅' : '❌');
  console.log('- loginView:', loginView ? '✅' : '❌');
  
  // Registrar nuevos event listeners para los botones
  if (btnRegister) {
    console.log('Registrando evento para botón de registro');
    btnRegister.addEventListener('click', function() {
      console.log('🖱️ Click en botón de registro');
      welcomeView.classList.add('hidden');
      registerView.classList.remove('hidden');
      loginView.classList.add('hidden');
    });
  }
  
  if (btnLogin) {
    console.log('Registrando evento para botón de login');
    btnLogin.addEventListener('click', function() {
      console.log('🖱️ Click en botón de login');
      welcomeView.classList.add('hidden');
      loginView.classList.remove('hidden');
      registerView.classList.add('hidden');
    });
  }
  
  // Links para cambiar entre formularios
  const goLogin = document.getElementById('go-login');
  const goRegister = document.getElementById('go-register');
  
  if (goLogin) {
    console.log('Registrando evento para link de login');
    goLogin.addEventListener('click', function(e) {
      e.preventDefault();
      registerView.classList.add('hidden');
      loginView.classList.remove('hidden');
    });
  }
  
  if (goRegister) {
    console.log('Registrando evento para link de registro');
    goRegister.addEventListener('click', function(e) {
      e.preventDefault();
      loginView.classList.add('hidden');
      registerView.classList.remove('hidden');
    });
  }
  
  // Links para volver a la bienvenida
  const backToWelcome1 = document.getElementById('back-to-welcome1');
  const backToWelcome2 = document.getElementById('back-to-welcome2');
  
  if (backToWelcome1) {
    console.log('Registrando evento para link de volver (1)');
    backToWelcome1.addEventListener('click', function(e) {
      e.preventDefault();
      registerView.classList.add('hidden');
      loginView.classList.add('hidden');
      welcomeView.classList.remove('hidden');
    });
  }
  
  if (backToWelcome2) {
    console.log('Registrando evento para link de volver (2)');
    backToWelcome2.addEventListener('click', function(e) {
      e.preventDefault();
      registerView.classList.add('hidden');
      loginView.classList.add('hidden');
      welcomeView.classList.remove('hidden');
    });
  }
});
