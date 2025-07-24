import fs from 'fs';
import path from 'path';

export function getEstadoMascota(usuarioId) {
  const ruta = path.join(path.dirname(new URL(import.meta.url).pathname), '..', `estado-mascota-${usuarioId}.json`);
  if (!fs.existsSync(ruta)) {
    // Estado inicial por defecto
    const estado = {
      usuarioId,
      hambre: 50,
      salud: 100,
      felicidad: 50,
      enfermedad: null,
      ropa: []
    };
    fs.writeFileSync(ruta, JSON.stringify(estado, null, 2));
    return estado;
  }
  return JSON.parse(fs.readFileSync(ruta, 'utf-8'));
}

export function guardarEstadoMascota(usuarioId, estado) {
  const ruta = path.join(path.dirname(new URL(import.meta.url).pathname), '..', `estado-mascota-${usuarioId}.json`);
  fs.writeFileSync(ruta, JSON.stringify(estado, null, 2));
} 