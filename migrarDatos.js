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
  // SVGs personalizados, cuerpo completo y animaciones únicas por mascota
  const svgs = {
    perro: [
      // ...5 variantes originales...
      // Perro 6: marrón oscuro, mueve la cola y parpadea
      `<svg class="cute-pet" width="180" height="180" viewBox="0 0 180 180" fill="none">
        <g>
          <ellipse cx="90" cy="120" rx="40" ry="30" fill="#8D5524"/>
          <ellipse cx="90" cy="160" rx="30" ry="10" fill="#C68642"/>
          <ellipse cx="110" cy="80" rx="15" ry="25" fill="#8D5524"/>
          <ellipse cx="90" cy="100" rx="30" ry="25" fill="#E0AC69"/>
          <ellipse cx="80" cy="110" rx="5" ry="8" fill="#222">
            <animate attributeName="ry" values="8;2;8" keyTimes="0;0.5;1" dur="2s" repeatCount="indefinite"/>
          </ellipse>
          <ellipse cx="100" cy="110" rx="5" ry="8" fill="#222">
            <animate attributeName="ry" values="8;2;8" keyTimes="0;0.5;1" dur="2s" repeatCount="indefinite"/>
          </ellipse>
          <ellipse cx="90" cy="120" rx="8" ry="4" fill="#A47551"/>
          <ellipse cx="60" cy="150" rx="8" ry="16" fill="#8D5524"/>
          <ellipse cx="120" cy="150" rx="8" ry="16" fill="#8D5524"/>
          <ellipse cx="90" cy="170" rx="6" ry="3" fill="#8D5524"/>
          <rect x="130" y="130" width="18" height="8" rx="4" fill="#8D5524">
            <animateTransform attributeName="transform" type="rotate" from="0 139 134" to="-30 139 134" dur="1.1s" repeatCount="indefinite" direction="alternate"/>
          </rect>
        </g>
      </svg>`,
      // Perro 7: gris, mueve la cabeza y la lengua
      `<svg class="cute-pet" width="180" height="180" viewBox="0 0 180 180" fill="none">
        <g>
          <ellipse cx="90" cy="120" rx="40" ry="30" fill="#B0BEC5"/>
          <ellipse cx="90" cy="160" rx="30" ry="10" fill="#CFD8DC"/>
          <ellipse cx="110" cy="80" rx="15" ry="25" fill="#B0BEC5"/>
          <g>
            <ellipse cx="90" cy="100" rx="30" ry="25" fill="#ECEFF1">
              <animateTransform attributeName="transform" type="rotate" values="0 90 100; -10 90 100; 0 90 100" keyTimes="0;0.5;1" dur="1.3s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="80" cy="110" rx="5" ry="8" fill="#222"/>
            <ellipse cx="100" cy="110" rx="5" ry="8" fill="#222"/>
            <ellipse cx="90" cy="120" rx="8" ry="4" fill="#90A4AE"/>
            <ellipse cx="90" cy="130" rx="4" ry="8" fill="#90A4AE">
              <animate attributeName="ry" values="8;2;8" keyTimes="0;0.5;1" dur="1.2s" repeatCount="indefinite"/>
            </ellipse>
          </g>
          <ellipse cx="60" cy="150" rx="8" ry="16" fill="#B0BEC5"/>
          <ellipse cx="120" cy="150" rx="8" ry="16" fill="#B0BEC5"/>
          <ellipse cx="90" cy="170" rx="6" ry="3" fill="#B0BEC5"/>
        </g>
      </svg>`,
      // Perro 8: blanco con manchas negras, mueve oreja derecha
      `<svg class="cute-pet" width="180" height="180" viewBox="0 0 180 180" fill="none">
        <g>
          <ellipse cx="90" cy="120" rx="40" ry="30" fill="#FFF"/>
          <ellipse cx="90" cy="160" rx="30" ry="10" fill="#E0E0E0"/>
          <ellipse cx="70" cy="80" rx="15" ry="25" fill="#222"/>
          <ellipse cx="110" cy="80" rx="15" ry="25" fill="#FFF"/>
          <ellipse cx="90" cy="100" rx="30" ry="25" fill="#FFF"/>
          <ellipse cx="80" cy="110" rx="5" ry="8" fill="#222"/>
          <ellipse cx="100" cy="110" rx="5" ry="8" fill="#222"/>
          <ellipse cx="90" cy="120" rx="8" ry="4" fill="#BDBDBD"/>
          <ellipse cx="60" cy="150" rx="8" ry="16" fill="#FFF"/>
          <ellipse cx="120" cy="150" rx="8" ry="16" fill="#FFF"/>
          <ellipse cx="90" cy="170" rx="6" ry="3" fill="#FFF"/>
          <ellipse cx="110" cy="60" rx="10" ry="18" fill="#222">
            <animateTransform attributeName="transform" type="rotate" from="0 110 60" to="20 110 60" dur="1.1s" repeatCount="indefinite" direction="alternate"/>
          </ellipse>
        </g>
      </svg>`,
      // Perro 9: beige, mueve la pata trasera
      `<svg class="cute-pet" width="180" height="180" viewBox="0 0 180 180" fill="none">
        <g>
          <ellipse cx="90" cy="120" rx="40" ry="30" fill="#F5E1A4"/>
          <ellipse cx="90" cy="160" rx="30" ry="10" fill="#FFF8E1"/>
          <ellipse cx="70" cy="80" rx="15" ry="25" fill="#F5E1A4"/>
          <ellipse cx="110" cy="80" rx="15" ry="25" fill="#F5E1A4"/>
          <ellipse cx="90" cy="100" rx="30" ry="25" fill="#FFF8E1"/>
          <ellipse cx="80" cy="110" rx="5" ry="8" fill="#222"/>
          <ellipse cx="100" cy="110" rx="5" ry="8" fill="#222"/>
          <ellipse cx="90" cy="120" rx="8" ry="4" fill="#F5E1A4"/>
          <ellipse cx="60" cy="150" rx="8" ry="16" fill="#F5E1A4">
            <animateTransform attributeName="transform" type="translate" values="0 0; 0 10; 0 0" keyTimes="0;0.5;1" dur="1.3s" repeatCount="indefinite"/>
          </ellipse>
          <ellipse cx="120" cy="150" rx="8" ry="16" fill="#F5E1A4"/>
          <ellipse cx="90" cy="170" rx="6" ry="3" fill="#F5E1A4"/>
        </g>
      </svg>`,
      // Perro 10: negro, mueve la cabeza y la cola
      `<svg class="cute-pet" width="180" height="180" viewBox="0 0 180 180" fill="none">
        <g>
          <ellipse cx="90" cy="120" rx="40" ry="30" fill="#222"/>
          <ellipse cx="90" cy="160" rx="30" ry="10" fill="#444"/>
          <ellipse cx="70" cy="80" rx="15" ry="25" fill="#222"/>
          <ellipse cx="110" cy="80" rx="15" ry="25" fill="#222"/>
          <g>
            <ellipse cx="90" cy="100" rx="30" ry="25" fill="#FFF">
              <animateTransform attributeName="transform" type="rotate" values="0 90 100; 10 90 100; 0 90 100" keyTimes="0;0.5;1" dur="1.4s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="80" cy="110" rx="5" ry="8" fill="#FFF"/>
            <ellipse cx="100" cy="110" rx="5" ry="8" fill="#FFF"/>
            <ellipse cx="90" cy="120" rx="8" ry="4" fill="#888"/>
          </g>
          <ellipse cx="60" cy="150" rx="8" ry="16" fill="#222">
            <animateTransform attributeName="transform" type="rotate" from="0 60 150" to="-20 60 150" dur="1.2s" repeatCount="indefinite" direction="alternate"/>
          </ellipse>
          <ellipse cx="120" cy="150" rx="8" ry="16" fill="#222"/>
          <ellipse cx="90" cy="170" rx="6" ry="3" fill="#222"/>
        </g>
      </svg>`
    ],
    gato: [
      // ...5 variantes originales...
      // Gato 6: gris, mueve la cola y parpadea
      `<svg class="cute-pet" width="180" height="180" viewBox="0 0 180 180" fill="none">
        <g>
          <ellipse cx="90" cy="120" rx="38" ry="28" fill="#B0BEC5"/>
          <ellipse cx="90" cy="160" rx="28" ry="8" fill="#CFD8DC"/>
          <ellipse cx="70" cy="80" rx="13" ry="22" fill="#B0BEC5"/>
          <ellipse cx="110" cy="80" rx="13" ry="22" fill="#B0BEC5"/>
          <ellipse cx="90" cy="100" rx="28" ry="22" fill="#FFF"/>
          <ellipse cx="80" cy="110" rx="5" ry="8" fill="#222">
            <animate attributeName="ry" values="8;2;8" keyTimes="0;0.5;1" dur="2s" repeatCount="indefinite"/>
          </ellipse>
          <ellipse cx="100" cy="110" rx="5" ry="8" fill="#222">
            <animate attributeName="ry" values="8;2;8" keyTimes="0;0.5;1" dur="2s" repeatCount="indefinite"/>
          </ellipse>
          <ellipse cx="90" cy="120" rx="7" ry="3" fill="#90A4AE"/>
          <ellipse cx="60" cy="150" rx="7" ry="14" fill="#B0BEC5"/>
          <ellipse cx="120" cy="150" rx="7" ry="14" fill="#B0BEC5"/>
          <ellipse cx="90" cy="170" rx="5" ry="2" fill="#B0BEC5"/>
          <rect x="130" y="130" width="16" height="6" rx="3" fill="#B0BEC5">
            <animateTransform attributeName="transform" type="rotate" from="0 138 133" to="30 138 133" dur="1.1s" repeatCount="indefinite" direction="alternate"/>
          </rect>
        </g>
      </svg>`,
      // Gato 7: naranja, mueve la cabeza y la cola
      `<svg class="cute-pet" width="180" height="180" viewBox="0 0 180 180" fill="none">
        <g>
          <ellipse cx="90" cy="120" rx="38" ry="28" fill="#FFB74D"/>
          <ellipse cx="90" cy="160" rx="28" ry="8" fill="#FFE0B2"/>
          <ellipse cx="70" cy="80" rx="13" ry="22" fill="#FFB74D"/>
          <ellipse cx="110" cy="80" rx="13" ry="22" fill="#FFB74D"/>
          <g>
            <ellipse cx="90" cy="100" rx="28" ry="22" fill="#FFF">
              <animateTransform attributeName="transform" type="rotate" values="0 90 100; 10 90 100; 0 90 100" keyTimes="0;0.5;1" dur="1.3s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="80" cy="110" rx="5" ry="8" fill="#222"/>
            <ellipse cx="100" cy="110" rx="5" ry="8" fill="#222"/>
            <ellipse cx="90" cy="120" rx="7" ry="3" fill="#FFB74D"/>
          </g>
          <ellipse cx="60" cy="150" rx="7" ry="14" fill="#FFB74D">
            <animateTransform attributeName="transform" type="rotate" from="0 60 150" to="-20 60 150" dur="1.2s" repeatCount="indefinite" direction="alternate"/>
          </ellipse>
          <ellipse cx="120" cy="150" rx="7" ry="14" fill="#FFB74D"/>
          <ellipse cx="90" cy="170" rx="5" ry="2" fill="#FFB74D"/>
        </g>
      </svg>`,
      // Gato 8: blanco con manchas negras, mueve oreja izquierda
      `<svg class="cute-pet" width="180" height="180" viewBox="0 0 180 180" fill="none">
        <g>
          <ellipse cx="90" cy="120" rx="38" ry="28" fill="#FFF"/>
          <ellipse cx="90" cy="160" rx="28" ry="8" fill="#E0E0E0"/>
          <ellipse cx="70" cy="80" rx="13" ry="22" fill="#222"/>
          <ellipse cx="110" cy="80" rx="13" ry="22" fill="#FFF"/>
          <ellipse cx="90" cy="100" rx="28" ry="22" fill="#FFF"/>
          <ellipse cx="80" cy="110" rx="5" ry="8" fill="#222"/>
          <ellipse cx="100" cy="110" rx="5" ry="8" fill="#222"/>
          <ellipse cx="90" cy="120" rx="7" ry="3" fill="#BDBDBD"/>
          <ellipse cx="60" cy="150" rx="7" ry="14" fill="#FFF"/>
          <ellipse cx="120" cy="150" rx="7" ry="14" fill="#FFF"/>
          <ellipse cx="90" cy="170" rx="5" ry="2" fill="#FFF"/>
          <ellipse cx="70" cy="60" rx="10" ry="18" fill="#222">
            <animateTransform attributeName="transform" type="rotate" from="0 70 60" to="-20 70 60" dur="1.1s" repeatCount="indefinite" direction="alternate"/>
          </ellipse>
        </g>
      </svg>`,
      // Gato 9: negro, mueve la cabeza y la cola
      `<svg class="cute-pet" width="180" height="180" viewBox="0 0 180 180" fill="none">
        <g>
          <ellipse cx="90" cy="120" rx="38" ry="28" fill="#222"/>
          <ellipse cx="90" cy="160" rx="28" ry="8" fill="#444"/>
          <ellipse cx="70" cy="80" rx="13" ry="22" fill="#222"/>
          <ellipse cx="110" cy="80" rx="13" ry="22" fill="#222"/>
          <g>
            <ellipse cx="90" cy="100" rx="28" ry="22" fill="#FFF">
              <animateTransform attributeName="transform" type="rotate" values="0 90 100; -10 90 100; 0 90 100" keyTimes="0;0.5;1" dur="1.4s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="80" cy="110" rx="5" ry="8" fill="#FFF"/>
            <ellipse cx="100" cy="110" rx="5" ry="8" fill="#FFF"/>
            <ellipse cx="90" cy="120" rx="7" ry="3" fill="#888"/>
          </g>
          <ellipse cx="60" cy="150" rx="7" ry="14" fill="#222">
            <animateTransform attributeName="transform" type="rotate" from="0 60 150" to="-20 60 150" dur="1.2s" repeatCount="indefinite" direction="alternate"/>
          </ellipse>
          <ellipse cx="120" cy="150" rx="7" ry="14" fill="#222"/>
          <ellipse cx="90" cy="170" rx="5" ry="2" fill="#222"/>
        </g>
      </svg>`,
      // Gato 10: marrón, mueve la pata delantera
      `<svg class="cute-pet" width="180" height="180" viewBox="0 0 180 180" fill="none">
        <g>
          <ellipse cx="90" cy="120" rx="38" ry="28" fill="#8D5524"/>
          <ellipse cx="90" cy="160" rx="28" ry="8" fill="#C68642"/>
          <ellipse cx="70" cy="80" rx="13" ry="22" fill="#8D5524"/>
          <ellipse cx="110" cy="80" rx="13" ry="22" fill="#8D5524"/>
          <ellipse cx="90" cy="100" rx="28" ry="22" fill="#E0AC69"/>
          <ellipse cx="80" cy="110" rx="5" ry="8" fill="#222"/>
          <ellipse cx="100" cy="110" rx="5" ry="8" fill="#222"/>
          <ellipse cx="90" cy="120" rx="7" ry="3" fill="#A47551"/>
          <ellipse cx="60" cy="150" rx="7" ry="14" fill="#8D5524">
            <animateTransform attributeName="transform" type="translate" values="0 0; 0 10; 0 0" keyTimes="0;0.5;1" dur="1.3s" repeatCount="indefinite"/>
          </ellipse>
          <ellipse cx="120" cy="150" rx="7" ry="14" fill="#8D5524"/>
          <ellipse cx="90" cy="170" rx="5" ry="2" fill="#8D5524"/>
        </g>
      </svg>`
    ],
    loro: [
      // Loro 1: mueve las alas y la cola
      `<svg class="cute-pet" width="180" height="180" viewBox="0 0 180 180" fill="none">
        <g>
          <ellipse cx="130" cy="130" rx="18" ry="28" fill="#81D4FA" opacity="0.7"/>
          <ellipse cx="90" cy="120" rx="60" ry="50" fill="#A5D6A7"/>
          <ellipse cx="90" cy="120" rx="45" ry="38" fill="#FFF"/>
          <ellipse cx="75" cy="130" rx="7" ry="9" fill="#222"><animate attributeName="ry" values="9;2;9" keyTimes="0;0.5;1" dur="2.6s" repeatCount="indefinite"/></ellipse>
          <ellipse cx="105" cy="130" rx="7" ry="9" fill="#222"><animate attributeName="ry" values="9;2;9" keyTimes="0;0.5;1" dur="2.6s" repeatCount="indefinite"/></ellipse>
          <polygon points="90,140 97,145 83,145" fill="#FFB300"/>
          <ellipse cx="70" cy="145" rx="5" ry="2.5" fill="#FFB6B6" opacity="0.7"/>
          <ellipse cx="110" cy="145" rx="5" ry="2.5" fill="#FFB6B6" opacity="0.7"/>
          <ellipse cx="90" cy="100" rx="4" ry="10" fill="#388E3C" transform="rotate(-15 90 100)">
            <animateTransform attributeName="transform" type="rotate" from="-15 90 100" to="-5 90 100" dur="1s" repeatCount="indefinite" direction="alternate"/>
          </ellipse>
        </g>
      </svg>`,
      // Loro 2: parpadea y mueve la cabeza
      `<svg class="cute-pet" width="180" height="180" viewBox="0 0 180 180" fill="none">
        <g>
          <ellipse cx="120" cy="120" rx="18" ry="28" fill="#FFCC80" opacity="0.7"/>
          <ellipse cx="90" cy="120" rx="60" ry="50" fill="#FFF59D"/>
          <ellipse cx="90" cy="120" rx="45" ry="38" fill="#FFF"/>
          <ellipse cx="75" cy="130" rx="7" ry="9" fill="#222"><animate attributeName="ry" values="9;2;9" keyTimes="0;0.5;1" dur="2.3s" repeatCount="indefinite"/></ellipse>
          <ellipse cx="105" cy="130" rx="7" ry="9" fill="#222"><animate attributeName="ry" values="9;2;9" keyTimes="0;0.5;1" dur="2.3s" repeatCount="indefinite"/></ellipse>
          <polygon points="90,140 97,145 83,145" fill="#FFB300"/>
          <ellipse cx="70" cy="145" rx="5" ry="2.5" fill="#FFB6B6" opacity="0.7"/>
          <ellipse cx="110" cy="145" rx="5" ry="2.5" fill="#FFB6B6" opacity="0.7"/>
          <ellipse cx="90" cy="100" rx="4" ry="10" fill="#FFA726" transform="rotate(-10 90 100)">
            <animateTransform attributeName="transform" type="rotate" from="-10 90 100" to="0 90 100" dur="1s" repeatCount="indefinite" direction="alternate"/>
          </ellipse>
        </g>
      </svg>`,
      // Loro 3: mueve las patas y la cola
      `<svg class="cute-pet" width="180" height="180" viewBox="0 0 180 180" fill="none">
        <g>
          <ellipse cx="130" cy="130" rx="18" ry="28" fill="#B2FF59" opacity="0.7"/>
          <ellipse cx="90" cy="120" rx="60" ry="50" fill="#B2DFDB"/>
          <ellipse cx="90" cy="120" rx="45" ry="38" fill="#FFF"/>
          <ellipse cx="75" cy="130" rx="7" ry="9" fill="#222"><animate attributeName="ry" values="9;2;9" keyTimes="0;0.5;1" dur="2.8s" repeatCount="indefinite"/></ellipse>
          <ellipse cx="105" cy="130" rx="7" ry="9" fill="#222"><animate attributeName="ry" values="9;2;9" keyTimes="0;0.5;1" dur="2.8s" repeatCount="indefinite"/></ellipse>
          <polygon points="90,140 97,145 83,145" fill="#FFB300"/>
          <ellipse cx="70" cy="145" rx="5" ry="2.5" fill="#FFB6B6" opacity="0.7"/>
          <ellipse cx="110" cy="145" rx="5" ry="2.5" fill="#FFB6B6" opacity="0.7"/>
          <ellipse cx="90" cy="100" rx="4" ry="10" fill="#43A047" transform="rotate(-20 90 100)">
            <animateTransform attributeName="transform" type="rotate" from="-20 90 100" to="-10 90 100" dur="1s" repeatCount="indefinite" direction="alternate"/>
          </ellipse>
        </g>
      </svg>`,
      // Loro 4: estira las alas y mueve la cola
      `<svg class="cute-pet" width="180" height="180" viewBox="0 0 180 180" fill="none">
        <g>
          <ellipse cx="120" cy="120" rx="18" ry="28" fill="#FFAB91" opacity="0.7"/>
          <ellipse cx="90" cy="120" rx="60" ry="50" fill="#FFE0B2"/>
          <ellipse cx="90" cy="120" rx="45" ry="38" fill="#FFF"/>
          <ellipse cx="75" cy="130" rx="7" ry="9" fill="#222"><animate attributeName="ry" values="9;2;9" keyTimes="0;0.5;1" dur="2.5s" repeatCount="indefinite"/></ellipse>
          <ellipse cx="105" cy="130" rx="7" ry="9" fill="#222"><animate attributeName="ry" values="9;2;9" keyTimes="0;0.5;1" dur="2.5s" repeatCount="indefinite"/></ellipse>
          <polygon points="90,140 97,145 83,145" fill="#FFB300"/>
          <ellipse cx="70" cy="145" rx="5" ry="2.5" fill="#FFB6B6" opacity="0.7"/>
          <ellipse cx="110" cy="145" rx="5" ry="2.5" fill="#FFB6B6" opacity="0.7"/>
          <ellipse cx="90" cy="100" rx="4" ry="10" fill="#D32F2F" transform="rotate(-15 90 100)">
            <animateTransform attributeName="transform" type="rotate" from="-15 90 100" to="-5 90 100" dur="1s" repeatCount="indefinite" direction="alternate"/>
          </ellipse>
        </g>
      </svg>`,
      // Loro 5: mueve la cabeza y parpadea
      `<svg class="cute-pet" width="180" height="180" viewBox="0 0 180 180" fill="none">
        <g>
          <ellipse cx="130" cy="130" rx="18" ry="28" fill="#B2EBF2" opacity="0.7"/>
          <ellipse cx="90" cy="120" rx="60" ry="50" fill="#B2DFDB"/>
          <ellipse cx="90" cy="120" rx="45" ry="38" fill="#FFF"/>
          <ellipse cx="75" cy="130" rx="7" ry="9" fill="#222"><animate attributeName="ry" values="9;2;9" keyTimes="0;0.5;1" dur="2.9s" repeatCount="indefinite"/></ellipse>
          <ellipse cx="105" cy="130" rx="7" ry="9" fill="#222"><animate attributeName="ry" values="9;2;9" keyTimes="0;0.5;1" dur="2.9s" repeatCount="indefinite"/></ellipse>
          <polygon points="90,140 97,145 83,145" fill="#FFB300"/>
          <ellipse cx="70" cy="145" rx="5" ry="2.5" fill="#FFB6B6" opacity="0.7"/>
          <ellipse cx="110" cy="145" rx="5" ry="2.5" fill="#FFB6B6" opacity="0.7"/>
          <ellipse cx="90" cy="100" rx="4" ry="10" fill="#00796B" transform="rotate(-20 90 100)">
            <animateTransform attributeName="transform" type="rotate" from="-20 90 100" to="-10 90 100" dur="1s" repeatCount="indefinite" direction="alternate"/>
          </ellipse>
        </g>
      </svg>`
    ],
    conejo: [
      // Conejo 1: mueve las orejas y la cola
      `<svg class="cute-pet" width="180" height="180" viewBox="0 0 180 180" fill="none">
        <g>
          <ellipse cx="65" cy="60" rx="12" ry="36" fill="#E1F5FE"/>
          <ellipse cx="115" cy="60" rx="12" ry="36" fill="#E1F5FE"/>
          <ellipse cx="90" cy="120" rx="60" ry="50" fill="#FFF"/>
          <ellipse cx="90" cy="120" rx="45" ry="38" fill="#E1F5FE"/>
          <ellipse cx="75" cy="130" rx="7" ry="9" fill="#222"><animate attributeName="ry" values="9;2;9" keyTimes="0;0.5;1" dur="2.8s" repeatCount="indefinite"/></ellipse>
          <ellipse cx="105" cy="130" rx="7" ry="9" fill="#222"><animate attributeName="ry" values="9;2;9" keyTimes="0;0.5;1" dur="2.8s" repeatCount="indefinite"/></ellipse>
          <ellipse cx="90" cy="140" rx="4" ry="2" fill="#FFB6B6"/>
          <path d="M90 142 Q90 146 94 146" stroke="#FFB6B6" stroke-width="2" fill="none"/>
          <path d="M90 142 Q90 146 86 146" stroke="#FFB6B6" stroke-width="2" fill="none"/>
          <ellipse cx="65" cy="135" rx="6" ry="3" fill="#FFB6B6" opacity="0.7"/>
          <ellipse cx="115" cy="135" rx="6" ry="3" fill="#FFB6B6" opacity="0.7"/>
          <ellipse cx="90" cy="160" rx="4" ry="2" fill="#FFB6B6">
            <animate attributeName="ry" values="2;4;2" keyTimes="0;0.5;1" dur="1.5s" repeatCount="indefinite"/>
          </ellipse>
        </g>
      </svg>`,
      // Conejo 2: parpadea y mueve la cabeza
      `<svg class="cute-pet" width="180" height="180" viewBox="0 0 180 180" fill="none">
        <g>
          <ellipse cx="60" cy="55" rx="10" ry="32" fill="#F8BBD0"/>
          <ellipse cx="120" cy="55" rx="10" ry="32" fill="#F8BBD0"/>
          <ellipse cx="90" cy="120" rx="60" ry="50" fill="#FFF"/>
          <ellipse cx="90" cy="120" rx="45" ry="38" fill="#F8BBD0"/>
          <ellipse cx="75" cy="130" rx="7" ry="9" fill="#333"><animate attributeName="ry" values="9;2;9" keyTimes="0;0.5;1" dur="2.5s" repeatCount="indefinite"/></ellipse>
          <ellipse cx="105" cy="130" rx="7" ry="9" fill="#333"><animate attributeName="ry" values="9;2;9" keyTimes="0;0.5;1" dur="2.5s" repeatCount="indefinite"/></ellipse>
          <ellipse cx="90" cy="140" rx="4" ry="2" fill="#F06292"/>
          <ellipse cx="70" cy="145" rx="5" ry="2.5" fill="#F06292" opacity="0.7"/>
          <ellipse cx="110" cy="145" rx="5" ry="2.5" fill="#F06292" opacity="0.7"/>
          <ellipse cx="90" cy="100" rx="4" ry="10" fill="#388E3C" transform="rotate(-15 90 100)">
            <animateTransform attributeName="transform" type="rotate" from="-15 90 100" to="-5 90 100" dur="1s" repeatCount="indefinite" direction="alternate"/>
          </ellipse>
        </g>
      </svg>`,
      // Conejo 3: mueve las patas y la cola
      `<svg class="cute-pet" width="180" height="180" viewBox="0 0 180 180" fill="none">
        <g>
          <ellipse cx="65" cy="60" rx="12" ry="36" fill="#C8E6C9"/>
          <ellipse cx="115" cy="60" rx="12" ry="36" fill="#C8E6C9"/>
          <ellipse cx="90" cy="120" rx="60" ry="50" fill="#FFF"/>
          <ellipse cx="90" cy="120" rx="45" ry="38" fill="#C8E6C9"/>
          <ellipse cx="75" cy="130" rx="7" ry="9" fill="#222"><animate attributeName="ry" values="9;2;9" keyTimes="0;0.5;1" dur="2.6s" repeatCount="indefinite"/></ellipse>
          <ellipse cx="105" cy="130" rx="7" ry="9" fill="#222"><animate attributeName="ry" values="9;2;9" keyTimes="0;0.5;1" dur="2.6s" repeatCount="indefinite"/></ellipse>
          <ellipse cx="90" cy="140" rx="4" ry="2" fill="#388E3C"/>
          <ellipse cx="70" cy="145" rx="5" ry="2.5" fill="#388E3C" opacity="0.7"/>
          <ellipse cx="110" cy="145" rx="5" ry="2.5" fill="#388E3C" opacity="0.7"/>
          <ellipse cx="90" cy="100" rx="4" ry="10" fill="#388E3C" transform="rotate(-15 90 100)">
            <animateTransform attributeName="transform" type="rotate" from="-15 90 100" to="-5 90 100" dur="1s" repeatCount="indefinite" direction="alternate"/>
          </ellipse>
        </g>
      </svg>`,
      // Conejo 4: estira las patas y mueve la cola
      `<svg class="cute-pet" width="180" height="180" viewBox="0 0 180 180" fill="none">
        <g>
          <ellipse cx="60" cy="55" rx="10" ry="32" fill="#F8BBD0"/>
          <ellipse cx="120" cy="55" rx="10" ry="32" fill="#F8BBD0"/>
          <ellipse cx="90" cy="120" rx="60" ry="50" fill="#FFF"/>
          <ellipse cx="90" cy="120" rx="45" ry="38" fill="#F8BBD0"/>
          <ellipse cx="75" cy="130" rx="7" ry="9" fill="#333"><animate attributeName="ry" values="9;2;9" keyTimes="0;0.5;1" dur="2.5s" repeatCount="indefinite"/></ellipse>
          <ellipse cx="105" cy="130" rx="7" ry="9" fill="#333"><animate attributeName="ry" values="9;2;9" keyTimes="0;0.5;1" dur="2.5s" repeatCount="indefinite"/></ellipse>
          <ellipse cx="90" cy="140" rx="4" ry="2" fill="#F48FB1"/>
          <ellipse cx="65" cy="145" rx="6" ry="3" fill="#F48FB1" opacity="0.7"/>
          <ellipse cx="115" cy="145" rx="6" ry="3" fill="#F48FB1" opacity="0.7"/>
          <ellipse cx="90" cy="100" rx="4" ry="10" fill="#F48FB1" transform="rotate(-15 90 100)">
            <animateTransform attributeName="transform" type="rotate" from="-15 90 100" to="-5 90 100" dur="1s" repeatCount="indefinite" direction="alternate"/>
          </ellipse>
        </g>
      </svg>`,
      // Conejo 5: mueve la cabeza y parpadea
      `<svg class="cute-pet" width="180" height="180" viewBox="0 0 180 180" fill="none">
        <g>
          <ellipse cx="65" cy="60" rx="12" ry="36" fill="#E1F5FE"/>
          <ellipse cx="115" cy="60" rx="12" ry="36" fill="#E1F5FE"/>
          <ellipse cx="90" cy="120" rx="60" ry="50" fill="#FFF"/>
          <ellipse cx="90" cy="120" rx="45" ry="38" fill="#E1F5FE"/>
          <ellipse cx="75" cy="130" rx="7" ry="9" fill="#222"><animate attributeName="ry" values="9;2;9" keyTimes="0;0.5;1" dur="2.6s" repeatCount="indefinite"/></ellipse>
          <ellipse cx="105" cy="130" rx="7" ry="9" fill="#222"><animate attributeName="ry" values="9;2;9" keyTimes="0;0.5;1" dur="2.6s" repeatCount="indefinite"/></ellipse>
          <ellipse cx="90" cy="140" rx="4" ry="2" fill="#FFB6B6"/>
          <path d="M90 142 Q90 146 94 146" stroke="#FFB6B6" stroke-width="2" fill="none"/>
          <path d="M90 142 Q90 146 86 146" stroke="#FFB6B6" stroke-width="2" fill="none"/>
          <ellipse cx="70" cy="145" rx="5" ry="2.5" fill="#FFB6B6" opacity="0.7"/>
          <ellipse cx="110" cy="145" rx="5" ry="2.5" fill="#FFB6B6" opacity="0.7"/>
          <ellipse cx="90" cy="100" rx="4" ry="10" fill="#388E3C" transform="rotate(-15 90 100)">
            <animateTransform attributeName="transform" type="rotate" from="-15 90 100" to="-5 90 100" dur="1s" repeatCount="indefinite" direction="alternate"/>
          </ellipse>
        </g>
      </svg>`
    ],
    tortuga: [
      // Tortuga 1: mueve las patas y la cabeza
      `<svg class="cute-pet" width="180" height="180" viewBox="0 0 180 180" fill="none">
        <g>
          <ellipse cx="90" cy="120" rx="55" ry="40" fill="#A5D6A7"/>
          <ellipse cx="90" cy="120" rx="45" ry="32" fill="#388E3C"/>
          <ellipse cx="90" cy="90" rx="22" ry="18" fill="#A5D6A7"/>
          <ellipse cx="82" cy="92" rx="3" ry="5" fill="#222"><animate attributeName="ry" values="5;1;5" keyTimes="0;0.5;1" dur="2.5s" repeatCount="indefinite"/></ellipse>
          <ellipse cx="98" cy="92" rx="3" ry="5" fill="#222"><animate attributeName="ry" values="5;1;5" keyTimes="0;0.5;1" dur="2.5s" repeatCount="indefinite"/></ellipse>
          <path d="M90 100 Q90 104 94 104" stroke="#388E3C" stroke-width="2" fill="none"/>
          <path d="M90 100 Q90 104 86 104" stroke="#388E3C" stroke-width="2" fill="none"/>
          <ellipse cx="55" cy="140" rx="10" ry="6" fill="#A5D6A7"/>
          <ellipse cx="125" cy="140" rx="10" ry="6" fill="#A5D6A7"/>
          <ellipse cx="65" cy="110" rx="8" ry="5" fill="#A5D6A7"/>
          <ellipse cx="115" cy="110" rx="8" ry="5" fill="#A5D6A7"/>
          <ellipse cx="90" cy="160" rx="6" ry="3" fill="#A5D6A7">
            <animateTransform attributeName="transform" type="translate" values="0 0; 0 5; 0 0" keyTimes="0;0.5;1" dur="1.5s" repeatCount="indefinite"/>
          </ellipse>
        </g>
      </svg>`,
      // Tortuga 2: parpadea y mueve la cabeza
      `<svg class="cute-pet" width="180" height="180" viewBox="0 0 180 180" fill="none">
        <g>
          <ellipse cx="90" cy="120" rx="55" ry="40" fill="#FFF176"/>
          <ellipse cx="90" cy="120" rx="45" ry="32" fill="#FBC02D"/>
          <ellipse cx="90" cy="90" rx="22" ry="18" fill="#FFF176"/>
          <ellipse cx="82" cy="92" rx="3" ry="5" fill="#222"><animate attributeName="ry" values="5;1;5" keyTimes="0;0.5;1" dur="2.2s" repeatCount="indefinite"/></ellipse>
          <ellipse cx="98" cy="92" rx="3" ry="5" fill="#222"><animate attributeName="ry" values="5;1;5" keyTimes="0;0.5;1" dur="2.2s" repeatCount="indefinite"/></ellipse>
          <path d="M90 100 Q90 104 94 104" stroke="#FBC02D" stroke-width="2" fill="none"/>
          <path d="M90 100 Q90 104 86 104" stroke="#FBC02D" stroke-width="2" fill="none"/>
          <ellipse cx="55" cy="140" rx="10" ry="6" fill="#FFF176"/>
          <ellipse cx="125" cy="140" rx="10" ry="6" fill="#FFF176"/>
          <ellipse cx="65" cy="110" rx="8" ry="5" fill="#FFF176"/>
          <ellipse cx="115" cy="110" rx="8" ry="5" fill="#FFF176"/>
          <ellipse cx="90" cy="160" rx="6" ry="3" fill="#FFF176">
            <animateTransform attributeName="transform" type="translate" values="0 0; 0 5; 0 0" keyTimes="0;0.5;1" dur="1.5s" repeatCount="indefinite"/>
          </ellipse>
        </g>
      </svg>`,
      // Tortuga 3: mueve las patas y la cabeza
      `<svg class="cute-pet" width="180" height="180" viewBox="0 0 180 180" fill="none">
        <g>
          <ellipse cx="90" cy="120" rx="55" ry="40" fill="#B2EBF2"/>
          <ellipse cx="90" cy="120" rx="45" ry="32" fill="#00ACC1"/>
          <ellipse cx="90" cy="90" rx="22" ry="18" fill="#B2EBF2"/>
          <ellipse cx="82" cy="92" rx="3" ry="5" fill="#222"><animate attributeName="ry" values="5;1;5" keyTimes="0;0.5;1" dur="2.9s" repeatCount="indefinite"/></ellipse>
          <ellipse cx="98" cy="92" rx="3" ry="5" fill="#222"><animate attributeName="ry" values="5;1;5" keyTimes="0;0.5;1" dur="2.9s" repeatCount="indefinite"/></ellipse>
          <path d="M90 100 Q90 104 94 104" stroke="#00ACC1" stroke-width="2" fill="none"/>
          <path d="M90 100 Q90 104 86 104" stroke="#00ACC1" stroke-width="2" fill="none"/>
          <ellipse cx="55" cy="140" rx="10" ry="6" fill="#B2EBF2"/>
          <ellipse cx="125" cy="140" rx="10" ry="6" fill="#B2EBF2"/>
          <ellipse cx="65" cy="110" rx="8" ry="5" fill="#B2EBF2"/>
          <ellipse cx="115" cy="110" rx="8" ry="5" fill="#B2EBF2"/>
          <ellipse cx="90" cy="160" rx="6" ry="3" fill="#B2EBF2">
            <animateTransform attributeName="transform" type="translate" values="0 0; 0 5; 0 0" keyTimes="0;0.5;1" dur="1.5s" repeatCount="indefinite"/>
          </ellipse>
        </g>
      </svg>`,
      // Tortuga 4: estira las patas y mueve la cabeza
      `<svg class="cute-pet" width="180" height="180" viewBox="0 0 180 180" fill="none">
        <g>
          <ellipse cx="90" cy="120" rx="55" ry="40" fill="#A5D6A7"/>
          <ellipse cx="90" cy="120" rx="45" ry="32" fill="#388E3C"/>
          <ellipse cx="90" cy="90" rx="22" ry="18" fill="#A5D6A7"/>
          <ellipse cx="82" cy="92" rx="3" ry="5" fill="#222"><animate attributeName="ry" values="5;1;5" keyTimes="0;0.5;1" dur="2.5s" repeatCount="indefinite"/></ellipse>
          <ellipse cx="98" cy="92" rx="3" ry="5" fill="#222"><animate attributeName="ry" values="5;1;5" keyTimes="0;0.5;1" dur="2.5s" repeatCount="indefinite"/></ellipse>
          <path d="M90 100 Q90 104 94 104" stroke="#388E3C" stroke-width="2" fill="none"/>
          <path d="M90 100 Q90 104 86 104" stroke="#388E3C" stroke-width="2" fill="none"/>
          <ellipse cx="55" cy="140" rx="10" ry="6" fill="#A5D6A7"/>
          <ellipse cx="125" cy="140" rx="10" ry="6" fill="#A5D6A7"/>
          <ellipse cx="65" cy="110" rx="8" ry="5" fill="#A5D6A7"/>
          <ellipse cx="115" cy="110" rx="8" ry="5" fill="#A5D6A7"/>
          <ellipse cx="90" cy="160" rx="6" ry="3" fill="#A5D6A7">
            <animateTransform attributeName="transform" type="translate" values="0 0; 0 5; 0 0" keyTimes="0;0.5;1" dur="1.5s" repeatCount="indefinite"/>
          </ellipse>
        </g>
      </svg>`,
      // Tortuga 5: mueve la cabeza y parpadea
      `<svg class="cute-pet" width="180" height="180" viewBox="0 0 180 180" fill="none">
        <g>
          <ellipse cx="90" cy="120" rx="55" ry="40" fill="#FFF176"/>
          <ellipse cx="90" cy="120" rx="45" ry="32" fill="#FBC02D"/>
          <ellipse cx="90" cy="90" rx="22" ry="18" fill="#FFF176"/>
          <ellipse cx="82" cy="92" rx="3" ry="5" fill="#222"><animate attributeName="ry" values="5;1;5" keyTimes="0;0.5;1" dur="2.2s" repeatCount="indefinite"/></ellipse>
          <ellipse cx="98" cy="92" rx="3" ry="5" fill="#222"><animate attributeName="ry" values="5;1;5" keyTimes="0;0.5;1" dur="2.2s" repeatCount="indefinite"/></ellipse>
          <path d="M90 100 Q90 104 94 104" stroke="#FBC02D" stroke-width="2" fill="none"/>
          <path d="M90 100 Q90 104 86 104" stroke="#FBC02D" stroke-width="2" fill="none"/>
          <ellipse cx="55" cy="140" rx="10" ry="6" fill="#FFF176"/>
          <ellipse cx="125" cy="140" rx="10" ry="6" fill="#FFF176"/>
          <ellipse cx="65" cy="110" rx="8" ry="5" fill="#FFF176"/>
          <ellipse cx="115" cy="110" rx="8" ry="5" fill="#FFF176"/>
          <ellipse cx="90" cy="160" rx="6" ry="3" fill="#FFF176">
            <animateTransform attributeName="transform" type="translate" values="0 0; 0 5; 0 0" keyTimes="0;0.5;1" dur="1.5s" repeatCount="indefinite"/>
          </ellipse>
        </g>
      </svg>`
    ]
  };
  for (let i = 1; i <= 31; i++) {
    const existe = await Pet.findOne({ id: i });
    const tipo = tipos[(i-1)%tipos.length];
    // Selecciona un SVG diferente para cada mascota del mismo tipo
    const svgList = svgs[tipo];
    const svg = svgList[((i-1)/tipos.length|0)%svgList.length];
    if (!existe) {
      await Pet.create({
        id: i,
        nombre: nombres[i-1],
        tipo,
        superpoder: poderes[(i-1)%poderes.length],
        ownerId: null,
        hambre: 15,
        felicidad: 20,
        limpieza: 15,
        enfermedad: null,
        ropa: [],
        svg
      });
    } else {
      // Actualiza el nombre aunque ya exista
      existe.nombre = nombres[i-1];
      existe.svg = svg;
      await existe.save();
    }
  }
  console.log('Mascotas migradas (sin duplicados y con nombres únicos)');

  // Eliminar mascotas con id > 31
  await Pet.deleteMany({ id: { $gt: 31 } });
  console.log('Mascotas con id > 31 eliminadas');

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
