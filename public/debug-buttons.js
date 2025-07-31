// Script minimalista para debuggear los botones
console.log('🔍 Script de debug de botones iniciado');

document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM cargado, verificando elementos...');
  
  // Elementos principales
  const btnRegister = document.getElementById('btn-register');
  const btnLogin = document.getElementById('btn-login');
  const welcomeView = document.getElementById('welcome-view');
  const registerView = document.getElementById('register-view');
  const loginView = document.getElementById('login-view');
  
  console.log('Elementos encontrados:');
  console.log('- btn-register:', btnRegister);
  console.log('- btn-login:', btnLogin);
  console.log('- welcome-view:', welcomeView);
  console.log('- register-view:', registerView);
  console.log('- login-view:', loginView);
  
  // TEST INMEDIATO - Forzar mostrar el formulario de registro después de 3 segundos
  setTimeout(() => {
    console.log('🧪 TEST: Forzando mostrar formulario de registro');
    if (welcomeView) {
      welcomeView.classList.add('hidden');
      console.log('✅ Welcome view ocultado');
    }
    if (registerView) {
      registerView.classList.remove('hidden');
      console.log('✅ Register view mostrado');
    }
    if (loginView) {
      loginView.classList.add('hidden');
      console.log('✅ Login view ocultado');
    }
    
    // Mostrar mensaje al usuario
    const testMsg = document.createElement('div');
    testMsg.textContent = '🧪 TEST: Si ves el formulario de registro, el CSS funciona correctamente';
    testMsg.style.position = 'fixed';
    testMsg.style.top = '10px';
    testMsg.style.left = '10px';
    testMsg.style.background = 'rgba(0,255,0,0.8)';
    testMsg.style.color = 'black';
    testMsg.style.padding = '10px';
    testMsg.style.borderRadius = '5px';
    testMsg.style.zIndex = '9999';
    testMsg.style.maxWidth = '300px';
    document.body.appendChild(testMsg);
    
    // Volver a la pantalla de bienvenida después de 5 segundos más
    setTimeout(() => {
      if (welcomeView) welcomeView.classList.remove('hidden');
      if (registerView) registerView.classList.add('hidden');
      if (loginView) loginView.classList.add('hidden');
      if (testMsg) testMsg.remove();
      console.log('🔄 Volviendo a la pantalla de bienvenida');
    }, 5000);
  }, 3000);
  
  if (btnRegister) {
    console.log('✅ Agregando listener al botón de registro');
    btnRegister.addEventListener('click', function(e) {
      console.log('🖱️ CLICK EN REGISTRO DETECTADO');
      e.preventDefault();
      e.stopPropagation();
      
      if (welcomeView) welcomeView.classList.add('hidden');
      if (registerView) registerView.classList.remove('hidden');
      if (loginView) loginView.classList.add('hidden');
      
      console.log('Estado después del click:');
      console.log('- welcome-view hidden:', welcomeView ? welcomeView.classList.contains('hidden') : 'N/A');
      console.log('- register-view hidden:', registerView ? registerView.classList.contains('hidden') : 'N/A');
      console.log('- login-view hidden:', loginView ? loginView.classList.contains('hidden') : 'N/A');
    });
  } else {
    console.error('❌ Botón de registro NO encontrado');
  }
  
  if (btnLogin) {
    console.log('✅ Agregando listener al botón de login');
    btnLogin.addEventListener('click', function(e) {
      console.log('🖱️ CLICK EN LOGIN DETECTADO');
      e.preventDefault();
      e.stopPropagation();
      
      if (welcomeView) welcomeView.classList.add('hidden');
      if (loginView) loginView.classList.remove('hidden');
      if (registerView) registerView.classList.add('hidden');
      
      console.log('Estado después del click:');
      console.log('- welcome-view hidden:', welcomeView ? welcomeView.classList.contains('hidden') : 'N/A');
      console.log('- login-view hidden:', loginView ? loginView.classList.contains('hidden') : 'N/A');
      console.log('- register-view hidden:', registerView ? registerView.classList.contains('hidden') : 'N/A');
    });
  } else {
    console.error('❌ Botón de login NO encontrado');
  }
  
  // También verificar si los elementos tienen clases aplicadas por CSS
  console.log('Clases CSS actuales:');
  if (welcomeView) console.log('- welcome-view classes:', welcomeView.className);
  if (registerView) console.log('- register-view classes:', registerView.className);
  if (loginView) console.log('- login-view classes:', loginView.className);
});
