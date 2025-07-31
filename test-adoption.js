import https from 'https';
import http from 'http';

function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const client = options.protocol === 'https:' ? https : http;
        const req = client.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        statusCode: res.statusCode,
                        data: JSON.parse(body),
                        headers: res.headers
                    });
                } catch (e) {
                    resolve({
                        statusCode: res.statusCode,
                        data: body,
                        headers: res.headers
                    });
                }
            });
        });
        
        req.on('error', reject);
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function testAdoption() {
    const baseUrl = 'http://localhost:3000';
    
    console.log('=== Iniciando test de adopción completo ===');
    
    try {
        // 1. Crear nuevo usuario
        console.log('1. Creando nuevo usuario...');
        const username = `testuser_${Date.now()}`;
        const password = 'password123';
        const email = `test_${Date.now()}@example.com`;
        
        const registerResponse = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/auth/register',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, {
            username,
            password,
            email
        });
        
        console.log('Registro response:', registerResponse);
        
        if (registerResponse.statusCode !== 201) {
            console.log('Error en registro:', registerResponse.data);
            return;
        }
        
        // 2. Hacer login para obtener token
        console.log('2. Haciendo login...');
        const loginResponse = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, {
            username,
            password
        });
        
        console.log('Login response:', loginResponse);
        
        if (loginResponse.statusCode !== 200) {
            console.log('Error en login:', loginResponse.data);
            return;
        }
        
        const token = loginResponse.data.token;
        console.log('Token obtenido:', token ? 'Sí' : 'No');
        
        // 3. Obtener mascotas disponibles
        console.log('3. Obteniendo mascotas disponibles...');
        const petsResponse = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/mascotas/disponibles',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Mascotas disponibles:', petsResponse.data?.length || 0);
        
        if (!petsResponse.data || petsResponse.data.length === 0) {
            console.log('No hay mascotas disponibles');
            return;
        }
        
        const petId = petsResponse.data[0].id;
        console.log('Mascota seleccionada ID:', petId);
        
        // 4. Intentar adoptar
        console.log('4. Intentando adoptar mascota...');
        const adoptResponse = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: `/mis-mascotas/adoptar/${petId}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }, {});
        
        console.log('Adopción response:', adoptResponse);
        
    } catch (error) {
        console.error('Error en test:', error.message);
    }
}

testAdoption();
