const axios = require('axios');

async function liberarMascotaUsuario() {
    const baseURL = 'http://localhost:3000';
    
    console.log('=== LIBERANDO MASCOTA DE USUARIO ===');
    
    try {
        // Como ya sabemos que tu usuario tiene ID específico del log,
        // vamos a buscar tu usuario y liberar su mascota
        console.log('\n🔍 Buscando usuario con mascota Astro...');
        
        // Crear usuario temporal para obtener token admin
        const randomNum = Math.floor(Math.random() * 10000);
        const userData = {
            username: `AdminTemp${randomNum}`,
            password: 'testpass123'
        };
        
        const registerResponse = await axios.post(`${baseURL}/auth/register`, userData);
        const loginResponse = await axios.post(`${baseURL}/auth/login`, {
            username: userData.username,
            password: userData.password
        });
        
        const token = loginResponse.data.token;
        
        // Intentar liberar mascota del usuario que encontramos en los logs
        console.log('\n🔓 Intentando liberar mascota...');
        try {
            const liberarResponse = await axios.delete(`${baseURL}/mis-mascotas/liberar`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log('✅ ¡Mascota liberada exitosamente!');
            console.log('Respuesta:', liberarResponse.data);
        } catch (liberarError) {
            if (liberarError.response?.status === 404) {
                console.log('ℹ️ Este usuario no tiene mascota para liberar');
            } else {
                console.log('❌ Error liberando mascota:', liberarError.response?.data);
            }
        }
        
        // Alternativa: Usar directamente la API de MongoDB para limpiar
        console.log('\n🧹 Alternativa: Crear script para limpiar base de datos...');
        console.log('Para liberar mascotas adoptadas, puedes:');
        console.log('1. Usar un nuevo usuario (recomendado)');
        console.log('2. O ejecutar este comando en MongoDB:');
        console.log('   db.pets.updateMany({ownerId: {$ne: null}}, {$unset: {ownerId: 1}})');
        
    } catch (error) {
        console.error('Error general:', error.message);
    }
}

liberarMascotaUsuario();
