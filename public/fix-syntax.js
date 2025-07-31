// Script para corregir la sintaxis de main.js
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔧 Fix-Syntax: Analizando main.js para corregir errores de sintaxis...');
  
  // Crear una función que reemplace el script main.js con una versión corregida
  function fixMainJsSyntax() {
    return new Promise((resolve, reject) => {
      // Cargar el contenido original de main.js
      fetch('main.js')
        .then(response => response.text())
        .then(content => {
          console.log('🔍 Contenido de main.js cargado, buscando errores...');
          
          // Analizar el contenido para detectar patrones de error
          const lines = content.split('\n');
          let lastLine = '';
          
          // Buscar la última línea no vacía
          for (let i = lines.length - 1; i >= 0; i--) {
            if (lines[i].trim() !== '') {
              lastLine = lines[i].trim();
              console.log(`🔍 Última línea no vacía (${i}): "${lastLine}"`);
              break;
            }
          }
          
          // Corrección específica: si la última línea es simplemente '});', añadir un punto y coma si falta
          if (lastLine === '});' || lastLine === '})') {
            console.log('✏️ Corrigiendo: La última línea necesita un punto y coma');
            
            // Asegurarse de que termine con ';'
            if (!lastLine.endsWith(';')) {
              lines[lines.length - 1] = '});';
              console.log('✅ Se añadió un punto y coma al final');
            }
          }
          
          // Verificar si faltan cerrar bloques de DOMContentLoaded
          let openBlocks = 0;
          let closeBlocks = 0;
          
          for (const line of lines) {
            if (line.includes("addEventListener('DOMContentLoaded'")) {
              openBlocks++;
            }
            if (line.trim() === '});') {
              closeBlocks++;
            }
          }
          
          console.log(`📊 Bloques abiertos: ${openBlocks}, Bloques cerrados: ${closeBlocks}`);
          
          if (openBlocks > closeBlocks) {
            console.log('⚠️ Faltan bloques por cerrar. Añadiendo cierre...');
            lines.push('});  // Cierre añadido automáticamente');
          }
          
          // Crear una versión corregida del archivo
          const correctedContent = lines.join('\n');
          
          // Crear un blob con el contenido corregido
          const blob = new Blob([correctedContent], {type: 'text/javascript'});
          const url = URL.createObjectURL(blob);
          
          // Reemplazar el script actual con la versión corregida
          const oldScripts = document.querySelectorAll('script[src="main.js"]');
          if (oldScripts.length > 0) {
            // Obtener el primer script de main.js
            const oldScript = oldScripts[0];
            const newScript = document.createElement('script');
            newScript.src = url;
            
            // Reemplazar el script
            oldScript.parentNode.replaceChild(newScript, oldScript);
            console.log('✅ Script main.js reemplazado con la versión corregida');
            
            // Si hay más de un script de main.js, eliminar los adicionales
            if (oldScripts.length > 1) {
              console.log(`⚠️ Se encontraron ${oldScripts.length} copias de main.js, eliminando las adicionales...`);
              for (let i = 1; i < oldScripts.length; i++) {
                oldScripts[i].parentNode.removeChild(oldScripts[i]);
              }
            }
            
            resolve(true);
          } else {
            console.error('❌ No se encontró el script main.js en el DOM');
            reject(new Error('No se encontró el script main.js'));
          }
        })
        .catch(error => {
          console.error('❌ Error al intentar corregir main.js:', error);
          reject(error);
        });
    });
  }
  
  // Esperar un poco para asegurarse de que todos los scripts se han cargado
  setTimeout(() => {
    fixMainJsSyntax()
      .then(() => {
        console.log('✨ Corrección de sintaxis de main.js completada');
        // Ya no recargamos la página automáticamente
      })
      .catch(err => {
        console.error('❌ No se pudo corregir main.js:', err);
      });
  }, 1000);
});
