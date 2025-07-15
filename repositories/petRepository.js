import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import Pet from '../models/petModel.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, '../pets.json');

async function getPets() {
    try {
        const data = await fs.readJson(filePath);
        return data.map(pet => new Pet(
            pet.id, 
            pet.nombre, 
            pet.tipo, 
            pet.superpoder, 
            pet.duenioId,
            pet.hambre,
            pet.felicidad,
            pet.limpieza,
            pet.enfermedad,
            pet.ropa
        ));
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function getAvailablePets() {
    const pets = await getPets();
    return pets.filter(pet => !pet.duenioId);
}

async function savePets(pets) {
    try {
        await fs.writeJson(filePath, pets);
    } catch (error) {
        console.error(error);
    }
}

async function update(petActualizada) {
    const pets = await getPets();
    const index = pets.findIndex(p => p.id === petActualizada.id || p.id === Number(petActualizada.id));
    if (index !== -1) {
        pets[index] = petActualizada;
        await savePets(pets);
        return petActualizada;
    }
    return null;
}

export default {
    getPets,
    getAvailablePets,
    savePets,
    update
} 