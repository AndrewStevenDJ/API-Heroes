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
 */
// GET /mascotas - obtener todas las mascotas
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
 */
// GET /mascotas/disponibles - obtener solo las mascotas sin dueño
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
 */
// POST /mascotas - agregar una mascota (permitir id opcional)
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
 */
// PUT /mascotas/:id - actualizar una mascota
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
 */
// DELETE /mascotas/:id - eliminar una mascota
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
 */
router.post('/:id/alimentar', async (req, res) => {
  const { id } = req.params;
  try {
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
 */
router.post('/:id/banar', async (req, res) => {
  const { id } = req.params;
  try {
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
 */
router.post('/:id/jugar', async (req, res) => {
  const { id } = req.params;
  try {
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
 */
router.post('/:id/pasear', async (req, res) => {
  const { id } = req.params;
  try {
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
 */
router.post('/:id/curar', async (req, res) => {
  const { id } = req.params;
  try {
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
 *     tags: [Personalizacion]
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
 */
router.get('/:id/ropa', async (req, res) => {
  const { id } = req.params;
  try {
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
 *     tags: [Personalizacion]
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
 */
router.post('/:id/ropa', async (req, res) => {
  const { id } = req.params;
  const { ropa } = req.body;
  if (!ropa || !Array.isArray(ropa)) {
    return res.status(400).json({ error: 'Debes enviar un array de ropa' });
  }
  try {
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
 */
router.get('/:id/estado', async (req, res) => {
  const { id } = req.params;
  try {
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
 *     tags: [Personalizacion]
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
 */
router.post('/:id/objetos', async (req, res) => {
  const { id } = req.params;
  const { objetoId } = req.body;
  if (!objetoId) return res.status(400).json({ error: 'Falta el objetoId' });
  try {
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
 *     tags: [Personalizacion]
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
 */
router.delete('/:id/objetos/:objetoId', async (req, res) => {
  const { id, objetoId } = req.params;
  try {
    const result = await petService.quitarObjetoAMascota(id, objetoId);
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

export default router; 