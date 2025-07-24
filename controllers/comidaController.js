/**
 * @swagger
 * tags:
 *   name: Comidas
 *   description: Endpoints para gestión del catálogo de comidas, frutas, verduras, bebidas y croquetas.
 */

/**
 * @swagger
 * /comidas:
 *   get:
 *     summary: Listar todas las comidas
 *     tags: [Comidas]
 *     responses:
 *       200:
 *         description: Lista de comidas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *   post:
 *     summary: Agregar una nueva comida
 *     tags: [Comidas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "string"
 *               efectos:
 *                 type: object
 *                 example: { "hambre": -10, "salud": 5, "felicidad": 2 }
 *               tipo:
 *                 type: string
 *                 example: "comida"
 *               especie:
 *                 type: string
 *                 example: "string"
 *               descripcion:
 *                 type: string
 *                 example: "string"
 *     responses:
 *       201:
 *         description: Comida agregada
 *
 * /comidas/{id}:
 *   get:
 *     summary: Obtener una comida por ID
 *     tags: [Comidas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la comida
 *     responses:
 *       200:
 *         description: Comida encontrada
 *       404:
 *         description: Comida no encontrada
 *   put:
 *     summary: Editar una comida existente
 *     tags: [Comidas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la comida
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "string"
 *               efectos:
 *                 type: object
 *                 example: { "hambre": -10, "salud": 5, "felicidad": 2 }
 *               tipo:
 *                 type: string
 *                 example: "comida"
 *               especie:
 *                 type: string
 *                 example: "string"
 *               descripcion:
 *                 type: string
 *                 example: "string"
 *     responses:
 *       200:
 *         description: Comida editada
 *       404:
 *         description: Comida no encontrada
 *   delete:
 *     summary: Eliminar una comida
 *     tags: [Comidas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la comida
 *     responses:
 *       200:
 *         description: Comida eliminada
 *       404:
 *         description: Comida no encontrada
 */
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const catalogPath = path.join(__dirname, '..', 'comidas.json');

function leerComidas() {
  return JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
}

function guardarComidas(comidas) {
  fs.writeFileSync(catalogPath, JSON.stringify(comidas, null, 2));
}

// Listar todas las comidas
const listarComidas = (req, res) => {
  res.json(leerComidas());
};

// Obtener una comida por ID
const obtenerComida = (req, res) => {
  const id = Number(req.params.id);
  const comida = leerComidas().find(c => c.id === id);
  if (!comida) return res.status(404).json({ error: 'Comida no encontrada' });
  res.json(comida);
};

// Agregar una nueva comida
const agregarComida = (req, res) => {
  const comidas = leerComidas();
  const nueva = req.body;
  nueva.id = comidas.length ? Math.max(...comidas.map(c => c.id)) + 1 : 1;
  comidas.push(nueva);
  guardarComidas(comidas);
  res.status(201).json(nueva);
};

// Editar una comida existente
const editarComida = (req, res) => {
  const id = Number(req.params.id);
  const comidas = leerComidas();
  const idx = comidas.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Comida no encontrada' });
  comidas[idx] = { ...comidas[idx], ...req.body, id };
  guardarComidas(comidas);
  res.json(comidas[idx]);
};

// Eliminar una comida
const eliminarComida = (req, res) => {
  const id = Number(req.params.id);
  let comidas = leerComidas();
  const existe = comidas.some(c => c.id === id);
  if (!existe) return res.status(404).json({ error: 'Comida no encontrada' });
  comidas = comidas.filter(c => c.id !== id);
  guardarComidas(comidas);
  res.json({ mensaje: 'Comida eliminada' });
};

export default {
  listarComidas,
  obtenerComida,
  agregarComida,
  editarComida,
  eliminarComida
}; 