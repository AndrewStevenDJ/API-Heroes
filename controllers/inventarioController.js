import { getInventario, guardarInventario } from '../utils/inventarioUtil.js';
import { getComidas, getMedicinas, getRopa } from '../utils/catalogoUtil.js';
import { getEstadoMascota, guardarEstadoMascota } from '../utils/estadoMascotaUtil.js';

// Obtener inventario del usuario
const obtenerInventario = (req, res) => {
  const usuarioId = req.params.usuarioId;
  const inventario = getInventario(usuarioId);
  res.json(inventario);
};

// Usar comida
const usarComida = (req, res) => {
  const usuarioId = req.params.usuarioId;
  const { comidaId } = req.body;
  const inventario = getInventario(usuarioId);
  const comida = getComidas().find(c => c.id === comidaId);
  if (!comida) return res.status(404).json({ error: 'Comida no encontrada' });
  const item = inventario.comidas.find(c => c.id === comidaId);
  if (!item || item.cantidad < 1) return res.status(400).json({ error: 'No tienes esa comida' });
  // Aplicar efectos al estado de la mascota
  const estado = getEstadoMascota(usuarioId);
  if (comida.efectos) {
    if (typeof comida.efectos.hambre === 'number') estado.hambre = Math.max(0, estado.hambre + comida.efectos.hambre);
    if (typeof comida.efectos.salud === 'number') estado.salud = Math.max(0, Math.min(100, estado.salud + comida.efectos.salud));
    if (typeof comida.efectos.felicidad === 'number') estado.felicidad = Math.max(0, Math.min(100, estado.felicidad + comida.efectos.felicidad));
  }
  guardarEstadoMascota(usuarioId, estado);
  item.cantidad -= 1;
  if (item.cantidad === 0) inventario.comidas = inventario.comidas.filter(c => c.id !== comidaId);
  guardarInventario(usuarioId, inventario);
  res.json({ mensaje: `Has usado ${comida.nombre}`, efectos: comida.efectos, inventario, estado });
};

// Usar medicina
const usarMedicina = (req, res) => {
  const usuarioId = req.params.usuarioId;
  const { medicinaId } = req.body;
  const inventario = getInventario(usuarioId);
  const medicina = getMedicinas().find(m => m.id === medicinaId);
  if (!medicina) return res.status(404).json({ error: 'Medicina no encontrada' });
  const item = inventario.medicinas.find(m => m.id === medicinaId);
  if (!item || item.cantidad < 1) return res.status(400).json({ error: 'No tienes esa medicina' });
  // Aplicar efectos al estado de la mascota
  const estado = getEstadoMascota(usuarioId);
  if (medicina.cura && estado.enfermedad === medicina.cura) {
    estado.enfermedad = null;
  }
  if (medicina.efectos) {
    if (typeof medicina.efectos.salud === 'number') estado.salud = Math.max(0, Math.min(100, estado.salud + medicina.efectos.salud));
    if (typeof medicina.efectos.felicidad === 'number') estado.felicidad = Math.max(0, Math.min(100, estado.felicidad + medicina.efectos.felicidad));
  }
  guardarEstadoMascota(usuarioId, estado);
  item.cantidad -= 1;
  if (item.cantidad === 0) inventario.medicinas = inventario.medicinas.filter(m => m.id !== medicinaId);
  guardarInventario(usuarioId, inventario);
  res.json({ mensaje: `Has usado ${medicina.nombre}`, efectos: medicina.efectos, inventario, estado });
};

// Equipar ropa/accesorio
const equiparRopa = (req, res) => {
  const usuarioId = req.params.usuarioId;
  const { ropaId } = req.body;
  const inventario = getInventario(usuarioId);
  const ropa = getRopa().find(r => r.id === ropaId);
  if (!ropa) return res.status(404).json({ error: 'Ropa no encontrada' });
  const item = inventario.ropa.find(r => r.id === ropaId);
  if (!item || item.cantidad < 1) return res.status(400).json({ error: 'No tienes esa prenda/accesorio' });
  // Quitar prenda anterior del mismo tipo si existe
  inventario.equipado = inventario.equipado.filter(e => e.tipo !== ropa.tipo);
  inventario.equipado.push({ tipo: ropa.tipo, id: ropaId });
  guardarInventario(usuarioId, inventario);
  res.json({ mensaje: `Has equipado ${ropa.nombre}`, equipado: inventario.equipado });
};

// Desequipar ropa/accesorio
const desequiparRopa = (req, res) => {
  const usuarioId = req.params.usuarioId;
  const { tipo } = req.body; // tipo: cabeza, espalda, cuello, etc.
  const inventario = getInventario(usuarioId);
  const antes = inventario.equipado.length;
  inventario.equipado = inventario.equipado.filter(e => e.tipo !== tipo);
  guardarInventario(usuarioId, inventario);
  if (inventario.equipado.length === antes) {
    return res.status(400).json({ error: 'No hay prenda equipada de ese tipo' });
  }
  res.json({ mensaje: `Has quitado la prenda/accesorio de ${tipo}`, equipado: inventario.equipado });
};

export default {
  obtenerInventario,
  usarComida,
  usarMedicina,
  equiparRopa,
  desequiparRopa
}; 