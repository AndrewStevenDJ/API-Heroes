import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testEndpoint(method, endpoint, body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    console.log(`✅ ${method} ${endpoint} - Status: ${response.status}`);
    console.log(`   Response:`, JSON.stringify(data, null, 2));
    console.log('');
    
    return { success: true, data, status: response.status };
  } catch (error) {
    console.log(`❌ ${method} ${endpoint} - Error: ${error.message}`);
    console.log('');
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🧪 Iniciando pruebas de la API...\n');
  
  // Pruebas básicas de mascotas
  console.log('📋 === PRUEBAS DE MASCOTAS ===');
  await testEndpoint('GET', '/mascotas');
  await testEndpoint('GET', '/mascotas/disponibles');
  
  // Pruebas de acciones de mascotas
  console.log('🎮 === PRUEBAS DE ACCIONES ===');
  await testEndpoint('POST', '/mascotas/1/alimentar');
  await testEndpoint('POST', '/mascotas/1/banar');
  await testEndpoint('POST', '/mascotas/1/jugar');
  await testEndpoint('POST', '/mascotas/1/pasear');
  await testEndpoint('GET', '/mascotas/1/estado');
  await testEndpoint('GET', '/mascotas/1/ropa');
  await testEndpoint('POST', '/mascotas/1/ropa', { ropa: ['capa roja', 'máscara'] });
  
  // Pruebas de héroes
  console.log('🦸 === PRUEBAS DE HÉROES ===');
  await testEndpoint('GET', '/heroes');
  await testEndpoint('GET', '/heroes/1/mascota');
  
  // Pruebas de errores
  console.log('⚠️ === PRUEBAS DE ERRORES ===');
  await testEndpoint('GET', '/mascotas/999/estado'); // Mascota inexistente
  await testEndpoint('POST', '/mascotas/999/alimentar'); // Mascota inexistente
  
  console.log('🏁 Pruebas completadas!');
}

// Ejecutar las pruebas
runTests().catch(console.error); 