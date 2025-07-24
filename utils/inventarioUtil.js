import fs from 'fs';
import path from 'path';

export function getInventario(usuarioId) {
  const ruta = path.join(path.dirname(new URL(import.meta.url).pathname), '..', `inventario-${usuarioId}.json`);
  if (!fs.existsSync(ruta)) {
    // Si no existe, crear inventario vacío
    const inventario = { usuarioId, comidas: [], medicinas: [], ropa: [], equipado: [] };
    fs.writeFileSync(ruta, JSON.stringify(inventario, null, 2));
    return inventario;
  }
  return JSON.parse(fs.readFileSync(ruta, 'utf-8'));
}

export function guardarInventario(usuarioId, inventario) {
  const ruta = path.join(path.dirname(new URL(import.meta.url).pathname), '..', `inventario-${usuarioId}.json`);
  fs.writeFileSync(ruta, JSON.stringify(inventario, null, 2));
} 