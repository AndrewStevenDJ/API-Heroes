import fs from 'fs';
import path from 'path';

const mascotasPath = path.join(process.cwd(), 'api-superheroes', 'pets.json');

function leerMascotas() {
  try {
    const data = fs.readFileSync(mascotasPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error al leer pets.json:', err);
    return [];
  }
}

function guardarMascotas(mascotas) {
  try {
    fs.writeFileSync(mascotasPath, JSON.stringify(mascotas, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error al guardar pets.json:', err);
  }
}

function actualizarEstados() {
  const mascotas = leerMascotas();
  mascotas.forEach(mascota => {
    // Aumenta el hambre en +2 (máximo 20)
    mascota.hambre = Math.min((mascota.hambre || 0) + 2, 20);
    // Disminuye la felicidad en -2 (mínimo 0)
    mascota.felicidad = Math.max((mascota.felicidad || 0) - 2, 0);
    // Disminuye la limpieza en -2 (mínimo 0)
    mascota.limpieza = Math.max((mascota.limpieza || 0) - 2, 0);

    // Enfermedades
    if (mascota.hambre >= 20) {
      mascota.enfermedad = 'dolor de estómago';
    } else if (mascota.limpieza <= 2) {
      mascota.enfermedad = 'gripa';
    } else if (mascota.felicidad <= 2) {
      mascota.enfermedad = 'dolor de cabeza';
    } else {
      mascota.enfermedad = null;
    }
  });
  guardarMascotas(mascotas);
}

// Ejecutar cada 30 segundos
setInterval(actualizarEstados, 30000);

// Ejecutar una vez al iniciar
actualizarEstados(); 