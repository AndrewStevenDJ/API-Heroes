import express from 'express'
import heroController from './controllers/heroController.js'
import petController from './controllers/petController.js'
import objetoController from './controllers/objetoController.js'
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import './estadoUpdater.js';
import { connectDB } from './db.js';

const app = express()
const PORT = 3000

app.use(express.json())

// Usar el controlador para la ruta /heroes
app.use('/heroes', heroController)
// Usar el controlador para la ruta /mascotas
app.use('/mascotas', petController)
// Usar el controlador para la ruta /objetos
app.use('/objetos', objetoController)

// Endpoint raíz opcional
app.get('/', (req, res) => {
  res.send('¡API de Superhéroes y Mascotas corriendo! Visita /heroes o /mascotas')
})

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API SuperHeroes',
      version: '1.0.0',
      description: 'Documentación de la API de SuperHeroes y Mascotas',
    },
    components: {
      schemas: {
        Heroe: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            alias: { type: 'string' },
            city: { type: 'string' },
            team: { type: 'string' },
            petId: { type: 'string' },
          },
        },
        HeroeInput: {
          type: 'object',
          required: ['name', 'alias', 'city', 'team'],
          properties: {
            name: { type: 'string' },
            alias: { type: 'string' },
            city: { type: 'string' },
            team: { type: 'string' },
          },
        },
        Mascota: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            nombre: { type: 'string' },
            tipo: { type: 'string' },
            superpoder: { type: 'string' },
            heroId: { type: 'string' },
            duenioId: { type: 'string' },
          },
        },
        MascotaInput: {
          type: 'object',
          required: ['nombre', 'tipo', 'superpoder'],
          properties: {
            nombre: { type: 'string' },
            tipo: { type: 'string' },
            superpoder: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./controllers/*.js'], // Documentaremos los endpoints en los controladores
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

connectDB();

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
})