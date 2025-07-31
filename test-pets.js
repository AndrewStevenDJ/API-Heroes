import mongoose from 'mongoose';
import Pet from './models/petModel.js';

// Conectar a MongoDB
const MONGODB_URI = 'mongodb+srv://StevenDB:andrewsteven@clusterhero.qdnsvij.mongodb.net/?retryWrites=true&w=majority&appName=ClusterHero';

async function verificarMascotas() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    // Obtener mascotas disponibles
    const disponibles = await Pet.find({ ownerId: null }).limit(10);
    console.log(`📊 Mascotas disponibles: ${disponibles.length}`);
    
    if (disponibles.length > 0) {
      console.log('\n🐾 Primeras mascotas disponibles:');
      disponibles.forEach((pet, index) => {
        console.log(`${index + 1}. ID: ${pet.id}, Nombre: ${pet.nombre}, Tipo: ${pet.tipo}`);
        console.log(`   SVG: ${pet.svg ? 'Sí (' + pet.svg.length + ' caracteres)' : 'No'}`);
        console.log(`   OwnerID: ${pet.ownerId || 'null'}`);
        console.log('');
      });
    } else {
      console.log('❌ No hay mascotas disponibles');
    }
    
    await mongoose.disconnect();
    console.log('👋 Desconectado de MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verificarMascotas();
