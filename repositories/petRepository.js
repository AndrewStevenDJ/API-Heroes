import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import Pet from '../models/petModel.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, '../pets.json');

// Función auxiliar para normalizar los valores numéricos de una mascota
function normalizePetValues(pet) {
    if (!pet) return pet;
    
    // Asegurarse de que los campos numéricos son números
    const numericFields = ['hambre', 'salud', 'energia', 'felicidad', 'limpieza'];
    numericFields.forEach(field => {
        if (pet[field] !== undefined) {
            const originalValue = pet[field];
            pet[field] = Number(pet[field]);
            
            // Asegurarse de que estén dentro de los límites
            if (pet[field] < 1) pet[field] = 1;
            if (pet[field] > 100) pet[field] = 100;
            
            // Redondear para evitar decimales que puedan causar problemas
            pet[field] = Math.round(pet[field]);
            
            if (originalValue !== pet[field]) {
                console.log(`Normalizado ${field}: ${originalValue} -> ${pet[field]}`);
            }
        }
    });
    
    return pet;
}

// Función mejorada que consulta primero a MongoDB y luego sincroniza con JSON
async function getPets() {
    try {
        // Primero intentamos obtener mascotas desde MongoDB
        const mongoPets = await Pet.find({});
        
        if (mongoPets && mongoPets.length > 0) {
            // Normalizar todos los valores numéricos antes de sincronizar
            const normalizedPets = mongoPets.map(pet => normalizePetValues(pet.toObject()));
            
            // Si hay mascotas en MongoDB, sincronizamos el archivo JSON
            await fs.writeJson(filePath, normalizedPets);
            
            // Asegurarnos de que los valores están normalizados también en la base de datos
            for (const pet of normalizedPets) {
                await Pet.findOneAndUpdate({ id: pet.id }, pet, { new: true });
            }
            
            return normalizedPets;
        } else {
            // Si no hay mascotas en MongoDB, cargamos desde JSON
            const data = await fs.readJson(filePath);
            
            // Normalizar los datos del JSON
            const normalizedData = data.map(pet => normalizePetValues(pet));
            
            // Y las sincronizamos con MongoDB (insertar masivamente)
            if (normalizedData && normalizedData.length > 0) {
                for (const pet of normalizedData) {
                    await Pet.findOneAndUpdate({ id: pet.id }, pet, { upsert: true, new: true });
                }
            }
            return normalizedData.map(pet => new Pet(pet));
        }
    } catch (error) {
        console.error("Error al obtener mascotas:", error);
        return [];
    }
}

async function getAvailablePets() {
    try {
        // Obtener directamente de MongoDB
        const availablePets = await Pet.find({ ownerId: null });
        return availablePets;
    } catch (error) {
        console.error("Error al obtener mascotas disponibles:", error);
        // Fallback al método anterior
        const pets = await getPets();
        return pets.filter(pet => !pet.ownerId);
    }
}

async function savePets(pets) {
    try {
        // Guardar tanto en MongoDB como en JSON
        await fs.writeJson(filePath, pets);
        
        // Actualizar o crear cada mascota en MongoDB
        for (const pet of pets) {
            await Pet.findOneAndUpdate({ id: pet.id }, pet, { upsert: true, new: true });
        }
    } catch (error) {
        console.error("Error al guardar mascotas:", error);
    }
}

async function update(petActualizada) {
    try {
        console.log("Actualizando mascota en petRepository:", JSON.stringify(petActualizada));
        
        // Normalizar todos los valores usando nuestra función auxiliar
        const petNormalizada = normalizePetValues(petActualizada);
        
        console.log("Mascota normalizada para actualizar:", JSON.stringify(petNormalizada));
        
        // Validar que tenemos un ID válido
        if (!petNormalizada.id) {
            console.error("Error: Intentando actualizar mascota sin ID válido");
            return null;
        }
        
        // Usar updateOne con $set para forzar la actualización de todos los campos
        const updateResult = await Pet.updateOne(
            { id: petNormalizada.id }, 
            { $set: petNormalizada }
        );
        
        console.log("Resultado de la operación updateOne:", updateResult);
        
        if (updateResult.matchedCount === 0) {
            console.warn(`No se encontró ninguna mascota con ID ${petNormalizada.id}`);
            return null;
        }
        
        // Obtener la mascota actualizada para verificar los cambios
        const updatedPet = await Pet.findOne({ id: petNormalizada.id });
        
        if (updatedPet) {
            // Convertir a objeto plano
            const updatedPetObj = updatedPet.toObject();
            console.log("Mascota recuperada después de actualizar:", JSON.stringify(updatedPetObj));
            
            // Verificar específicamente el valor de hambre
            console.log(`Valor de hambre después de la actualización: ${updatedPet.hambre} (tipo: ${typeof updatedPet.hambre})`);
            
            // Sincronizar con el archivo JSON
            const pets = await getPets();
            const index = pets.findIndex(p => p.id === petNormalizada.id || p.id === Number(petNormalizada.id));
            if (index !== -1) {
                pets[index] = updatedPetObj;
                await fs.writeJson(filePath, pets);
                console.log("Archivo JSON sincronizado correctamente");
            }
            
            return updatedPet;
        }
        
        console.warn("No se pudo recuperar la mascota después de actualizar");
        return null;
    } catch (error) {
        console.error("Error al actualizar mascota:", error);
        console.error("Detalles del error:", error.message);
        if (error.stack) console.error("Stack:", error.stack);
        return null;
    }
}

export default {
    getPets,
    getAvailablePets,
    savePets,
    update
} 