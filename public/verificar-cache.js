// Script para verificar si el caché está actualizado
console.log("🔍 VERIFICADOR DE CACHÉ:");
console.log("✅ Script cargado correctamente");
console.log("⏰ Timestamp:", new Date().toISOString());

// Verificar si adoptarMascota tiene los logs de debugging
if (window.adoptarMascota) {
    console.log("✅ Función adoptarMascota existe");
    console.log("📄 Código de la función:", window.adoptarMascota.toString().substring(0, 200) + "...");
} else {
    console.log("❌ Función adoptarMascota NO encontrada");
}

// Verificar versión del script pet-selector
const scripts = document.querySelectorAll('script[src*="pet-selector"]');
scripts.forEach(script => {
    console.log("📜 Script pet-selector encontrado:", script.src);
});

// Verificar consola del navegador
console.log("🌐 Para ver si funciona, abra la consola del navegador (F12) y busque estos mensajes");
