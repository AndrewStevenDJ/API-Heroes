// Script para corregir el token si no tiene el prefijo Bearer
(function() {
  const token = localStorage.getItem('token');
  if (token && !token.startsWith('Bearer ')) {
    console.log('Corrigiendo token sin prefijo Bearer...');
    const tokenWithBearer = `Bearer ${token}`;
    localStorage.setItem('token', tokenWithBearer);
    console.log('Token corregido con prefijo Bearer');
    // Recargar para aplicar el nuevo token
    window.location.reload();
  }
})();
