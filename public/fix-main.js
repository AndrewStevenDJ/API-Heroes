// Script para corregir el archivo main.js
document.addEventListener('DOMContentLoaded', function() {
  console.log('🛠️ Fix-Main: Corrección profunda de main.js');
  
  // Función para balancear llaves y paréntesis en JavaScript
  async function balancearCodigo() {
    try {
      // Cargar el contenido original
      const response = await fetch('main.js');
    
      let codigo = await response.text();
      
      console.log('📊 Analizando estructura de main.js...');
      
      // Añadimos un cierre para cada DOMContentLoaded abierto
      // Primero contamos cuántos hay
      const coincidencias = codigo.match(/document\.addEventListener\(['"]DOMContentLoaded['"],/g) || [];
      const cierres = codigo.match(/\}\);(?:\s*\/\/\s*(?:fin|end|close|cierre).*DOMContentLoaded)?/g) || [];
      
      console.log(`📈 Encontrados: ${coincidencias.length} DOMContentLoaded y ${cierres.length} cierres`);
      
      // Verificar si hay desbalance
      if (coincidencias.length > cierres.length) {
        console.log(`⚠️ Se necesitan ${coincidencias.length - cierres.length} cierres adicionales`);
        
        // Añadir los cierres necesarios
        codigo += '\n\n// Cierres añadidos por fix-main.js\n';
        for (let i = 0; i < coincidencias.length - cierres.length; i++) {
          codigo += '\n});  // Cierre automático para DOMContentLoaded';
        }
        codigo += '\n\nconsole.log("✅ main.js reparado y balanceado");\n';
      }
      
      // Crear un blob con el contenido corregido
      const blob = new Blob([codigo], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      
      // Reemplazar el script original
      const scriptOriginal = document.querySelector('script[src="main.js"]');
      if (scriptOriginal) {
        const nuevoScript = document.createElement('script');
        nuevoScript.src = url;
        
        // Reemplazar
        scriptOriginal.parentNode.replaceChild(nuevoScript, scriptOriginal);
        console.log('✅ Script main.js reemplazado con la versión reparada');
        return true;
      } else {
        console.error('❌ No se encontró el script main.js en el DOM');
        return false;
      }
    } catch (error) {
      console.error('❌ Error al reparar main.js:', error);
      return false;
    }
  }
  
  // Ejecutar la reparación después de un breve retraso
  setTimeout(() => {
    balancearCodigo().then(exito => {
      if (exito) {
        console.log('🎉 Reparación de main.js completada con éxito');
      } else {
        console.error('💔 La reparación de main.js no fue exitosa');
      }
    });
  }, 1000);
});
