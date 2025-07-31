// Script para identificar y eliminar elementos específicos
(function() {
  console.log('🎯 Herramienta de eliminación de elementos activada');
  
  let modoEliminacion = false;
  let elementosMarkados = [];
  
  // Crear botón de toggle para el modo eliminación
  function crearBotonEliminacion() {
    // BOTÓN DESHABILITADO - Para reactivar, descomenta el código siguiente
    return; // Salir temprano sin crear el botón
    
    /*
    const button = document.createElement('button');
    button.id = 'element-remover-toggle';
    button.textContent = '🎯 Eliminar Elemento';
    button.style.cssText = `
      position: fixed;
      top: 80px;
      left: 20px;
      z-index: 10000;
      background: #ff4444;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
    `;
    
    button.onclick = function() {
      modoEliminacion = !modoEliminacion;
      if (modoEliminacion) {
        button.textContent = '❌ Cancelar';
        button.style.background = '#666';
        activarModoEliminacion();
      } else {
        button.textContent = '🎯 Eliminar Elemento';
        button.style.background = '#ff4444';
        desactivarModoEliminacion();
      }
    };
    
    document.body.appendChild(button);
    */
  }
  
  // Activar modo eliminación
  function activarModoEliminacion() {
    console.log('🔍 Modo eliminación activado - Haz clic en cualquier elemento para eliminarlo');
    
    // Agregar overlay de instrucciones
    const overlay = document.createElement('div');
    overlay.id = 'elimination-overlay';
    overlay.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        z-index: 10001;
      ">
        <h3>🎯 Modo Eliminación Activado</h3>
        <p>Haz clic en cualquier elemento para eliminarlo</p>
        <p><small>Haz clic aquí para cerrar estas instrucciones</small></p>
      </div>
    `;
    
    overlay.onclick = function() {
      overlay.remove();
    };
    
    document.body.appendChild(overlay);
    
    // Agregar event listener para clicks
    document.addEventListener('click', manejarClickEliminacion, true);
    
    // Agregar efecto hover a todos los elementos
    const style = document.createElement('style');
    style.id = 'elimination-hover-style';
    style.textContent = `
      .element-hover-elimination {
        outline: 3px solid red !important;
        background: rgba(255, 0, 0, 0.1) !important;
        cursor: pointer !important;
      }
    `;
    document.head.appendChild(style);
    
    // Agregar hover listeners
    document.addEventListener('mouseover', agregarHoverEliminacion);
    document.addEventListener('mouseout', quitarHoverEliminacion);
  }
  
  // Desactivar modo eliminación
  function desactivarModoEliminacion() {
    console.log('🛑 Modo eliminación desactivado');
    
    // Remover listeners
    document.removeEventListener('click', manejarClickEliminacion, true);
    document.removeEventListener('mouseover', agregarHoverEliminacion);
    document.removeEventListener('mouseout', quitarHoverEliminacion);
    
    // Remover estilos
    const style = document.getElementById('elimination-hover-style');
    if (style) style.remove();
    
    // Remover overlay si existe
    const overlay = document.getElementById('elimination-overlay');
    if (overlay) overlay.remove();
    
    // Limpiar clases hover
    document.querySelectorAll('.element-hover-elimination').forEach(el => {
      el.classList.remove('element-hover-elimination');
    });
  }
  
  // Manejar click para eliminación
  function manejarClickEliminacion(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const elemento = event.target;
    
    // No eliminar el botón de toggle ni elementos críticos
    if (elemento.id === 'element-remover-toggle' || 
        elemento.id === 'elimination-overlay' ||
        elemento.closest('#elimination-overlay')) {
      return;
    }
    
    // Mostrar información del elemento
    const info = {
      tag: elemento.tagName,
      id: elemento.id || 'sin id',
      class: elemento.className || 'sin clase',
      texto: elemento.textContent?.substring(0, 50) || 'sin texto'
    };
    
    const confirmar = confirm(`¿Eliminar este elemento?
    
Tag: ${info.tag}
ID: ${info.id}
Clase: ${info.class}
Texto: ${info.texto}
    
¿Continuar?`);
    
    if (confirmar) {
      console.log('🗑️ Eliminando elemento:', info);
      elemento.remove();
      
      // Agregar a lista de eliminados para referencia
      elementosMarkados.push({
        ...info,
        timestamp: new Date().toISOString()
      });
      
      alert('✅ Elemento eliminado exitosamente');
    }
  }
  
  // Agregar efecto hover
  function agregarHoverEliminacion(event) {
    if (modoEliminacion && event.target.id !== 'element-remover-toggle') {
      event.target.classList.add('element-hover-elimination');
    }
  }
  
  // Quitar efecto hover
  function quitarHoverEliminacion(event) {
    event.target.classList.remove('element-hover-elimination');
  }
  
  // Función para mostrar elementos eliminados
  function mostrarElementosEliminados() {
    if (elementosMarkados.length === 0) {
      alert('No se han eliminado elementos todavía');
      return;
    }
    
    const lista = elementosMarkados.map((el, i) => 
      `${i + 1}. ${el.tag} (ID: ${el.id}, Clase: ${el.class})`
    ).join('\n');
    
    alert(`Elementos eliminados:\n\n${lista}`);
  }
  
  // Exponer funciones globalmente
  window.elementRemover = {
    mostrarEliminados: mostrarElementosEliminados,
    activar: activarModoEliminacion,
    desactivar: desactivarModoEliminacion
  };
  
  // Crear el botón cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', crearBotonEliminacion);
  } else {
    crearBotonEliminacion();
  }
  
})();
