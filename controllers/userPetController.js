import express from 'express';
import Pet from '../models/petModel.js';
import { authenticate } from './authMiddleware.js';
import Objeto from '../models/objetoModel.js';

const router = express.Router();

// Obtener mascotas disponibles para adoptar
router.get('/disponibles', authenticate, async (req, res) => {
  const disponibles = await Pet.find({ ownerId: null });
  res.json(disponibles);
});

// Adoptar una mascota
router.post('/adoptar/:petId', authenticate, async (req, res) => {
  const userId = req.user.id;
  const petId = req.params.petId;
  // Verificar que el usuario no tenga ya una mascota
  const yaTiene = await Pet.findOne({ ownerId: userId });
  if (yaTiene) {
    return res.status(400).json({ error: 'Ya tienes una mascota adoptada' });
  }
  // Verificar que la mascota esté disponible
  const mascota = await Pet.findOne({ _id: petId, ownerId: null });
  if (!mascota) {
    return res.status(400).json({ error: 'Mascota no disponible' });
  }
  mascota.ownerId = userId;
  await mascota.save();
  res.json({ mensaje: '¡Mascota adoptada con éxito!', mascota });
});

// Ver la mascota propia
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

/**
 * @swagger
 * /mis-mascotas/estado:
 *   get:
 *     summary: Ver el estado de tu mascota
 *     tags: [Estado]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Estado de la mascota
 *       404:
 *         description: No tienes mascota adoptada
 */
router.get('/estado', authenticate, async (req, res) => {
  const mascota = await Pet.findOne({ ownerId: req.user.id });
  if (!mascota) {
    return res.status(404).json({ error: 'No tienes mascota adoptada' });
  }
  // Puedes personalizar qué campos mostrar
  const estado = {
    hambre: mascota.hambre,
    felicidad: mascota.felicidad,
    limpieza: mascota.limpieza,
    enfermedad: mascota.enfermedad
  };
  res.json(estado);
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
  const mascota = await Pet.findOne({ ownerId: req.user.id });
  if (!mascota) {
    return res.status(404).json({ error: 'No tienes mascota adoptada' });
  }
  if (mascota.hambre <= 0) {
    mascota.enfermedad = 'indigestión por exceso de comida';
    await mascota.save();
    return res.json({ mensaje: '¡Cuidado! La mascota ya no tiene hambre y se enfermó de indigestión.' });
  }
  mascota.hambre = Math.max(mascota.hambre - 3, 0);
  if (mascota.hambre === 0) {
    mascota.enfermedad = 'indigestión por exceso de comida';
  } else if (mascota.hambre < 5) {
    mascota.enfermedad = null;
  }
  await mascota.save();
  res.json({ mensaje: `La mascota fue alimentada. Hambre actual: ${mascota.hambre}` });
});

// Bañar a la mascota
router.post('/mi-mascota/banar', authenticate, async (req, res) => {
  const mascota = await Pet.findOne({ ownerId: req.user.id });
  if (!mascota) {
    return res.status(404).json({ error: 'No tienes mascota adoptada' });
  }
  mascota.limpieza = Math.min(mascota.limpieza + 5, 20);
  if (mascota.limpieza >= 15) {
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
  mascota.felicidad = Math.min(mascota.felicidad + 4, 20);
  mascota.hambre = Math.min(mascota.hambre + 1, 20);
  if (mascota.felicidad >= 15) {
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
  mascota.felicidad = Math.min(mascota.felicidad + 3, 20);
  mascota.limpieza = Math.max(mascota.limpieza - 2, 0);
  mascota.hambre = Math.min(mascota.hambre + 2, 20);
  if (mascota.felicidad >= 15) {
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

export default router; 