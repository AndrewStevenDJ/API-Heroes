import express from "express";
import { check, validationResult } from 'express-validator';
import heroService from '../services/heroService.js';
import Hero from "../models/heroModel.js";
import heroRepository from '../repositories/heroRepository.js';
import petRepository from '../repositories/petRepository.js';
import { authenticate, requireRole } from './authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Héroes
 *   description: Endpoints para gestión de superhéroes
 */

/**
 * @swagger
 * /heroes:
 *   get:
 *     summary: Obtener todos los superhéroes
 *     tags: [Héroes]
 *     responses:
 *       200:
 *         description: Lista de superhéroes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Heroe'
 *     security: [{ bearerAuth: [] }]
 */
// GET /heroes - obtener todos los superhéroes
router.get('/', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const heroes = await Hero.find();
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /heroes:
 *   post:
 *     summary: Agregar un superhéroe
 *     tags: [Héroes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HeroeInput'
 *     responses:
 *       201:
 *         description: Superhéroe creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Heroe'
 *       400:
 *         description: Faltan campos obligatorios
 *     security: [{ bearerAuth: [] }]
 */
// POST /heroes - agregar un superhéroe (permitir id opcional)
router.post('/', authenticate, requireRole('admin'), async (req, res) => {
  const { id, name, alias, city, team } = req.body;
  if (!name || !alias || !city || !team) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: name, alias, city, team' });
  }
  try {
    const newHero = await heroService.addHero({ id, name, alias, city, team });
    res.status(201).json(newHero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /heroes/{id}:
 *   put:
 *     summary: Actualizar un superhéroe
 *     tags: [Héroes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del superhéroe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HeroeInput'
 *     responses:
 *       200:
 *         description: Superhéroe actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Heroe'
 *       404:
 *         description: Superhéroe no encontrado
 *     security: [{ bearerAuth: [] }]
 */
// PUT /heroes/:id - actualizar un superhéroe
router.put('/:id', authenticate, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { name, alias, city, team } = req.body;
  try {
    const updatedHero = await heroService.updateHero(id, { name, alias, city, team });
    res.json(updatedHero);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /heroes/{id}:
 *   delete:
 *     summary: Eliminar un superhéroe
 *     tags: [Héroes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del superhéroe
 *     responses:
 *       200:
 *         description: Superhéroe eliminado
 *       404:
 *         description: Superhéroe no encontrado
 *     security: [{ bearerAuth: [] }]
 */
// DELETE /heroes/:id - eliminar un superhéroe
router.delete('/:id', authenticate, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    const result = await heroService.deleteHero(id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /heroes/{id}/adoptar-mascota:
 *   post:
 *     summary: Asignar mascota a un superhéroe
 *     tags: [Héroes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del superhéroe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               petId:
 *                 type: string
 *                 description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota asignada al superhéroe
 *       400:
 *         description: Error en la asignación
 *     security: [{ bearerAuth: [] }]
 */
// POST /heroes/:id/adoptar-mascota - asignar mascota a un superhéroe
router.post('/:id/adoptar-mascota', authenticate, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { petId } = req.body;
  if (!petId) {
    return res.status(400).json({ error: 'Debes enviar el id de la mascota (petId)' });
  }
  try {
    const heroConMascota = await heroService.adoptarMascota(id, petId);
    res.json(heroConMascota);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /heroes/adoptar-mascota:
 *   post:
 *     summary: El héroe adopta una mascota disponible
 *     tags: [Héroes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               heroId:
 *                 type: string
 *                 description: ID del superhéroe
 *     responses:
 *       200:
 *         description: Proceso de adopción exitoso
 *       400:
 *         description: No hay mascotas disponibles o héroe no encontrado
 *     security: [{ bearerAuth: [] }]
 */
router.post('/adoptar-mascota', async (req, res) => {
  const { heroId } = req.body;
  // Buscar héroe
  const hero = await heroRepository.getById(heroId);
  if (!hero) return res.status(404).json({ message: 'Héroe no encontrado' });

  // Obtener mascotas disponibles
  const availablePets = await petRepository.getAvailablePets();
  if (!availablePets || availablePets.length === 0) {
    return res.status(400).json({ message: 'No hay mascotas disponibles para adoptar' });
  }

  // Seleccionar una mascota al azar
  let pet;
  let intentos = 0;
  do {
    const indiceSeleccionado = Math.floor(Math.random() * availablePets.length);
    pet = availablePets[indiceSeleccionado];
    intentos++;
  } while (pet.duenioId && intentos < availablePets.length);

  if (pet.duenioId) {
    return res.status(400).json({ message: 'No hay mascotas disponibles para adoptar' });
  }

  // Asociar mascota al héroe
  hero.petId = pet.id;
  pet.heroId = hero.id;
  pet.duenioId = hero.id;

  // Guardar cambios
  await heroRepository.update(hero);
  await petRepository.update(pet);

  res.json({
    message: `¡${hero.name} ha adoptado a ${pet.nombre}! Proceso de adopción exitoso.`,
    heroe: hero,
    mascota: pet
  });
});

/**
 * @swagger
 * /heroes/city/{city}:
 *   get:
 *     summary: Obtener héroes por ciudad
 *     tags: [Héroes]
 *     parameters:
 *       - in: path
 *         name: city
 *         schema:
 *           type: string
 *         required: true
 *         description: Ciudad a buscar
 *     responses:
 *       200:
 *         description: Lista de héroes en la ciudad
 *     security: [{ bearerAuth: [] }]
 */
router.get('/heroes/city/:city', async (req, res) => {
    try {
      const heroes = await heroService.findHeroesByCity(req.params.city);
      res.json(heroes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

/**
 * @swagger
 * /heroes/{id}/mascota:
 *   get:
 *     summary: Ver la mascota de un superhéroe
 *     tags: [Héroes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del superhéroe
 *     responses:
 *       200:
 *         description: Mascota del superhéroe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 mascota:
 *                   $ref: '#/components/schemas/Mascota'
 *       404:
 *         description: Superhéroe no encontrado
 *     security: [{ bearerAuth: [] }]
 */
router.get('/:id/mascota', async (req, res) => {
  const { id } = req.params;
  try {
    const hero = await heroRepository.getById(id);
    if (!hero) {
      return res.status(404).json({ error: 'Superhéroe no encontrado' });
    }
    
    if (!hero.petId) {
      return res.json({ 
        mensaje: 'Este héroe aún no tiene una mascota adoptada.',
        mascota: null 
      });
    }
    
    const pets = await petRepository.getPets();
    const mascota = pets.find(pet => pet.id === hero.petId);
    
    if (!mascota) {
      return res.json({ 
        mensaje: 'La mascota de este héroe no se encuentra disponible.',
        mascota: null 
      });
    }
    
    res.json({ 
      mensaje: `Mascota de ${hero.name}:`,
      mascota: mascota 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
  