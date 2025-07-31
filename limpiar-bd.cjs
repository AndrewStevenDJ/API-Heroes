const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Configurar conexión a MongoDB
const MONGO_URI = process.env.MONGO_URI;

// Esquemas de los modelos (simplificados para esta operación)
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String
}, { collection: 'users' });

const petSchema = new mongoose.Schema({
  id: Number,
  nombre: String,
  ownerId: mongoose.Schema.Types.ObjectId
}, { collection: 'pets' });

const User = mongoose.model('User', userSchema);
const Pet = mongoose.model('Pet', petSchema);

async function limpiarBaseDatos() {
  try {
    console.log('🧹 ===== LIMPIEZA COMPLETA DE BASE DE DATOS =====');
    console.log('📡 Conectando a MongoDB Atlas...');
    
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB Atlas');
    
    // 1. Mostrar estado actual
    console.log('\n📊 === ESTADO ACTUAL ===');
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: { $ne: 'admin' } });
    const adoptedPets = await Pet.countDocuments({ ownerId: { $ne: null } });
    const availablePets = await Pet.countDocuments({ ownerId: null });
    
    console.log(`👥 Total usuarios: ${totalUsers}`);
    console.log(`👑 Usuarios admin: ${adminUsers}`);
    console.log(`👤 Usuarios regulares: ${regularUsers}`);
    console.log(`🐕 Mascotas adoptadas: ${adoptedPets}`);
    console.log(`🆓 Mascotas disponibles: ${availablePets}`);
    
    // 2. Liberar todas las mascotas adoptadas
    console.log('\n🔓 === LIBERANDO MASCOTAS ===');
    const liberarResult = await Pet.updateMany(
      { ownerId: { $ne: null } },
      { $unset: { ownerId: 1 } }
    );
    console.log(`✅ ${liberarResult.modifiedCount} mascotas liberadas`);
    
    // 3. Eliminar usuarios no-admin
    console.log('\n🗑️ === ELIMINANDO USUARIOS NO-ADMIN ===');
    const usuariosAEliminar = await User.find({ role: { $ne: 'admin' } }).select('username role');
    
    if (usuariosAEliminar.length > 0) {
      console.log('Usuarios que serán eliminados:');
      usuariosAEliminar.forEach(user => {
        console.log(`  - ${user.username} (${user.role || 'usuario'})`);
      });
      
      const deleteResult = await User.deleteMany({ role: { $ne: 'admin' } });
      console.log(`✅ ${deleteResult.deletedCount} usuarios eliminados`);
    } else {
      console.log('ℹ️ No hay usuarios no-admin para eliminar');
    }
    
    // 4. Mostrar estado final
    console.log('\n📊 === ESTADO FINAL ===');
    const finalTotalUsers = await User.countDocuments();
    const finalAdminUsers = await User.countDocuments({ role: 'admin' });
    const finalAdoptedPets = await Pet.countDocuments({ ownerId: { $ne: null } });
    const finalAvailablePets = await Pet.countDocuments({ ownerId: null });
    
    console.log(`👥 Total usuarios: ${finalTotalUsers}`);
    console.log(`👑 Usuarios admin: ${finalAdminUsers}`);
    console.log(`🐕 Mascotas adoptadas: ${finalAdoptedPets}`);
    console.log(`🆓 Mascotas disponibles: ${finalAvailablePets}`);
    
    // 5. Mostrar usuarios admin restantes
    console.log('\n👑 === USUARIOS ADMIN PRESERVADOS ===');
    const adminsRestantes = await User.find({ role: 'admin' }).select('username role');
    if (adminsRestantes.length > 0) {
      adminsRestantes.forEach(admin => {
        console.log(`  - ${admin.username} (${admin.role})`);
      });
    } else {
      console.log('⚠️ No hay usuarios admin en la base de datos');
    }
    
    console.log('\n✅ ¡Limpieza de base de datos completada exitosamente!');
    console.log('🎮 Ahora puedes crear nuevos usuarios y adoptar mascotas');
    
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Desconectado de MongoDB');
  }
}

// Ejecutar la limpieza
limpiarBaseDatos();
