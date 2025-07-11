import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra'
import Hero from '../models/heroModel.js'

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, '../superheroes.json')

async function getHeroes() {
    try {
        const data = await fs.readJson(filePath)
        return data.map(hero => new Hero(
            hero.id, hero.name, hero.alias, hero.city, hero.team, hero.petId
        ))
    } catch (error) {
        console.error(error)
        return []
    }
}

async function saveHeroes(heroes) {
    try {
        await fs.writeJson(filePath, heroes)
    } catch (error) {
        console.error(error)
    }
}

async function getById(id) {
    const heroes = await getHeroes();
    return heroes.find(hero => hero.id === id || hero.id === Number(id));
}

async function update(heroActualizado) {
    const heroes = await getHeroes();
    const index = heroes.findIndex(h => h.id === heroActualizado.id || h.id === Number(heroActualizado.id));
    if (index !== -1) {
        heroes[index] = heroActualizado;
        await saveHeroes(heroes);
        return heroActualizado;
    }
    return null;
}

export default {
    getHeroes,
    saveHeroes,
    getById,
    update
}
