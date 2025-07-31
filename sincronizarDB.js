import { connectDB } from './db.js';
import Pet from './models/petModel.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, 'pets.json');

// Función para validar y corregir valores de las mascotas
function validarYCorregirMascota(mascota) {
  // Asegurar valores mínimos para los atributos que lo requieren
  mascota.hambre = Math.max(1, mascota.hambre || 75);
  mascota.felicidad = Math.max(1, mascota.felicidad || 100);
  mascota.limpieza = Math.max(1, mascota.limpieza || 75);
  mascota.energia = Math.max(1, mascota.energia || 100);
  mascota.salud = Math.max(1, mascota.salud || 100);
  
  // Asegurar que no excedan el máximo
  mascota.hambre = Math.min(mascota.hambre, 100);
  mascota.felicidad = Math.min(mascota.felicidad, 100);
  mascota.limpieza = Math.min(mascota.limpieza, 100);
  mascota.energia = Math.min(mascota.energia, 100);
  mascota.salud = Math.min(mascota.salud, 100);
  
  return mascota;
}

async function sincronizarDatos() {
  console.log('Iniciando sincronización de datos entre MongoDB y archivos JSON...');
  
  try {
    // Conectar a MongoDB
    await connectDB();
    console.log('Conexión a MongoDB establecida.');
    
    // Paso 1: Obtener datos de MongoDB
    const mongoPets = await Pet.find({});
    console.log(`Se encontraron ${mongoPets.length} mascotas en MongoDB.`);
    
    // Paso 2: Leer el archivo JSON
    let jsonPets = [];
    try {
      jsonPets = await fs.readJson(filePath);
      console.log(`Se encontraron ${jsonPets.length} mascotas en el archivo JSON.`);
    } catch (error) {
      console.error('Error al leer el archivo JSON, puede que no exista:', error.message);
      // Crear un archivo vacío si no existe
      jsonPets = [];
      await fs.writeJson(filePath, jsonPets);
      console.log('Se creó un nuevo archivo JSON vacío.');
    }
    
    // Paso 3: Validar y corregir todas las mascotas en MongoDB
    console.log('Validando y corrigiendo mascotas en MongoDB...');
    for (const pet of mongoPets) {
      const petObj = pet.toObject();
      const correctedPet = validarYCorregirMascota(petObj);
      
      // Actualizar la mascota en MongoDB con los valores corregidos
      await Pet.findByIdAndUpdate(pet._id, correctedPet);
      console.log(`Mascota ${pet.id} (${pet.nombre}) validada y corregida en MongoDB.`);
    }
    
    // Paso 4: Sincronizar el archivo JSON desde MongoDB
    console.log('Actualizando archivo JSON con datos de MongoDB...');
    const updatedMongoPets = await Pet.find({});
    await fs.writeJson(filePath, updatedMongoPets, { spaces: 2 });
    console.log(`Archivo JSON actualizado con ${updatedMongoPets.length} mascotas de MongoDB.`);
    
    // Paso 5: Si hay mascotas solo en JSON, agregarlas a MongoDB (con valores validados)
    for (const jsonPet of jsonPets) {
      const existsInMongo = mongoPets.some(mp => mp.id === jsonPet.id);
      
      if (!existsInMongo) {
        // Validar y corregir antes de guardar
        const correctedPet = validarYCorregirMascota(jsonPet);
        
        // Crear nueva instancia con valores corregidos
        const newPet = new Pet(correctedPet);
        await newPet.save();
        console.log(`Mascota ${jsonPet.id} (${jsonPet.nombre}) del JSON agregada a MongoDB.`);
      }
    }
    
    console.log('Sincronización completada correctamente.');
  } catch (error) {
    console.error('Error durante la sincronización:', error);
  } finally {
    process.exit();
  }
}

sincronizarDatos();
