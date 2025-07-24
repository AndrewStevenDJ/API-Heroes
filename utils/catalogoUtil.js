import fs from 'fs';
import path from 'path';

function leerCatalogo(nombreArchivo) {
  const ruta = path.join(path.dirname(new URL(import.meta.url).pathname), '..', `${nombreArchivo}.json`);
  return JSON.parse(fs.readFileSync(ruta, 'utf-8'));
}

export function getComidas() {
  return leerCatalogo('comidas');
}

export function getMedicinas() {
  return leerCatalogo('medicinas');
}

export function getRopa() {
  return leerCatalogo('ropa');
} 