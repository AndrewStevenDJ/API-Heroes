import express from 'express';
import Objeto from '../models/objetoModel.js';
import { authenticate, requireRole } from './authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Personalización
 *   description: Endpoints para gestionar objetos de personalización (ropa)
 */

/**
 * @swagger
 * /objetos:
 *   get:
 *     summary: Obtener todos los objetos de personalización
 *     tags: [Personalización]
 *     responses:
 *       200:
 *         description: Lista de objetos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   descripcion:
 *                     type: string
 *     security: [{ bearerAuth: [] }]
 */
// Obtener todos los objetos
router.get('/', async (req, res) => {
  try {
    const objetos = await Objeto.find();
    res.json(objetos);
  } catch (err) {
    res.status(500).json({ error: 'Error al leer los objetos' });
  }
});

/**
 * @swagger
 * /objetos:
 *   post:
 *     summary: Agregar un nuevo objeto de personalización
 *     tags: [Personalización]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - descripcion
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Objeto creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Objeto'
 *       400:
 *         description: Faltan campos requeridos
 *     security: [{ bearerAuth: [] }]
 */
// Agregar un nuevo objeto
router.post('/', authenticate, requireRole('admin'), async (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre || !descripcion) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  try {
    const nuevoObjeto = new Objeto({ nombre, descripcion });
    await nuevoObjeto.save();
    res.status(201).json(nuevoObjeto);
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar el objeto' });
  }
});

/**
 * @swagger
 * /objetos/{id}:
 *   put:
 *     summary: Modificar un objeto de personalización
 *     tags: [Personalización]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del objeto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Objeto modificado
 *       404:
 *         description: Objeto no encontrado
 *     security: [{ bearerAuth: [] }]
 */
// Modificar un objeto existente
router.put('/:id', authenticate, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    const objeto = await Objeto.findById(id);
    if (!objeto) return res.status(404).json({ error: 'Objeto no encontrado' });
    if (nombre) objeto.nombre = nombre;
    if (descripcion) objeto.descripcion = descripcion;
    await objeto.save();
    res.json(objeto);
  } catch (err) {
    res.status(500).json({ error: 'Error al modificar el objeto' });
  }
});

/**
 * @swagger
 * /objetos/{id}:
 *   delete:
 *     summary: Eliminar un objeto de personalización
 *     tags: [Personalización]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del objeto
 *     responses:
 *       200:
 *         description: Objeto eliminado
 *       404:
 *         description: Objeto no encontrado
 *     security: [{ bearerAuth: [] }]
 */
// Eliminar un objeto
router.delete('/:id', authenticate, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    const eliminado = await Objeto.findByIdAndDelete(id);
    if (!eliminado) return res.status(404).json({ error: 'Objeto no encontrado' });
    res.json(eliminado);
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el objeto' });
  }
});

export default router; 