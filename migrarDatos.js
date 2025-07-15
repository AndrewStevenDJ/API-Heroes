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
  try {
    await Heroe.insertMany(heroesData, { ordered: false });
    console.log('Superhéroes migrados');
  } catch (err) {
    if (err.code === 11000) {
      console.log('Algunos superhéroes ya existen, se omitieron duplicados.');
    } else {
      throw err;
    }
  }

  // Migrar Mascotas
  const petsPath = path.join(__dirname, 'pets.json');
  const petsData = JSON.parse(fs.readFileSync(petsPath, 'utf-8'));
  try {
    await Pet.insertMany(petsData, { ordered: false });
    console.log('Mascotas migradas');
  } catch (err) {
    if (err.code === 11000) {
      console.log('Algunas mascotas ya existen, se omitieron duplicados.');
    } else {
      throw err;
    }
  }

  // Migrar Objetos
  const objetosPath = path.join(__dirname, 'objetos.json');
  const objetosData = JSON.parse(fs.readFileSync(objetosPath, 'utf-8'));
  try {
    await Objeto.insertMany(objetosData, { ordered: false });
    console.log('Objetos migrados');
  } catch (err) {
    if (err.code === 11000) {
      console.log('Algunos objetos ya existen, se omitieron duplicados.');
    } else {
      throw err;
    }
  }

  await mongoose.disconnect();
  console.log('Migración completada y desconectado de MongoDB');
}

migrar().catch(err => {
  console.error('Error en la migración:', err);
  process.exit(1);
}); 