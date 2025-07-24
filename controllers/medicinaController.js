/**
 * @swagger
 * tags:
 *   name: Medicinas
 *   description: Endpoints para gestión del catálogo de medicinas.
 */

/**
 * @swagger
 * /medicinas:
 *   get:
 *     summary: Listar todas las medicinas
 *     tags: [Medicinas]
 *     responses:
 *       200:
 *         description: Lista de medicinas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *   post:
 *     summary: Agregar una nueva medicina
 *     tags: [Medicinas]
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
 *               cura:
 *                 type: string
 *                 example: "string"
 *               efectos:
 *                 type: object
 *                 example: { "salud": 10 }
 *               descripcion:
 *                 type: string
 *                 example: "string"
 *     responses:
 *       201:
 *         description: Medicina agregada
 *
 * /medicinas/{id}:
 *   get:
 *     summary: Obtener una medicina por ID
 *     tags: [Medicinas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la medicina
 *     responses:
 *       200:
 *         description: Medicina encontrada
 *       404:
 *         description: Medicina no encontrada
 *   put:
 *     summary: Editar una medicina existente
 *     tags: [Medicinas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la medicina
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
 *               cura:
 *                 type: string
 *                 example: "string"
 *               efectos:
 *                 type: object
 *                 example: { "salud": 10 }
 *               descripcion:
 *                 type: string
 *                 example: "string"
 *     responses:
 *       200:
 *         description: Medicina editada
 *       404:
 *         description: Medicina no encontrada
 *   delete:
 *     summary: Eliminar una medicina
 *     tags: [Medicinas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la medicina
 *     responses:
 *       200:
 *         description: Medicina eliminada
 *       404:
 *         description: Medicina no encontrada
 */
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const catalogPath = path.join(__dirname, '..', 'medicinas.json');

function leerMedicinas() {
  return JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
}

function guardarMedicinas(medicinas) {
  fs.writeFileSync(catalogPath, JSON.stringify(medicinas, null, 2));
}

// Listar todas las medicinas
const listarMedicinas = (req, res) => {
  res.json(leerMedicinas());
};

// Obtener una medicina por ID
const obtenerMedicina = (req, res) => {
  const id = Number(req.params.id);
  const medicina = leerMedicinas().find(m => m.id === id);
  if (!medicina) return res.status(404).json({ error: 'Medicina no encontrada' });
  res.json(medicina);
};

// Agregar una nueva medicina
const agregarMedicina = (req, res) => {
  const medicinas = leerMedicinas();
  const nueva = req.body;
  nueva.id = medicinas.length ? Math.max(...medicinas.map(m => m.id)) + 1 : 1;
  medicinas.push(nueva);
  guardarMedicinas(medicinas);
  res.status(201).json(nueva);
};

// Editar una medicina existente
const editarMedicina = (req, res) => {
  const id = Number(req.params.id);
  const medicinas = leerMedicinas();
  const idx = medicinas.findIndex(m => m.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Medicina no encontrada' });
  medicinas[idx] = { ...medicinas[idx], ...req.body, id };
  guardarMedicinas(medicinas);
  res.json(medicinas[idx]);
};

// Eliminar una medicina
const eliminarMedicina = (req, res) => {
  const id = Number(req.params.id);
  let medicinas = leerMedicinas();
  const existe = medicinas.some(m => m.id === id);
  if (!existe) return res.status(404).json({ error: 'Medicina no encontrada' });
  medicinas = medicinas.filter(m => m.id !== id);
  guardarMedicinas(medicinas);
  res.json({ mensaje: 'Medicina eliminada' });
};

export default {
  listarMedicinas,
  obtenerMedicina,
  agregarMedicina,
  editarMedicina,
  eliminarMedicina
}; 