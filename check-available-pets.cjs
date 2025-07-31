const axios = require('axios');

async function checkAvailablePets() {
    const baseURL = 'http://localhost:3000';
    
    console.log('=== VERIFICANDO MASCOTAS DISPONIBLES ===');
    
    try {
        // 1. Registrar usuario nuevo para obtener token
        const randomNum = Math.floor(Math.random() * 10000);
        const userData = {
            username: `TempUser${randomNum}`,
            password: 'testpass123'
        };
        
        console.log('\n1. Registrando usuario temporal:', userData.username);
        const registerResponse = await axios.post(`${baseURL}/auth/register`, userData);
        
        // 2. Login
        console.log('\n2. Haciendo login...');
        const loginResponse = await axios.post(`${baseURL}/auth/login`, {
            username: userData.username,
            password: userData.password
        });
        
        const token = loginResponse.data.token;
        
        // 3. Obtener mascotas disponibles
        console.log('\n3. Obteniendo mascotas disponibles...');
        try {
            const availableResponse = await axios.get(`${baseURL}/mis-mascotas/disponibles`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log('✅ Mascotas disponibles:');
            console.log(`Total: ${availableResponse.data.length}`);
            
            if (availableResponse.data.length > 0) {
                availableResponse.data.forEach(pet => {
                    console.log(`- ID: ${pet.id}, Nombre: ${pet.nombre}, OwnerID: ${pet.ownerId}`);
                });
                
                // Intentar adoptar la primera disponible
                const firstAvailable = availableResponse.data[0];
                console.log(`\n4. Intentando adoptar ${firstAvailable.nombre} (ID: ${firstAvailable.id})...`);
                
                try {
                    const adoptResponse = await axios.post(`${baseURL}/mis-mascotas/adoptar/${firstAvailable.id}`, {}, {
                        headers: { 
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    console.log('✅ ADOPCIÓN EXITOSA!');
                    console.log('Respuesta:', adoptResponse.data);
                } catch (adoptError) {
                    console.log('❌ Error en adopción:', adoptError.response?.data);
                }
            } else {
                console.log('❌ No hay mascotas disponibles para adoptar');
            }
        } catch (error) {
            console.log('Error obteniendo mascotas disponibles:', error.response?.data);
        }
        
    } catch (error) {
        console.error('Error general:', error.message);
    }
}

checkAvailablePets();
