import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import Pet from './models/petModel.js';

async function actualizarEstados() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const mascotas = await Pet.find();
    for (const mascota of mascotas) {
      // Aumenta el hambre en +2 (máximo 20)
      mascota.hambre = Math.min((mascota.hambre || 0) + 2, 20);
      // Disminuye la felicidad en -2 (mínimo 0)
      mascota.felicidad = Math.max((mascota.felicidad || 0) - 2, 0);
      // Disminuye la limpieza en -2 (mínimo 0)
      mascota.limpieza = Math.max((mascota.limpieza || 0) - 2, 0);

      // Enfermedades
      if (mascota.hambre >= 20) {
        mascota.enfermedad = 'dolor de estómago';
      } else if (mascota.limpieza <= 2) {
        mascota.enfermedad = 'gripa';
      } else if (mascota.felicidad <= 2) {
        mascota.enfermedad = 'dolor de cabeza';
      } else {
        mascota.enfermedad = null;
      }
      await mascota.save();
    }
    await mongoose.disconnect();
    console.log('Estados de mascotas actualizados');
  } catch (err) {
    console.error('Error al actualizar estados de mascotas:', err);
  }
}

// Ejecutar cada 30 segundos
setInterval(actualizarEstados, 30000);

// Ejecutar una vez al iniciar
actualizarEstados(); 