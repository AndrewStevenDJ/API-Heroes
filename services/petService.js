import petRepository from '../repositories/petRepository.js';

async function getAllPets() {
    return await petRepository.getPets();
}

async function getAvailablePets() {
    return await petRepository.getAvailablePets();
}

async function addPet(pet) {
    if (!pet.nombre || !pet.tipo || !pet.superpoder) {
        throw new Error("La mascota debe tener nombre, tipo y superpoder.");
    }
    const pets = await petRepository.getPets();
    let newId;
    if (pet.id !== undefined && pet.id !== null) {
        if (pets.some(p => p.id === Number(pet.id))) {
            throw new Error('El id ya existe.');
        }
        newId = Number(pet.id);
    } else {
        newId = pets.length > 0 ? Math.max(...pets.map(p => p.id)) + 1 : 1;
    }
    const newPet = { ...pet, id: newId };
    pets.push(newPet);
    await petRepository.savePets(pets);
    return newPet;
}

async function updatePet(id, updatedPet) {
    const pets = await petRepository.getPets();
    const index = pets.findIndex(pet => pet.id === parseInt(id));
    if (index === -1) {
        throw new Error('Mascota no encontrada');
    }
    delete updatedPet.id;
    pets[index] = { ...pets[index], ...updatedPet };
    await petRepository.savePets(pets);
    return pets[index];
}

async function deletePet(id) {
    const pets = await petRepository.getPets();
    const index = pets.findIndex(pet => pet.id === parseInt(id));
    if (index === -1) {
        throw new Error('Mascota no encontrada');
    }
    const filteredPets = pets.filter(pet => pet.id !== parseInt(id));
    await petRepository.savePets(filteredPets);
    return { message: 'Mascota eliminada' };
}

export default {
    getAllPets,
    getAvailablePets,
    addPet,
    updatePet,
    deletePet
}; 