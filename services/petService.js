import petRepository from '../repositories/petRepository.js';
import fs from 'fs';
import path from 'path';

const objetosPath = path.resolve('api-superheroes/objetos.json');

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

async function alimentarMascota(id) {
    const pets = await petRepository.getPets();
    const index = pets.findIndex(pet => pet.id === parseInt(id));
    if (index === -1) {
        throw new Error('Mascota no encontrada');
    }
    const mascota = pets[index];
    if (mascota.hambre <= 1) {
        mascota.enfermedad = 'indigestión por exceso de comida';
        await petRepository.savePets(pets);
        return { mensaje: `¡Cuidado! La mascota ya no tiene hambre y se enfermó de indigestión.` };
    }
    mascota.hambre = Math.max(mascota.hambre - 15, 1);
    if (mascota.hambre === 1) {
        mascota.enfermedad = 'indigestión por exceso de comida';
    } else if (mascota.hambre < 25) {
        mascota.enfermedad = null;
    }
    await petRepository.savePets(pets);
    return { mensaje: `La mascota fue alimentada. Hambre actual: ${mascota.hambre}` };
}

async function banarMascota(id) {
    const pets = await petRepository.getPets();
    const index = pets.findIndex(pet => pet.id === parseInt(id));
    if (index === -1) {
        throw new Error('Mascota no encontrada');
    }
    const mascota = pets[index];
    mascota.limpieza = Math.min(mascota.limpieza + 25, 100);
    if (mascota.limpieza >= 75) {
        mascota.enfermedad = null;
    }
    await petRepository.savePets(pets);
    return { mensaje: `Has bañado a la mascota. Limpieza actual: ${mascota.limpieza}` };
}

async function jugarMascota(id) {
    const pets = await petRepository.getPets();
    const index = pets.findIndex(pet => pet.id === parseInt(id));
    if (index === -1) {
        throw new Error('Mascota no encontrada');
    }
    const mascota = pets[index];
    mascota.felicidad = Math.min(mascota.felicidad + 20, 100);
    mascota.hambre = Math.min(mascota.hambre + 5, 100);
    if (mascota.felicidad >= 75) {
        mascota.enfermedad = null;
    }
    await petRepository.savePets(pets);
    return { mensaje: `La mascota jugó contigo. Felicidad actual: ${mascota.felicidad}, Hambre actual: ${mascota.hambre}` };
}

async function pasearMascota(id) {
    const pets = await petRepository.getPets();
    const index = pets.findIndex(pet => pet.id === parseInt(id));
    if (index === -1) {
        throw new Error('Mascota no encontrada');
    }
    const mascota = pets[index];
    mascota.felicidad = Math.min(mascota.felicidad + 15, 100);
    mascota.limpieza = Math.max(mascota.limpieza - 10, 1);
    mascota.hambre = Math.min(mascota.hambre + 10, 100);
    if (mascota.felicidad >= 75) {
        mascota.enfermedad = null;
    }
    await petRepository.savePets(pets);
    return { mensaje: `La mascota dio un paseo. Felicidad actual: ${mascota.felicidad}, Limpieza actual: ${mascota.limpieza}, Hambre actual: ${mascota.hambre}` };
}

async function curarMascota(id) {
    const pets = await petRepository.getPets();
    const index = pets.findIndex(pet => pet.id === parseInt(id));
    if (index === -1) {
        throw new Error('Mascota no encontrada');
    }
    const mascota = pets[index];
    if (!mascota.enfermedad) {
        return { mensaje: 'La mascota no está enferma.' };
    }
    const enfermedadCurada = mascota.enfermedad;
    mascota.enfermedad = null;
    await petRepository.savePets(pets);
    return { mensaje: `La mascota fue curada del ${enfermedadCurada}.` };
}

async function verRopa(id) {
    const pets = await petRepository.getPets();
    const index = pets.findIndex(pet => pet.id === parseInt(id));
    if (index === -1) {
        throw new Error('Mascota no encontrada');
    }
    const mascota = pets[index];
    return { 
        mensaje: `Ropa actual de ${mascota.nombre}:`,
        ropa: mascota.ropa.length > 0 ? mascota.ropa : ['Sin ropa']
    };
}

async function cambiarRopa(id, nuevaRopa) {
    const pets = await petRepository.getPets();
    const index = pets.findIndex(pet => pet.id === parseInt(id));
    if (index === -1) {
        throw new Error('Mascota no encontrada');
    }
    const mascota = pets[index];
    mascota.ropa = nuevaRopa;
    await petRepository.savePets(pets);
    return { mensaje: `Has vestido a la mascota con: ${nuevaRopa.join(', ')}` };
}

async function verEstado(id) {
    const pets = await petRepository.getPets();
    const index = pets.findIndex(pet => pet.id === parseInt(id));
    if (index === -1) {
        throw new Error('Mascota no encontrada');
    }
    const mascota = pets[index];
    return {
        mensaje: `Estado de ${mascota.nombre}:`,
        estado: {
            hambre: mascota.hambre,
            felicidad: mascota.felicidad,
            limpieza: mascota.limpieza,
            energia: mascota.energia,
            enfermedad: mascota.enfermedad || 'Sana',
            ropa: mascota.ropa
        }
    };
}

async function agregarObjetoAMascota(petId, objetoId) {
    const pets = await petRepository.getPets();
    const index = pets.findIndex(pet => pet.id === parseInt(petId));
    if (index === -1) throw new Error('Mascota no encontrada');
    const mascota = pets[index];
    // Leer objetos disponibles
    const objetos = JSON.parse(fs.readFileSync(objetosPath, 'utf-8'));
    const objeto = objetos.find(obj => obj.id === parseInt(objetoId));
    if (!objeto) throw new Error('Objeto no encontrado');
    if (!mascota.ropa) mascota.ropa = [];
    if (mascota.ropa.some(obj => obj.id === objeto.id)) throw new Error('La mascota ya tiene este objeto');
    mascota.ropa.push(objeto);
    await petRepository.savePets(pets);
    return { mensaje: `Objeto agregado a la mascota`, objeto };
}

async function quitarObjetoAMascota(petId, objetoId) {
    const pets = await petRepository.getPets();
    const index = pets.findIndex(pet => pet.id === parseInt(petId));
    if (index === -1) throw new Error('Mascota no encontrada');
    const mascota = pets[index];
    if (!mascota.ropa) mascota.ropa = [];
    const objIndex = mascota.ropa.findIndex(obj => obj.id === parseInt(objetoId));
    if (objIndex === -1) throw new Error('La mascota no tiene este objeto');
    const eliminado = mascota.ropa.splice(objIndex, 1)[0];
    await petRepository.savePets(pets);
    return { mensaje: `Objeto eliminado de la mascota`, objeto: eliminado };
}

async function dormirMascota(id) {
    const pets = await petRepository.getPets();
    const index = pets.findIndex(pet => pet.id === parseInt(id));
    if (index === -1) {
        throw new Error('Mascota no encontrada');
    }
    const mascota = pets[index];
    mascota.energia = Math.min(mascota.energia + 30, 100);
    if (mascota.energia >= 75) {
        if (mascota.enfermedad === 'fatiga') {
            mascota.enfermedad = null;
        }
    }
    await petRepository.savePets(pets);
    return { mensaje: `La mascota ha dormido y recuperado energía. Energía actual: ${mascota.energia}` };
}

export default {
    getPets: getAllPets,
    getPetById: getAvailablePets,
    addPet,
    updatePet,
    deletePet,
    alimentarMascota,
    banarMascota,
    jugarMascota,
    pasearMascota,
    curarMascota,
    dormirMascota,
    verRopa,
    cambiarRopa,
    verEstado,
    agregarObjetoAMascota,
    quitarObjetoAMascota
};