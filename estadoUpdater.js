import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import Pet from './models/petModel.js';

async function actualizarEstados() {
  try {
    console.log(`[${new Date().toISOString()}] Iniciando actualización de estados...`);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conexión a MongoDB establecida');
    
    const mascotas = await Pet.find();
    console.log(`Se encontraron ${mascotas.length} mascotas para actualizar`);
    
    for (const mascota of mascotas) {
      console.log(`Actualizando mascota ${mascota._id} - ${mascota.nombre}`);
      console.log(`Estado antes - Hambre: ${mascota.hambre}, Felicidad: ${mascota.felicidad}, Limpieza: ${mascota.limpieza}, Energía: ${mascota.energia}, Salud: ${mascota.salud}`);
      
      // Si todos los valores son 1, establecerlos a valores más razonables
      if (mascota.hambre === 1 && mascota.felicidad === 1 && 
          mascota.limpieza === 1 && mascota.energia === 1 && mascota.salud === 1) {
        console.log(`Restaurando valores de mascota ${mascota.nombre} a valores razonables`);
        mascota.hambre = 50;
        mascota.felicidad = 70;
        mascota.limpieza = 60; 
        mascota.energia = 80;
        mascota.salud = 90;
        mascota.enfermedad = null;
      } else {
        // Disminuye el hambre en -2 (mínimo 10) - Ahora 1 es mucha hambre, 100 es satisfecho
        mascota.hambre = Math.max((mascota.hambre || 50) - 2, 10);
        // Disminuye la felicidad en -1 (mínimo 10)
        mascota.felicidad = Math.max((mascota.felicidad || 70) - 1, 10);
        // Disminuye la limpieza en -1 (mínimo 10)
        mascota.limpieza = Math.max((mascota.limpieza || 60) - 1, 10);
        // Disminuye la energía en -1 (mínimo 10)
        mascota.energia = Math.max((mascota.energia || 80) - 1, 10);
      }
      
      console.log(`Estado después - Hambre: ${mascota.hambre}, Felicidad: ${mascota.felicidad}, Limpieza: ${mascota.limpieza}, Energía: ${mascota.energia}, Salud: ${mascota.salud}`);

      // Enfermedades
      if (mascota.hambre <= 10) {
        mascota.enfermedad = 'dolor de estómago';
      } else if (mascota.limpieza <= 10) {
        mascota.enfermedad = 'gripa';
      } else if (mascota.felicidad <= 10) {
        mascota.enfermedad = 'dolor de cabeza';
      } else if (mascota.energia <= 10) {
        mascota.enfermedad = 'fatiga';
      } else {
        mascota.enfermedad = null;
      }
      
      // Si la mascota tiene alguna enfermedad, disminuir la salud
      if (mascota.enfermedad) {
        const saludAnterior = mascota.salud;
        mascota.salud = Math.max((mascota.salud || 100) - 10, 1);
        console.log(`Mascota enferma de ${mascota.enfermedad}: salud bajó de ${saludAnterior} a ${mascota.salud}`);
      }
      try {
        await mascota.save();
        console.log(`Mascota ${mascota.nombre} guardada correctamente en la base de datos`);
      } catch (saveErr) {
        console.error(`Error al guardar la mascota ${mascota.nombre}:`, saveErr);
      }
    }
    // await mongoose.disconnect(); // No desconectar aquí, deja la conexión abierta
    console.log('Estados de mascotas actualizados correctamente');
  } catch (err) {
    console.error('Error al actualizar estados de mascotas:', err);
  }
}

// Ejecutar cada 15 segundos (más frecuente para facilitar pruebas)
const INTERVALO_ACTUALIZACION = 15000; // 15 segundos
console.log(`Configurando actualización de estados cada ${INTERVALO_ACTUALIZACION/1000} segundos`);
setInterval(actualizarEstados, INTERVALO_ACTUALIZACION);

// Ejecutar una vez al iniciar
console.log('Ejecutando actualización inicial de estados...');
actualizarEstados();