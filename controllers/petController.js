import express from 'express';
import petService from '../services/petService.js';
import Pet from '../models/petModel.js';
import { authenticate, requireRole } from './authMiddleware.js';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Mascota
 *   description: Endpoints para gestión de mascotas
 */

/**
 * @swagger
 * /mascotas:
 *   get:
 *     summary: Obtener todas las mascotas
 *     tags: [Mascota]
 *     responses:
 *       200:
 *         description: Lista de mascotas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mascota'
 *     security: [{ bearerAuth: [] }]
 */
// GET /mascotas - obtener todas las mascotas
router.get('/', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /mascotas/disponibles:
 *   get:
 *     summary: Obtener mascotas sin dueño
 *     tags: [Mascota]
 *     responses:
 *       200:
 *         description: Lista de mascotas disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mascota'
 *     security: [{ bearerAuth: [] }]
 */
// GET /mascotas/disponibles - obtener solo las mascotas sin dueño
router.get('/disponibles', async (req, res) => {
  try {
    // Buscar mascotas sin dueño, ya sea ownerId o duenioId en null
    const pets = await Pet.find({ $or: [ { ownerId: null }, { duenioId: null } ] });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /mascotas:
 *   post:
 *     summary: Agregar una mascota
 *     tags: [Mascota]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MascotaInput'
 *     responses:
 *       201:
 *         description: Mascota creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mascota'
 *       400:
 *         description: Faltan campos obligatorios
 *     security: [{ bearerAuth: [] }]
 */
// POST /mascotas - agregar una mascota (permitir id opcional)
router.post('/', authenticate, requireRole('admin'), async (req, res) => {
  const { nombre, tipo, superpoder } = req.body;
  if (!nombre || !tipo || !superpoder) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, tipo, superpoder' });
  }
  try {
    // Obtener el siguiente id secuencial
    const lastPet = await Pet.findOne().sort({ id: -1 });
    const nextId = lastPet && lastPet.id ? lastPet.id + 1 : 1;
    const newPet = new Pet({ id: nextId, nombre, tipo, superpoder });
    await newPet.save();
    res.status(201).json(newPet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /mascotas/{id}:
 *   put:
 *     summary: Actualizar una mascota
 *     tags: [Mascota]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MascotaInput'
 *     responses:
 *       200:
 *         description: Mascota actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mascota'
 *       404:
 *         description: Mascota no encontrada
 *     security: [{ bearerAuth: [] }]
 */
// PUT /mascotas/:id - actualizar una mascota
router.put('/:id', authenticate, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { nombre, tipo, superpoder } = req.body;
  try {
    const updatedPet = await petService.updatePet(id, { nombre, tipo, superpoder });
    res.json(updatedPet);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /mascotas/{id}:
 *   delete:
 *     summary: Eliminar una mascota
 *     tags: [Mascota]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota eliminada
 *       404:
 *         description: Mascota no encontrada
 *     security: [{ bearerAuth: [] }]
 */
// DELETE /mascotas/:id - eliminar una mascota
router.delete('/:id', authenticate, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    const result = await petService.deletePet(id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /mascotas/{id}/alimentar:
 *   post:
 *     summary: Alimentar a una mascota
 *     tags: [Cuidado]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mensaje de resultado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *       404:
 *         description: Mascota no encontrada
 *     security: [{ bearerAuth: [] }]
 */
router.post('/:id/alimentar', async (req, res) => {
  const { id } = req.params;
  try {
    const mascota = await findPetByAnyId(id);
    if (!mascota) throw new Error('Mascota no encontrada');
    const resultado = await petService.alimentarMascota(id);
    res.json(resultado);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /mascotas/{id}/banar:
 *   post:
 *     summary: Bañar a una mascota
 *     tags: [Cuidado]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mensaje de resultado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *       404:
 *         description: Mascota no encontrada
 *     security: [{ bearerAuth: [] }]
 */
router.post('/:id/banar', async (req, res) => {
  const { id } = req.params;
  try {
    const mascota = await findPetByAnyId(id);
    if (!mascota) throw new Error('Mascota no encontrada');
    const resultado = await petService.banarMascota(id);
    res.json(resultado);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /mascotas/{id}/jugar:
 *   post:
 *     summary: Jugar con una mascota
 *     tags: [Cuidado]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mensaje de resultado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *       404:
 *         description: Mascota no encontrada
 *     security: [{ bearerAuth: [] }]
 */
router.post('/:id/jugar', async (req, res) => {
  const { id } = req.params;
  try {
    const mascota = await findPetByAnyId(id);
    if (!mascota) throw new Error('Mascota no encontrada');
    const resultado = await petService.jugarMascota(id);
    res.json(resultado);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /mascotas/{id}/pasear:
 *   post:
 *     summary: Pasear con una mascota
 *     tags: [Cuidado]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mensaje de resultado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *       404:
 *         description: Mascota no encontrada
 *     security: [{ bearerAuth: [] }]
 */
router.post('/:id/pasear', async (req, res) => {
  const { id } = req.params;
  try {
    const mascota = await findPetByAnyId(id);
    if (!mascota) throw new Error('Mascota no encontrada');
    const resultado = await petService.pasearMascota(id);
    res.json(resultado);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /mascotas/{id}/curar:
 *   post:
 *     summary: Curar a una mascota enferma
 *     tags: [Cuidado]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mensaje de resultado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *       404:
 *         description: Mascota no encontrada
 *     security: [{ bearerAuth: [] }]
 */
router.post('/:id/curar', async (req, res) => {
  const { id } = req.params;
  try {
    const mascota = await findPetByAnyId(id);
    if (!mascota) throw new Error('Mascota no encontrada');
    const resultado = await petService.curarMascota(id);
    res.json(resultado);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /mascotas/{id}/ropa:
 *   get:
 *     summary: Ver la ropa de una mascota
 *     tags: [Personalización]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Ropa de la mascota
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 ropa:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: Mascota no encontrada
 *     security: [{ bearerAuth: [] }]
 */
router.get('/:id/ropa', async (req, res) => {
  const { id } = req.params;
  try {
    const mascota = await findPetByAnyId(id);
    if (!mascota) throw new Error('Mascota no encontrada');
    const resultado = await petService.verRopa(id);
    res.json(resultado);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /mascotas/{id}/ropa:
 *   post:
 *     summary: Cambiar la ropa de una mascota
 *     tags: [Personalización]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ropa:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de prendas de ropa
 *     responses:
 *       200:
 *         description: Mensaje de resultado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *       404:
 *         description: Mascota no encontrada
 *     security: [{ bearerAuth: [] }]
 */
router.post('/:id/ropa', async (req, res) => {
  const { id } = req.params;
  const { ropa } = req.body;
  if (!ropa || !Array.isArray(ropa)) {
    return res.status(400).json({ error: 'Debes enviar un array de ropa' });
  }
  try {
    const mascota = await findPetByAnyId(id);
    if (!mascota) throw new Error('Mascota no encontrada');
    const resultado = await petService.cambiarRopa(id, ropa);
    res.json(resultado);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /mascotas/{id}/estado:
 *   get:
 *     summary: Ver el estado completo de una mascota
 *     tags: [Estado]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Estado de la mascota
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 estado:
 *                   type: object
 *                   properties:
 *                     hambre:
 *                       type: number
 *                     felicidad:
 *                       type: number
 *                     limpieza:
 *                       type: number
 *                     enfermedad:
 *                       type: string
 *                     ropa:
 *                       type: array
 *                       items:
 *                         type: string
 *       404:
 *         description: Mascota no encontrada
 *     security: [{ bearerAuth: [] }]
 */
router.get('/:id/estado', async (req, res) => {
  const { id } = req.params;
  try {
    const mascota = await findPetByAnyId(id);
    if (!mascota) throw new Error('Mascota no encontrada');
    const resultado = await petService.verEstado(id);
    res.json(resultado);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /mascotas/{id}/objetos:
 *   post:
 *     summary: Agregar un objeto a la mascota
 *     tags: [Personalización]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               objetoId:
 *                 type: integer
 *                 description: ID del objeto a agregar
 *     responses:
 *       200:
 *         description: Objeto agregado
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Mascota u objeto no encontrado
 *     security: [{ bearerAuth: [] }]
 */
router.post('/:id/objetos', async (req, res) => {
  const { id } = req.params;
  const { objetoId } = req.body;
  if (!objetoId) return res.status(400).json({ error: 'Falta el objetoId' });
  try {
    const mascota = await findPetByAnyId(id);
    if (!mascota) throw new Error('Mascota no encontrada');
    const result = await petService.agregarObjetoAMascota(id, objetoId);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /mascotas/{id}/objetos/{objetoId}:
 *   delete:
 *     summary: Quitar un objeto de la mascota
 *     tags: [Personalización]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la mascota
 *       - in: path
 *         name: objetoId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del objeto a quitar
 *     responses:
 *       200:
 *         description: Objeto eliminado
 *       404:
 *         description: Mascota u objeto no encontrado
 *     security: [{ bearerAuth: [] }]
 */
router.delete('/:id/objetos/:objetoId', async (req, res) => {
  const { id, objetoId } = req.params;
  try {
    const mascota = await findPetByAnyId(id);
    if (!mascota) throw new Error('Mascota no encontrada');
    const result = await petService.quitarObjetoAMascota(id, objetoId);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /mascotas/adoptar/{id}:
 *   post:
 *     summary: Adoptar una mascota disponible
 *     tags: [Mascota]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la mascota a adoptar
 *     responses:
 *       200:
 *         description: Mascota adoptada con éxito
 *       400:
 *         description: Mascota no disponible o usuario ya tiene mascota
 *       404:
 *         description: Mascota no encontrada
 */
router.post('/adoptar/:id', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    // Verificar que el usuario no tenga ya una mascota
    const yaTiene = await Pet.findOne({ ownerId: userId });
    if (yaTiene) {
      return res.status(400).json({ error: 'Ya tienes una mascota adoptada' });
    }
    // Verificar que la mascota esté disponible
    const mascota = await Pet.findOne({ _id: req.params.id, $or: [ { ownerId: null }, { duenioId: null } ] });
    if (!mascota) {
      return res.status(400).json({ error: 'Mascota no disponible o ya fue adoptada' });
    }
    mascota.ownerId = userId;
    await mascota.save();
    res.json({ mensaje: '¡Mascota adoptada con éxito!', mascota });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Mascota:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nombre:
 *           type: string
 *         tipo:
 *           type: string
 *         superpoder:
 *           type: string
 *         duenioId:
 *           type: integer
 *           nullable: true
 *         hambre:
 *           type: integer
 *           minimum: 0
 *           maximum: 20
 *         felicidad:
 *           type: integer
 *           minimum: 0
 *           maximum: 20
 *         limpieza:
 *           type: integer
 *           minimum: 0
 *           maximum: 20
 *         enfermedad:
 *           type: string
 *           nullable: true
 *         ropa:
 *           type: array
 *           items:
 *             type: string
 *     MascotaInput:
 *       type: object
 *       required:
 *         - nombre
 *         - tipo
 *         - superpoder
 *       properties:
 *         nombre:
 *           type: string
 *         tipo:
 *           type: string
 *         superpoder:
 *           type: string
 *         hambre:
 *           type: integer
 *           minimum: 0
 *           maximum: 20
 *         felicidad:
 *           type: integer
 *           minimum: 0
 *           maximum: 20
 *         limpieza:
 *           type: integer
 *           minimum: 0
 *           maximum: 20
 *         enfermedad:
 *           type: string
 *         ropa:
 *           type: array
 *           items:
 *             type: string
 */

// Modificar endpoints relevantes para buscar por id o _id
function findPetByAnyId(id) {
  // Si es un ObjectId válido, buscar por _id
  if (mongoose.Types.ObjectId.isValid(id)) {
    return Pet.findById(id);
  }
  // Si es numérico, buscar por id
  if (!isNaN(Number(id))) {
    return Pet.findOne({ id: Number(id) });
  }
  // Si no es válido, retornar null
  return null;
}

export default router; 