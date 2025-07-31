import express from 'express';
import mongoose from 'mongoose';
import Pet from '../models/petModel.js';
import { authenticate } from './authMiddleware.js';
import Objeto from '../models/objetoModel.js';

const router = express.Router();

// Obtener mascotas disponibles para adoptar
router.get('/disponibles', authenticate, async (req, res) => {
  try {
    console.log('🔍 ===== SOLICITUD DE MASCOTAS DISPONIBLES =====');
    console.log('👤 Usuario solicitante:', req.user?.username || 'Unknown');
    console.log('🆔 Usuario ID:', req.user?.id);
    
    const disponibles = await Pet.find({ ownerId: null });
    console.log('📊 Total mascotas disponibles encontradas:', disponibles.length);
    
    if (disponibles.length > 0) {
      console.log('🐾 Primeras 3 mascotas disponibles:');
      disponibles.slice(0, 3).forEach((pet, index) => {
        console.log(`   ${index + 1}. ${pet.nombre} (ID: ${pet.id || pet._id}) - Tipo: ${pet.tipo}`);
      });
    } else {
      console.log('❌ No se encontraron mascotas disponibles');
    }
    
    res.json(disponibles);
  } catch (error) {
    console.error('❌ Error obteniendo mascotas disponibles:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Adoptar una mascota
router.post('/adoptar/:petId', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const petId = req.params.petId;
    
    console.log('🐾 ===== NUEVO INTENTO DE ADOPCIÓN =====');
    console.log('👤 Usuario ID:', userId);
    console.log('🐕 Pet ID recibido:', petId);
    console.log('🔍 Tipo de userId:', typeof userId);
    console.log('🔍 Tipo de petId:', typeof petId);
    console.log('🔍 URL completa:', req.originalUrl);
    console.log('🔍 Headers:', JSON.stringify(req.headers.authorization?.substring(0, 20) + '...'));
    
    // Verificar que el usuario no tenga ya una mascota
    const yaTiene = await Pet.findOne({ ownerId: userId });
    console.log('🔍 ¿Ya tiene mascota?:', yaTiene ? 'SÍ' : 'NO');
    if (yaTiene) {
      console.log('❌ Usuario ya tiene mascota:', yaTiene.nombre, 'con ID:', yaTiene.id);
      return res.status(400).json({ error: 'Ya tienes una mascota adoptada' });
    }
    
    // Buscar mascota por _id de MongoDB o por id numérico
    let mascota;
    
    // Primero intentar buscar por _id de MongoDB
    if (petId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('🔍 Buscando por _id de MongoDB:', petId);
      mascota = await Pet.findOne({ _id: petId, ownerId: null });
    }
    
    // Si no se encontró, intentar buscar por id numérico
    if (!mascota) {
      const petIdNum = parseInt(petId);
      if (!isNaN(petIdNum)) {
        console.log('🔍 Buscando por ID numérico:', petIdNum);
        mascota = await Pet.findOne({ id: petIdNum, ownerId: null });
      }
    }
    
    console.log('🔍 Mascota encontrada:', mascota ? mascota.nombre : 'NO ENCONTRADA');
    if (!mascota) {
      return res.status(400).json({ error: 'Mascota no disponible o ya adoptada' });
    }
    
    // Asignar mascota al usuario
    mascota.ownerId = userId;
    await mascota.save();
    console.log('✅ Mascota adoptada exitosamente:', mascota.nombre);
    res.json({ mensaje: '¡Mascota adoptada con éxito!', mascota });
  } catch (error) {
    console.error('❌ Error en adopción:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ver la mascota propia
// Obtener todas las mascotas del usuario
router.get('/', authenticate, async (req, res) => {
  try {
    console.log('🔍 ===== SOLICITUD DE MIS MASCOTAS =====');
    console.log('👤 Usuario solicitante:', req.user?.username || 'Unknown');
    console.log('🆔 Usuario ID:', req.user?.id);
    
    const misMascotas = await Pet.find({ ownerId: req.user.id });
    console.log('📊 Total mascotas del usuario encontradas:', misMascotas.length);
    
    if (misMascotas.length > 0) {
      console.log('🐾 Mascotas del usuario:');
      misMascotas.forEach((pet, index) => {
        console.log(`   ${index + 1}. ${pet.nombre} (ID: ${pet.id || pet._id}) - Tipo: ${pet.tipo}`);
      });
    } else {
      console.log('❌ El usuario no tiene mascotas adoptadas');
    }
    
    res.json(misMascotas);
  } catch (error) {
    console.error('❌ Error obteniendo mascotas del usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener una mascota específica del usuario (mantener compatibilidad)
router.get('/mi-mascota', authenticate, async (req, res) => {
  const mascota = await Pet.findOne({ ownerId: req.user.id });
  if (!mascota) {
    return res.status(404).json({ error: 'No tienes mascota adoptada' });
  }
  res.json(mascota);
});

// Liberar mascota (eliminar dueño, no la borra)
router.delete('/liberar', authenticate, async (req, res) => {
  const mascota = await Pet.findOne({ ownerId: req.user.id });
  if (!mascota) {
    return res.status(404).json({ error: 'No tienes mascota para liberar' });
  }
  mascota.ownerId = null;
  await mascota.save();
  res.json({ mensaje: 'Mascota liberada, ahora está disponible para adopción' });
});

// Ver objetos disponibles
router.get('/objetos', authenticate, async (req, res) => {
  const objetos = await Objeto.find();
  res.json(objetos);
});

// Agregar objeto a la mascota
router.post('/mi-mascota/objetos/:objetoId', authenticate, async (req, res) => {
  const mascota = await Pet.findOne({ ownerId: req.user.id });
  if (!mascota) {
    return res.status(404).json({ error: 'No tienes mascota adoptada' });
  }
  const objeto = await Objeto.findById(req.params.objetoId);
  if (!objeto) {
    return res.status(404).json({ error: 'Objeto no encontrado' });
  }
  // Evitar duplicados
  if (mascota.ropa.some(r => r.id?.toString() === objeto._id.toString() || r.nombre === objeto.nombre)) {
    return res.status(400).json({ error: 'La mascota ya tiene este objeto' });
  }
  mascota.ropa.push({ id: objeto._id, nombre: objeto.nombre, descripcion: objeto.descripcion });
  await mascota.save();
  res.json({ mensaje: 'Objeto agregado a la mascota', ropa: mascota.ropa });
});

// Eliminar objeto de la mascota
router.delete('/mi-mascota/objetos/:objetoId', authenticate, async (req, res) => {
  const mascota = await Pet.findOne({ ownerId: req.user.id });
  if (!mascota) {
    return res.status(404).json({ error: 'No tienes mascota adoptada' });
  }
  const objetoId = req.params.objetoId;
  const ropaInicial = mascota.ropa.length;
  mascota.ropa = mascota.ropa.filter(r => r.id?.toString() !== objetoId);
  if (mascota.ropa.length === ropaInicial) {
    return res.status(404).json({ error: 'La mascota no tiene ese objeto' });
  }
  await mascota.save();
  res.json({ mensaje: 'Objeto eliminado de la mascota', ropa: mascota.ropa });
});

// Alimentar a la mascota
router.post('/mi-mascota/alimentar', authenticate, async (req, res) => {
  // Registrar la petición entrante para depuración
  console.log("Petición de alimentación recibida:", {
    headers: req.headers,
    body: req.body,
    user: req.user
  });

  const mascota = await Pet.findOne({ ownerId: req.user.id });
  if (!mascota) {
    return res.status(404).json({ error: 'No tienes mascota adoptada' });
  }
  
  // Convertir todos los valores a números y guardar el valor actual de hambre para reportarlo después
  const hambreActual = Number(mascota.hambre) || 0;
  
  // Asegurarse de que todos los valores son números válidos
  mascota.hambre = Number(mascota.hambre) || 0;
  mascota.salud = Number(mascota.salud) || 50;
  mascota.energia = Number(mascota.energia) || 50;
  mascota.felicidad = Number(mascota.felicidad) || 50;
  mascota.limpieza = Number(mascota.limpieza) || 50;
  
  console.log('Estado de la mascota antes de alimentar (valores normalizados):', {
    hambre: mascota.hambre,
    salud: mascota.salud,
    energia: mascota.energia,
    felicidad: mascota.felicidad,
    limpieza: mascota.limpieza,
    tipo: typeof mascota.hambre
  });
  
  if (mascota.hambre >= 100) {
    mascota.enfermedad = 'indigestión por exceso de comida';
    await mascota.save();
    console.log('Mascota ya satisfecha, no se alimentó más.');
    return res.json({ 
      mensaje: '¡Cuidado! La mascota ya está completamente satisfecha y se enfermó de indigestión.',
      mascota: mascota 
    });
  }
  
  // Incrementar el hambre en +25 (IMPORTANTE: Forzar un incremento mayor para probar)
  const incremento = 25;
  
  // Asegurarnos de que tengamos un valor numérico base para operar
  let valorBaseHambre = 10;  // Establecer un valor mínimo base
  
  // Convertir explícitamente a entero para evitar problemas con strings
  if (typeof mascota.hambre === 'number') {
    valorBaseHambre = mascota.hambre;
  } else if (typeof mascota.hambre === 'string') {
    valorBaseHambre = parseInt(mascota.hambre, 10) || 10;
  }
  
  console.log(`Valor base de hambre determinado: ${valorBaseHambre} (tipo: ${typeof valorBaseHambre})`);
  
  // Calcular el nuevo valor sumando directamente los números
  const nuevoHambre = valorBaseHambre + incremento;
  
  // Asignar el nuevo valor, asegurando que no exceda el máximo
  mascota.hambre = Math.min(nuevoHambre, 100);
  
  console.log(`Actualizando hambre: ${hambreActual}(${typeof hambreActual}) + ${incremento} = ${mascota.hambre} (${typeof mascota.hambre})`);
  
  // Registrar el ID de MongoDB para verificar que estemos actualizando la mascota correcta
  console.log(`ID de MongoDB de la mascota: ${mascota._id}`);
  // Registrar el ID numérico
  console.log(`ID numérico de la mascota: ${mascota.id}`);
  
  if (mascota.hambre === 100) {
    mascota.enfermedad = 'indigestión por exceso de comida';
  } else if (mascota.hambre > 75) {
    mascota.enfermedad = null;
  }
  
  try {
    console.log("Guardando mascota con hambre =", mascota.hambre);
    
    // MÉTODO DIRECTO: Actualizar directamente el valor usando findByIdAndUpdate
    // Esta es una forma más directa de actualizar un valor específico
    const resultado = await Pet.findByIdAndUpdate(
      mascota._id,
      { $set: { hambre: mascota.hambre } },
      { new: true, runValidators: true }
    );
    
    console.log("Resultado de actualización directa:", resultado ? resultado.hambre : "No encontrado");
    
    // Como plan de respaldo, también intentamos el método anterior
    // Asegurarnos de que todos los campos numéricos son números
    const mascotaActualizada = {
      ...mascota.toObject(),
      hambre: Number(mascota.hambre),
      salud: Number(mascota.salud),
      energia: Number(mascota.energia),
      felicidad: Number(mascota.felicidad),
      limpieza: Number(mascota.limpieza)
    };
    
    // También guardar usando el método tradicional save()
    mascota.markModified('hambre');  // Marcar explícitamente el campo como modificado
    await mascota.save();
    
    console.log("Guardado con save() completado. Valor actual:", mascota.hambre);
    
    console.log("Resultado de actualización:", resultado);
    
    // Verificar que se actualizó correctamente
    if (resultado.modifiedCount === 0) {
      console.warn("No se actualizó ningún documento, pero no hubo error");
    }
    
    // Obtener la mascota actualizada directamente de la base de datos para verificar
    const mascotaVerificada = await Pet.findById(mascota._id);
    
    if (!mascotaVerificada) {
      console.error("No se pudo verificar la mascota después de actualizar");
      return res.status(500).json({ 
        error: "Error al alimentar: no se pudo verificar la mascota actualizada",
      });
    }
    
    console.log("Mascota verificada después de actualizar:", {
      hambre: mascotaVerificada.hambre,
      tipo_hambre: typeof mascotaVerificada.hambre
    });
    
    // Hacer una MODIFICACIÓN DIRECTA a la base de datos como último recurso
    // Este es un enfoque agresivo que actualiza directamente el registro
    await Pet.collection.updateOne(
      { _id: mascota._id },
      { $set: { hambre: Number(mascota.hambre) } }
    );
    
    console.log("Actualización directa a nivel de colección MongoDB completada");
    
    // Volver a verificar después de la actualización directa
    const mascotaFinal = await Pet.findById(mascota._id);
    console.log("Valor final de hambre:", mascotaFinal.hambre);
    
    // Registrar detalles de la solicitud para depuración
    console.log("Request body:", req.body);
    
    // Devolver tanto el mensaje como la mascota actualizada
    return res.json({ 
      mensaje: `La mascota fue alimentada. Hambre antes: ${hambreActual}, después: ${mascotaFinal.hambre}`,
      mascota: mascotaFinal 
    });
  } catch (error) {
    console.error("Error al guardar/verificar mascota:", error);
    
    // Intentamos guardar de forma tradicional como último recurso
    await mascota.save();
    
    return res.json({ 
      mensaje: `La mascota fue alimentada pero hubo un error en la verificación.`,
      mascota: mascota
    });
  }
});

// Bañar a la mascota
router.post('/mi-mascota/banar', authenticate, async (req, res) => {
  const mascota = await Pet.findOne({ ownerId: req.user.id });
  if (!mascota) {
    return res.status(404).json({ error: 'No tienes mascota adoptada' });
  }
  mascota.limpieza = Math.min(mascota.limpieza + 25, 100);
  if (mascota.limpieza >= 75) {
    mascota.enfermedad = null;
  }
  await mascota.save();
  res.json({ mensaje: `Has bañado a la mascota. Limpieza actual: ${mascota.limpieza}` });
});

// Jugar con la mascota
router.post('/mi-mascota/jugar', authenticate, async (req, res) => {
  const mascota = await Pet.findOne({ ownerId: req.user.id });
  if (!mascota) {
    return res.status(404).json({ error: 'No tienes mascota adoptada' });
  }
  mascota.felicidad = Math.min(mascota.felicidad + 20, 100);
  mascota.hambre = Math.max(mascota.hambre - 5, 1);
  if (mascota.felicidad >= 75) {
    mascota.enfermedad = null;
  }
  await mascota.save();
  res.json({ mensaje: `La mascota jugó contigo. Felicidad actual: ${mascota.felicidad}, Hambre actual: ${mascota.hambre}` });
});

// Pasear a la mascota
router.post('/mi-mascota/pasear', authenticate, async (req, res) => {
  const mascota = await Pet.findOne({ ownerId: req.user.id });
  if (!mascota) {
    return res.status(404).json({ error: 'No tienes mascota adoptada' });
  }
  mascota.felicidad = Math.min(mascota.felicidad + 15, 100);
  mascota.limpieza = Math.max(mascota.limpieza - 10, 1);
  mascota.hambre = Math.max(mascota.hambre - 10, 1);
  if (mascota.felicidad >= 75) {
    mascota.enfermedad = null;
  }
  await mascota.save();
  res.json({ mensaje: `La mascota dio un paseo. Felicidad actual: ${mascota.felicidad}, Limpieza actual: ${mascota.limpieza}, Hambre actual: ${mascota.hambre}` });
});

// Curar a la mascota
router.post('/mi-mascota/curar', authenticate, async (req, res) => {
  const mascota = await Pet.findOne({ ownerId: req.user.id });
  if (!mascota) {
    return res.status(404).json({ error: 'No tienes mascota adoptada' });
  }
  if (!mascota.enfermedad) {
    return res.json({ mensaje: 'La mascota no está enferma.' });
  }
  const enfermedadCurada = mascota.enfermedad;
  mascota.enfermedad = null;
  await mascota.save();
  res.json({ mensaje: `La mascota fue curada del ${enfermedadCurada}.` });
});

// Hacer dormir a la mascota
router.post('/mi-mascota/dormir', authenticate, async (req, res) => {
  const mascota = await Pet.findOne({ ownerId: req.user.id });
  if (!mascota) {
    return res.status(404).json({ error: 'No tienes mascota adoptada' });
  }
  mascota.energia = Math.min(mascota.energia + 30, 100);
  if (mascota.energia >= 75) {
    if (mascota.enfermedad === 'fatiga') {
      mascota.enfermedad = null;
    }
  }
  await mascota.save();
  res.json({ mensaje: `La mascota ha dormido y recuperado energía. Energía actual: ${mascota.energia}` });
});

// Limpiar a la mascota
router.post('/mi-mascota/limpiar', authenticate, async (req, res) => {
  try {
    console.log('🛁 ===== LIMPIANDO MASCOTA =====');
    console.log('👤 Usuario:', req.user?.username);
    
    const mascota = await Pet.findOne({ ownerId: req.user.id });
    if (!mascota) {
      return res.status(404).json({ error: 'No tienes mascota adoptada' });
    }
    
    // Convertir valores a números y validar
    mascota.limpieza = Number(mascota.limpieza) || 0;
    mascota.salud = Number(mascota.salud) || 50;
    mascota.felicidad = Number(mascota.felicidad) || 50;
    
    const limpiezaAnterior = mascota.limpieza;
    
    // Aumentar limpieza
    mascota.limpieza = Math.min(mascota.limpieza + 25, 100);
    
    // Si la limpieza es alta, curar enfermedad de suciedad
    if (mascota.limpieza >= 80 && mascota.enfermedad === 'suciedad') {
      mascota.enfermedad = null;
      console.log('🎉 Enfermedad de suciedad curada');
    }
    
    // Pequeño aumento de felicidad
    mascota.felicidad = Math.min(mascota.felicidad + 5, 100);
    
    await mascota.save();
    
    console.log(`✅ Mascota limpiada: ${limpiezaAnterior} → ${mascota.limpieza}`);
    res.json({ 
      mensaje: `${mascota.nombre} está más limpio. Limpieza: ${mascota.limpieza}%`,
      mascota: mascota
    });
  } catch (error) {
    console.error('❌ Error limpiando mascota:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Acariciar a la mascota
router.post('/mi-mascota/acariciar', authenticate, async (req, res) => {
  try {
    console.log('💕 ===== ACARICIANDO MASCOTA =====');
    console.log('👤 Usuario:', req.user?.username);
    
    const mascota = await Pet.findOne({ ownerId: req.user.id });
    if (!mascota) {
      return res.status(404).json({ error: 'No tienes mascota adoptada' });
    }
    
    // Convertir valores a números y validar
    mascota.felicidad = Number(mascota.felicidad) || 0;
    mascota.salud = Number(mascota.salud) || 50;
    
    const felicidadAnterior = mascota.felicidad;
    
    // Aumentar felicidad significativamente
    mascota.felicidad = Math.min(mascota.felicidad + 15, 100);
    
    // Si la felicidad es alta, curar enfermedad de tristeza
    if (mascota.felicidad >= 80 && mascota.enfermedad === 'tristeza') {
      mascota.enfermedad = null;
      console.log('🎉 Enfermedad de tristeza curada');
    }
    
    // Pequeño aumento de salud
    mascota.salud = Math.min(mascota.salud + 3, 100);
    
    await mascota.save();
    
    console.log(`✅ Mascota acariciada: felicidad ${felicidadAnterior} → ${mascota.felicidad}`);
    res.json({ 
      mensaje: `${mascota.nombre} se siente muy querido. Felicidad: ${mascota.felicidad}%`,
      mascota: mascota
    });
  } catch (error) {
    console.error('❌ Error acariciando mascota:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ========== ENDPOINTS PARA MÚLTIPLES MASCOTAS ==========

// Alimentar mascota específica
router.post('/:petId/alimentar', authenticate, async (req, res) => {
  try {
    console.log('🍎 ===== ALIMENTANDO MASCOTA =====');
    console.log('👤 Usuario:', req.user?.username);
    console.log('🆔 Pet ID:', req.params.petId);
    
    // Buscar la mascota por ID y verificar que pertenezca al usuario
    const mascota = await Pet.findOne({ 
      $or: [
        { _id: req.params.petId, ownerId: req.user.id },
        { id: req.params.petId, ownerId: req.user.id }
      ]
    });
    
    if (!mascota) {
      console.log('❌ Mascota no encontrada o no pertenece al usuario');
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }
    
    console.log('🐾 Mascota encontrada:', mascota.nombre);
    console.log('📊 Estado antes:', {
      hambre: mascota.hambre,
      felicidad: mascota.felicidad,
      energia: mascota.energia,
      salud: mascota.salud,
      limpieza: mascota.limpieza
    });
    
    // Verificar si la mascota necesita comida
    if (mascota.hambre <= 10) {
      return res.status(400).json({ 
        error: 'La mascota no tiene hambre en este momento',
        mascota: mascota
      });
    }
    
    // Reducir hambre y aumentar felicidad
    mascota.hambre = Math.max(0, mascota.hambre - 25);
    mascota.felicidad = Math.min(100, mascota.felicidad + 10);
    mascota.energia = Math.min(100, mascota.energia + 5);
    
    await mascota.save();
    
    console.log('📊 Estado después:', {
      hambre: mascota.hambre,
      felicidad: mascota.felicidad,
      energia: mascota.energia,
      salud: mascota.salud,
      limpieza: mascota.limpieza
    });
    
    res.json({ 
      mensaje: '¡Mascota alimentada correctamente!', 
      mascota: mascota 
    });
  } catch (error) {
    console.error('❌ Error alimentando mascota:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Jugar con mascota específica
router.post('/:petId/jugar', authenticate, async (req, res) => {
  try {
    console.log('🎮 ===== JUGANDO CON MASCOTA =====');
    console.log('👤 Usuario:', req.user?.username);
    console.log('🆔 Pet ID:', req.params.petId);
    
    const mascota = await Pet.findOne({ 
      $or: [
        { _id: req.params.petId, ownerId: req.user.id },
        { id: req.params.petId, ownerId: req.user.id }
      ]
    });
    
    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }
    
    if (mascota.energia <= 15) {
      return res.status(400).json({ 
        error: 'La mascota está muy cansada para jugar',
        mascota: mascota
      });
    }
    
    // Aumentar felicidad, reducir energía
    mascota.felicidad = Math.min(100, mascota.felicidad + 20);
    mascota.energia = Math.max(0, mascota.energia - 15);
    mascota.hambre = Math.min(100, mascota.hambre + 10);
    
    await mascota.save();
    
    res.json({ 
      mensaje: '¡Tiempo de juego divertido!', 
      mascota: mascota 
    });
  } catch (error) {
    console.error('❌ Error jugando con mascota:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Dormir mascota específica
router.post('/:petId/dormir', authenticate, async (req, res) => {
  try {
    console.log('😴 ===== MASCOTA DURMIENDO =====');
    console.log('👤 Usuario:', req.user?.username);
    console.log('🆔 Pet ID:', req.params.petId);
    
    const mascota = await Pet.findOne({ 
      $or: [
        { _id: req.params.petId, ownerId: req.user.id },
        { id: req.params.petId, ownerId: req.user.id }
      ]
    });
    
    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }
    
    if (mascota.energia >= 90) {
      return res.status(400).json({ 
        error: 'La mascota ya tiene mucha energía',
        mascota: mascota
      });
    }
    
    // Restaurar energía y salud
    mascota.energia = Math.min(100, mascota.energia + 30);
    mascota.salud = Math.min(100, mascota.salud + 10);
    mascota.felicidad = Math.min(100, mascota.felicidad + 5);
    
    await mascota.save();
    
    res.json({ 
      mensaje: '¡La mascota ha descansado bien!', 
      mascota: mascota 
    });
  } catch (error) {
    console.error('❌ Error con descanso de mascota:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Limpiar mascota específica
router.post('/:petId/limpiar', authenticate, async (req, res) => {
  try {
    console.log('🛁 ===== LIMPIANDO MASCOTA =====');
    console.log('👤 Usuario:', req.user?.username);
    console.log('🆔 Pet ID:', req.params.petId);
    
    const mascota = await Pet.findOne({ 
      $or: [
        { _id: req.params.petId, ownerId: req.user.id },
        { id: req.params.petId, ownerId: req.user.id }
      ]
    });
    
    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }
    
    if (mascota.limpieza >= 90) {
      return res.status(400).json({ 
        error: 'La mascota ya está muy limpia',
        mascota: mascota
      });
    }
    
    // Aumentar limpieza y felicidad
    mascota.limpieza = Math.min(100, mascota.limpieza + 25);
    mascota.felicidad = Math.min(100, mascota.felicidad + 10);
    mascota.salud = Math.min(100, mascota.salud + 5);
    
    await mascota.save();
    
    res.json({ 
      mensaje: '¡Mascota limpia y fresca!', 
      mascota: mascota 
    });
  } catch (error) {
    console.error('❌ Error limpiando mascota:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Acariciar mascota específica
router.post('/:petId/acariciar', authenticate, async (req, res) => {
  try {
    console.log('💕 ===== ACARICIANDO MASCOTA =====');
    console.log('👤 Usuario:', req.user?.username);
    console.log('🆔 Pet ID:', req.params.petId);
    
    const mascota = await Pet.findOne({ 
      $or: [
        { _id: req.params.petId, ownerId: req.user.id },
        { id: req.params.petId, ownerId: req.user.id }
      ]
    });
    
    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }
    
    // Aumentar felicidad y salud ligeramente
    mascota.felicidad = Math.min(100, mascota.felicidad + 15);
    mascota.salud = Math.min(100, mascota.salud + 8);
    
    await mascota.save();
    
    res.json({ 
      mensaje: '¡La mascota se siente querida!', 
      mascota: mascota 
    });
  } catch (error) {
    console.error('❌ Error acariciando mascota:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Curar mascota específica
router.post('/:petId/curar', authenticate, async (req, res) => {
  try {
    console.log('💊 ===== CURANDO MASCOTA =====');
    console.log('👤 Usuario:', req.user?.username);
    console.log('🆔 Pet ID:', req.params.petId);
    
    const mascota = await Pet.findOne({ 
      $or: [
        { _id: req.params.petId, ownerId: req.user.id },
        { id: req.params.petId, ownerId: req.user.id }
      ]
    });
    
    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }
    
    if (mascota.salud >= 95) {
      return res.status(400).json({ 
        error: 'La mascota ya está muy saludable',
        mascota: mascota
      });
    }
    
    // Restaurar salud significativamente
    mascota.salud = Math.min(100, mascota.salud + 30);
    mascota.felicidad = Math.min(100, mascota.felicidad + 5);
    
    await mascota.save();
    
    res.json({ 
      mensaje: '¡Mascota curada correctamente!', 
      mascota: mascota 
    });
  } catch (error) {
    console.error('❌ Error curando mascota:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;