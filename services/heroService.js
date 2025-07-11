import heroRepository from '../repositories/heroRepository.js'
import petRepository from '../repositories/petRepository.js'

async function getAllHeroes() {
    const heroes = await heroRepository.getHeroes();
    const pets = await petRepository.getPets();
    return heroes.map(hero => {
        const pet = hero.petId ? pets.find(p => p.id === hero.petId) : null;
        return {
            ...hero,
            mascota: pet || null
        };
    });
}

async function addHero(hero) {
    if (!hero.name || !hero.alias) {
        throw new Error("El héroe debe tener un nombre y un alias.");
    }

    const heroes = await heroRepository.getHeroes();

    let newId;
    if (hero.id !== undefined && hero.id !== null) {
        // Verificar que el id no esté repetido
        if (heroes.some(h => h.id === Number(hero.id))) {
            throw new Error('El id ya existe.');
        }
        newId = Number(hero.id);
    } else {
        newId = heroes.length > 0 ? Math.max(...heroes.map(h => h.id)) + 1 : 1;
    }
    const newHero = { ...hero, id: newId };

    heroes.push(newHero);
    await heroRepository.saveHeroes(heroes);

    return newHero;
}

async function updateHero(id, updatedHero) {
    const heroes = await heroRepository.getHeroes();
    const index = heroes.findIndex(hero => hero.id === parseInt(id));

    if (index === -1) {
        throw new Error('Héroe no encontrado');
    }

    delete updatedHero.id;
    heroes[index] = { ...heroes[index], ...updatedHero };

    await heroRepository.saveHeroes(heroes);
    return heroes[index];
}

async function deleteHero(id) {
    const heroes = await heroRepository.getHeroes();
    const index = heroes.findIndex(hero => hero.id === parseInt(id));

    if (index === -1) {
        throw new Error('Héroe no encontrado');
    }

    const filteredHeroes = heroes.filter(hero => hero.id !== parseInt(id));
    await heroRepository.saveHeroes(filteredHeroes);
    return { message: 'Héroe eliminado' };
}

async function findHeroesByCity(city) {
    const heroes = await heroRepository.getHeroes();
    return heroes.filter(hero => hero.city.toLowerCase() === city.toLowerCase());
}

async function faceVillain(heroId, villain) {
    const heroes = await heroRepository.getHeroes();
    const hero = heroes.find(hero => hero.id === parseInt(heroId));
    if (!hero) {
      throw new Error('Héroe no encontrado');
    }
    return `${hero.alias} enfrenta a ${villain}`;
}

// Nueva función: adoptar mascota
async function adoptarMascota(heroId, petId) {
    const heroes = await heroRepository.getHeroes();
    const pets = await petRepository.getPets();
    const heroIndex = heroes.findIndex(hero => hero.id === parseInt(heroId));
    if (heroIndex === -1) {
        throw new Error('Héroe no encontrado');
    }
    const petIndex = pets.findIndex(p => p.id === parseInt(petId));
    if (petIndex === -1) {
        throw new Error('Mascota no encontrada');
    }
    if (pets[petIndex].duenioId) {
        throw new Error('La mascota ya fue adoptada por otro superhéroe');
    }
    // Asignar mascota al héroe y dueño a la mascota
    heroes[heroIndex].petId = pets[petIndex].id;
    pets[petIndex].duenioId = heroes[heroIndex].id;
    await heroRepository.saveHeroes(heroes);
    await petRepository.savePets(pets);
    return {
        ...heroes[heroIndex],
        mascota: pets[petIndex]
    };
}

export default {
    getAllHeroes,
    addHero,
    updateHero,
    deleteHero,
    findHeroesByCity,
    faceVillain,
    adoptarMascota
}
  
  