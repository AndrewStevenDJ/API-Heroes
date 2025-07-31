import mongoose from 'mongoose';
import Pet from './models/petModel.js';
import User from './models/userModel.js';

// Conectar a MongoDB
const MONGODB_URI = 'mongodb+srv://StevenDB:andrewsteven@clusterhero.qdnsvij.mongodb.net/?retryWrites=true&w=majority&appName=ClusterHero';

async function debugPets() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    // Obtener todos los usuarios
    const users = await User.find({}, { _id: 1, username: 1 });
    console.log('\n👤 Usuarios en la base de datos:');
    users.forEach(user => {
      console.log(`  - ${user.username} (ID: ${user._id})`);
    });
    
    // Obtener todas las mascotas
    const pets = await Pet.find({}, { _id: 1, nombre: 1, ownerId: 1 });
    console.log('\n🐾 Estado de mascotas:');
    console.log(`Total de mascotas: ${pets.length}`);
    
    const disponibles = pets.filter(pet => pet.ownerId === null);
    const adoptadas = pets.filter(pet => pet.ownerId !== null);
    
    console.log(`\n📊 Resumen:`);
    console.log(`  - Disponibles: ${disponibles.length}`);
    console.log(`  - Adoptadas: ${adoptadas.length}`);
    
    if (adoptadas.length > 0) {
      console.log('\n🏠 Mascotas adoptadas:');
      for (const pet of adoptadas) {
        const owner = await User.findById(pet.ownerId);
        console.log(`  - ${pet.nombre} → ${owner ? owner.username : 'Usuario no encontrado'} (${pet.ownerId})`);
      }
    }
    
    // Verificar mascotas huérfanas (ownerId no válido)
    console.log('\n🔍 Verificando mascotas huérfanas...');
    for (const pet of adoptadas) {
      const owner = await User.findById(pet.ownerId);
      if (!owner) {
        console.log(`⚠️ MASCOTA HUÉRFANA: ${pet.nombre} tiene ownerId ${pet.ownerId} pero el usuario no existe`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
  }
}

debugPets();
