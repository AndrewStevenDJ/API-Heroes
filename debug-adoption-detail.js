const axios = require('axios');

async function debugAdoption() {
    const baseURL = 'http://localhost:3000';
    
    console.log('=== DEBUGGING ADOPCIÓN DETALLADO ===');
    
    try {
        // 1. Registrar usuario nuevo
        const randomNum = Math.floor(Math.random() * 10000);
        const userData = {
            nombre: `DebugUser${randomNum}`,
            email: `debug${randomNum}@test.com`,
            password: 'testpass123'
        };
        
        console.log('\n1. Registrando usuario:', userData.nombre);
        const registerResponse = await axios.post(`${baseURL}/api/users/register`, userData);
        console.log('Status registro:', registerResponse.status);
        console.log('Respuesta registro:', registerResponse.data);
        
        if (registerResponse.status !== 201) {
            throw new Error('Error en registro');
        }
        
        // 2. Login
        console.log('\n2. Haciendo login...');
        const loginResponse = await axios.post(`${baseURL}/api/users/login`, {
            email: userData.email,
            password: userData.password
        });
        
        console.log('Status login:', loginResponse.status);
        console.log('Respuesta login:', loginResponse.data);
        
        if (loginResponse.status !== 200) {
            throw new Error('Error en login');
        }
        
        const token = loginResponse.data.token;
        console.log('Token obtenido:', token.substring(0, 50) + '...');
        
        // 3. Verificar estado antes de adopción
        console.log('\n3. Verificando mascotas del usuario antes de adopción...');
        try {
            const userPetsResponse = await axios.get(`${baseURL}/api/user-pets`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Status verificación:', userPetsResponse.status);
            console.log('Mascotas actuales:', userPetsResponse.data);
        } catch (error) {
            console.log('Error verificando mascotas (esperado para usuario nuevo):', error.response?.status);
        }
        
        // 4. Intentar adopción
        console.log('\n4. Intentando adoptar mascota ID 1 (Astro)...');
        
        const adoptionData = { petId: 1 };
        console.log('Datos de adopción:', adoptionData);
        console.log('Headers:', { Authorization: `Bearer ${token}` });
        
        try {
            const adoptResponse = await axios.post(`${baseURL}/api/user-pets/adopt`, adoptionData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('✅ ÉXITO - Status adopción:', adoptResponse.status);
            console.log('✅ ÉXITO - Respuesta adopción:', adoptResponse.data);
        } catch (error) {
            console.log('❌ ERROR en adopción');
            console.log('Status error:', error.response?.status);
            console.log('Mensaje error:', error.response?.data);
            console.log('Headers de respuesta:', error.response?.headers);
            
            // Detalle del error
            if (error.response?.data?.error) {
                console.log('Error específico:', error.response.data.error);
            }
        }
        
        // 5. Verificar estado después de adopción
        console.log('\n5. Verificando mascotas del usuario después de adopción...');
        try {
            const userPetsAfterResponse = await axios.get(`${baseURL}/api/user-pets`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Status verificación final:', userPetsAfterResponse.status);
            console.log('Mascotas finales:', userPetsAfterResponse.data);
        } catch (error) {
            console.log('Error verificando mascotas finales:', error.response?.status, error.response?.data);
        }
        
    } catch (error) {
        console.error('Error general:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

debugAdoption();
