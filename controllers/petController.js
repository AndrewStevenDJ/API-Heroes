import express from 'express';
import petService from '../services/petService.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Mascota
 *   description: Endpoints para gestión de mascotas
 */

/**
 * @swagger
 * /pets:
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
 */
// GET /pets - obtener todas las mascotas
router.get('/', async (req, res) => {
  try {
    const pets = await petService.getAllPets();
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /pets/disponibles:
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
 */
// GET /pets/disponibles - obtener solo las mascotas sin dueño
router.get('/disponibles', async (req, res) => {
  try {
    const pets = await petService.getAvailablePets();
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /pets:
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
 */
// POST /pets - agregar una mascota (permitir id opcional)
router.post('/', async (req, res) => {
  const { id, nombre, tipo, superpoder } = req.body;
  if (!nombre || !tipo || !superpoder) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, tipo, superpoder' });
  }
  try {
    const newPet = await petService.addPet({ id, nombre, tipo, superpoder });
    res.status(201).json(newPet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /pets/{id}:
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
 */
// PUT /pets/:id - actualizar una mascota
router.put('/:id', async (req, res) => {
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
 * /pets/{id}:
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
 */
// DELETE /pets/:id - eliminar una mascota
router.delete('/:id', async (req, res) => {
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
 * components:
 *   schemas:
 *     Mascota:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         nombre:
 *           type: string
 *         tipo:
 *           type: string
 *         superpoder:
 *           type: string
 *         heroId:
 *           type: string
 *         duenioId:
 *           type: string
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
 */

export default router; 