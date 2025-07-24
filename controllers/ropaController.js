/**
 * @swagger
 * tags:
 *   name: Ropa
 *   description: Endpoints para gestión del catálogo de ropa y accesorios.
 */

/**
 * @swagger
 * /ropa:
 *   get:
 *     summary: Listar toda la ropa
 *     tags: [Ropa]
 *     responses:
 *       200:
 *         description: Lista de ropa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *   post:
 *     summary: Agregar una nueva prenda/accesorio
 *     tags: [Ropa]
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
 *               tipo:
 *                 type: string
 *                 example: "string"
 *               imagen:
 *                 type: string
 *                 example: "string"
 *               descripcion:
 *                 type: string
 *                 example: "string"
 *     responses:
 *       201:
 *         description: Prenda/accesorio agregado
 *
 * /ropa/{id}:
 *   get:
 *     summary: Obtener una prenda/accesorio por ID
 *     tags: [Ropa]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la prenda/accesorio
 *     responses:
 *       200:
 *         description: Prenda/accesorio encontrada
 *       404:
 *         description: Prenda/accesorio no encontrada
 *   put:
 *     summary: Editar una prenda/accesorio existente
 *     tags: [Ropa]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la prenda/accesorio
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
 *               tipo:
 *                 type: string
 *                 example: "string"
 *               imagen:
 *                 type: string
 *                 example: "string"
 *               descripcion:
 *                 type: string
 *                 example: "string"
 *     responses:
 *       200:
 *         description: Prenda/accesorio editada
 *       404:
 *         description: Prenda/accesorio no encontrada
 *   delete:
 *     summary: Eliminar una prenda/accesorio
 *     tags: [Ropa]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la prenda/accesorio
 *     responses:
 *       200:
 *         description: Prenda/accesorio eliminada
 *       404:
 *         description: Prenda/accesorio no encontrada
 */
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const catalogPath = path.join(__dirname, '..', 'ropa.json');

function leerRopa() {
  return JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
}

function guardarRopa(ropa) {
  fs.writeFileSync(catalogPath, JSON.stringify(ropa, null, 2));
}

// Listar toda la ropa
const listarRopa = (req, res) => {
  res.json(leerRopa());
};

// Obtener una prenda/accesorio por ID
const obtenerRopa = (req, res) => {
  const id = Number(req.params.id);
  const prenda = leerRopa().find(r => r.id === id);
  if (!prenda) return res.status(404).json({ error: 'Prenda/accesorio no encontrado' });
  res.json(prenda);
};

// Agregar una nueva prenda/accesorio
const agregarRopa = (req, res) => {
  const ropa = leerRopa();
  const nueva = req.body;
  nueva.id = ropa.length ? Math.max(...ropa.map(r => r.id)) + 1 : 1;
  ropa.push(nueva);
  guardarRopa(ropa);
  res.status(201).json(nueva);
};

// Editar una prenda/accesorio existente
const editarRopa = (req, res) => {
  const id = Number(req.params.id);
  const ropa = leerRopa();
  const idx = ropa.findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Prenda/accesorio no encontrado' });
  ropa[idx] = { ...ropa[idx], ...req.body, id };
  guardarRopa(ropa);
  res.json(ropa[idx]);
};

// Eliminar una prenda/accesorio
const eliminarRopa = (req, res) => {
  const id = Number(req.params.id);
  let ropa = leerRopa();
  const existe = ropa.some(r => r.id === id);
  if (!existe) return res.status(404).json({ error: 'Prenda/accesorio no encontrado' });
  ropa = ropa.filter(r => r.id !== id);
  guardarRopa(ropa);
  res.json({ mensaje: 'Prenda/accesorio eliminada' });
};

export default {
  listarRopa,
  obtenerRopa,
  agregarRopa,
  editarRopa,
  eliminarRopa
}; 