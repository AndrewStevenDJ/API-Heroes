import mongoose from 'mongoose';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import { connectDB } from './db.js';
import Heroe from './models/heroModel.js';
import Pet from './models/petModel.js';
import Objeto from './models/objetoModel.js';

async function migrar() {
  await connectDB();

  // Migrar Superhéroes
  const heroesPath = path.join(__dirname, 'superheroes.json');
  const heroesData = JSON.parse(fs.readFileSync(heroesPath, 'utf-8'));
  for (const hero of heroesData) {
    // Verifica si ya existe un héroe con ese id numérico
    const existe = await Heroe.findOne({ id: hero.id });
    if (!existe) {
      await Heroe.create(hero);
    }
  }
  console.log('Superhéroes migrados (sin duplicados)');

  // Migrar Mascotas
  // Nombres inventados y únicos para las 31 mascotas
  const nombres = [
    'Astro', 'Nube', 'Rayo', 'Chispa', 'Lila', 'Draco', 'Coco', 'Kira', 'Max', 'Luna',
    'Rocky', 'Simba', 'Maya', 'Thor', 'Bella', 'Zeus', 'Sasha', 'Toby', 'Nala', 'Milo',
    'Duna', 'Leo', 'Gala', 'Odin', 'Arya', 'Rex', 'Mía', 'Loki', 'Sol', 'Tiza', 'Neo'
  ];
  const tipos = ['perro', 'gato', 'loro', 'conejo', 'tortuga'];
  const poderes = ['volar', 'invisibilidad', 'superfuerza', 'telepatía', 'velocidad'];
  for (let i = 1; i <= 31; i++) {
    const existe = await Pet.findOne({ id: i });
    if (!existe) {
      await Pet.create({
        id: i,
        nombre: nombres[i-1],
        tipo: tipos[(i-1)%tipos.length],
        superpoder: poderes[(i-1)%poderes.length],
        ownerId: null,
        hambre: 15,
        felicidad: 20,
        limpieza: 15,
        enfermedad: null,
        ropa: []
      });
    } else {
      // Actualiza el nombre aunque ya exista
      existe.nombre = nombres[i-1];
      await existe.save();
    }
  }
  console.log('Mascotas migradas (sin duplicados y con nombres únicos)');

  // Migrar Objetos
  const objetosPath = path.join(__dirname, 'objetos.json');
  const objetosData = JSON.parse(fs.readFileSync(objetosPath, 'utf-8'));
  for (const obj of objetosData) {
    const existe = await Objeto.findOne({ nombre: obj.nombre });
    if (!existe) {
      await Objeto.create(obj);
    }
  }
  console.log('Objetos migrados (sin duplicados)');

  await mongoose.disconnect();
  console.log('Migración completada y desconectado de MongoDB');
}

// Lógica para asignar id numérico único al agregar mascota por POST ya está en el endpoint:
// Busca el mayor id existente y suma 1. Si quieres reforzar, revisa el controllers/petController.js

migrar().catch(err => {
  console.error(err);
  process.exit(1);
}); 