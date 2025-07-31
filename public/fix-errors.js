// Script específico para corregir la sintaxis de main.js
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔧 Iniciando corrección específica de main.js');
  
  const mainScript = document.querySelector('script[src="main.js"]');
  
  if (!mainScript) {
    console.error('❌ No se encontró el script main.js');
    return;
  }
  
  // Crear un nuevo elemento script que incluirá el código corregido
  const newScript = document.createElement('script');
  newScript.id = 'main-fixed';
  
  // Código corregido para ser inyectado al final del archivo
  const fixCode = `
    // Código de corrección añadido por fix-errors.js
    
    // Verificar si hay botones sin configurar y configurarlos
    document.querySelectorAll('button').forEach(btn => {
      if (!btn.onclick && btn.id) {
        console.log('🔍 Detectado botón sin evento: ' + btn.id);
        
        if (btn.id === 'btn-register') {
          btn.onclick = function() {
            document.getElementById('welcome-view').classList.add('hidden');
            document.getElementById('register-view').classList.remove('hidden');
            document.getElementById('login-view').classList.add('hidden');
          };
          console.log('✅ Configurado botón: btn-register');
        }
        else if (btn.id === 'btn-login') {
          btn.onclick = function() {
            document.getElementById('welcome-view').classList.add('hidden');
            document.getElementById('login-view').classList.remove('hidden');
            document.getElementById('register-view').classList.add('hidden');
          };
          console.log('✅ Configurado botón: btn-login');
        }
      }
    });
    
    // Asegurarnos de que las variables globales estén definidas
    if (typeof estadoMascota === 'undefined') {
      console.log('⚠️ Variable estadoMascota no definida, creando una por defecto');
      window.estadoMascota = {
        hambre: 50,
        energia: 50,
        limpieza: 50,
        felicidad: 50,
        salud: 50
      };
    }
    
    console.log('✅ Corrección de main.js completada');
  `;
  
  // Insertar el código corregido
  newScript.textContent = fixCode;
  document.body.appendChild(newScript);
  
  console.log('✅ Script de corrección añadido al final del body');
});
