// Script para corregir de forma más agresiva la sintaxis de main.js
console.log('🛠️ Fix-Main-JS: Corrección agresiva de errores de sintaxis en main.js');

// Función para equilibrar llaves, paréntesis y corchetes en un archivo JavaScript
async function balanceDelimiters() {
  try {
    // Cargar el contenido del script main.js
    const response = await fetch('main.js');
    const code = await response.text();
    
    console.log('📝 Analizando estructura del código en main.js...');
    
    // Contar delimitadores
    let braces = 0;      // {}
    let brackets = 0;    // []
    let parentheses = 0; // ()
    
    // Registrar posiciones de apertura para mensajes de error más útiles
    const openPositions = {
      '{': [],
      '[': [],
      '(': []
    };
    
    // Líneas para mensaje de error
    let lineCount = 1;
    let colCount = 1;
    
    // Analizar el código carácter por carácter
    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      
      // Contar saltos de línea para el reporte de errores
      if (char === '\n') {
        lineCount++;
        colCount = 1;
      } else {
        colCount++;
      }
      
      // Ignorar caracteres dentro de strings
      if (char === '"' || char === "'" || char === '`') {
        const quote = char;
        i++;
        while (i < code.length && code[i] !== quote) {
          if (code[i] === '\\' && i + 1 < code.length) {
            i++; // Saltar el carácter escapado
          }
          if (code[i] === '\n') {
            lineCount++;
            colCount = 1;
          } else {
            colCount++;
          }
          i++;
        }
        continue;
      }
      
      // Ignorar comentarios de una línea
      if (char === '/' && code[i + 1] === '/') {
        while (i < code.length && code[i] !== '\n') {
          i++;
        }
        lineCount++;
        colCount = 1;
        continue;
      }
      
      // Ignorar comentarios multilínea
      if (char === '/' && code[i + 1] === '*') {
        i += 2;
        while (i < code.length && !(code[i - 1] === '*' && code[i] === '/')) {
          if (code[i] === '\n') {
            lineCount++;
            colCount = 1;
          } else {
            colCount++;
          }
          i++;
        }
        continue;
      }
      
      // Contar delimitadores
      switch (char) {
        case '{':
          braces++;
          openPositions['{'].push({ line: lineCount, col: colCount });
          break;
        case '}':
          braces--;
          if (openPositions['{'].length > 0) {
            openPositions['{'].pop();
          }
          break;
        case '[':
          brackets++;
          openPositions['['].push({ line: lineCount, col: colCount });
          break;
        case ']':
          brackets--;
          if (openPositions['['].length > 0) {
            openPositions['['].pop();
          }
          break;
        case '(':
          parentheses++;
          openPositions['('].push({ line: lineCount, col: colCount });
          break;
        case ')':
          parentheses--;
          if (openPositions['('].length > 0) {
            openPositions['('].pop();
          }
          break;
      }
    }
    
    console.log(`📊 Balance de delimitadores: { = ${braces}, [ = ${brackets}, ( = ${parentheses}`);
    
    // Si hay desequilibrio, corregirlo
    let fixedCode = code;
    
    if (braces !== 0 || brackets !== 0 || parentheses !== 0) {
      console.log('⚠️ Se encontró desequilibrio en los delimitadores. Corrigiendo...');
      
      // Agregar cierres faltantes
      if (braces > 0) {
        console.log(`🔧 Agregando ${braces} llaves de cierre '}' al final del archivo`);
        fixedCode += '\n// Cierre automático de llaves\n' + '}'.repeat(braces) + '\n';
      }
      
      if (brackets > 0) {
        console.log(`🔧 Agregando ${brackets} corchetes de cierre ']' al final del archivo`);
        fixedCode += '\n// Cierre automático de corchetes\n' + ']'.repeat(brackets) + '\n';
      }
      
      if (parentheses > 0) {
        console.log(`🔧 Agregando ${parentheses} paréntesis de cierre ')' al final del archivo`);
        fixedCode += '\n// Cierre automático de paréntesis\n' + ')'.repeat(parentheses) + '\n';
      }
      
      // Crear un blob con el contenido corregido
      const blob = new Blob([fixedCode], {type: 'text/javascript'});
      const url = URL.createObjectURL(blob);
      
      // Reemplazar el script actual con la versión corregida
      const oldScript = document.querySelector('script[src="main.js"]');
      if (oldScript) {
        const newScript = document.createElement('script');
        newScript.src = url;
        
        // Reemplazar el script
        oldScript.parentNode.replaceChild(newScript, oldScript);
        console.log('✅ Script main.js reemplazado con la versión corregida');
        return true;
      } else {
        console.error('❌ No se encontró el script main.js en el DOM');
        return false;
      }
    } else {
      console.log('✅ Los delimitadores están equilibrados, no se necesita corrección');
      return true;
    }
  } catch (error) {
    console.error('❌ Error al corregir main.js:', error);
    return false;
  }
}

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Esperar un poco para asegurarnos de que main.js está cargado
  setTimeout(() => {
    balanceDelimiters().then(success => {
      if (success) {
        console.log('✨ Corrección de sintaxis de main.js completada exitosamente');
      } else {
        console.error('❌ No se pudo completar la corrección de sintaxis de main.js');
      }
    });
  }, 1000);
});
