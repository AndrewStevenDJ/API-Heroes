import express from 'express'
import cors from 'cors'
import heroController from './controllers/heroController.js'
import petController from './controllers/petController.js'
import objetoController from './controllers/objetoController.js'
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import './estadoUpdater.js';
import { connectDB } from './db.js';
import userController from './controllers/userController.js';
import userPetController from './controllers/userPetController.js';
import inventarioController from './controllers/inventarioController.js';
import comidaController from './controllers/comidaController.js';
import medicinaController from './controllers/medicinaController.js';
import ropaController from './controllers/ropaController.js';

const app = express()
app.use(cors());
const PORT = 3000

app.use(express.json())

// Usar el controlador para la ruta /heroes
app.use('/heroes', heroController)
// Usar el controlador para la ruta /mascotas
app.use('/mascotas', petController)
// Usar el controlador para la ruta /objetos
app.use('/objetos', objetoController)
// Usar el controlador para la ruta /auth
app.use('/auth', userController);
app.use('/mis-mascotas', userPetController);

// Rutas de inventario
app.get('/inventario/:usuarioId', inventarioController.obtenerInventario);
app.post('/inventario/:usuarioId/usar-comida', inventarioController.usarComida);
app.post('/inventario/:usuarioId/usar-medicina', inventarioController.usarMedicina);
app.post('/inventario/:usuarioId/equipar-ropa', inventarioController.equiparRopa);
app.post('/inventario/:usuarioId/desequipar-ropa', inventarioController.desequiparRopa);

// Rutas CRUD de comidas
app.get('/comidas', comidaController.listarComidas);
app.get('/comidas/:id', comidaController.obtenerComida);
app.post('/comidas', comidaController.agregarComida);
app.put('/comidas/:id', comidaController.editarComida);
app.delete('/comidas/:id', comidaController.eliminarComida);

// Rutas CRUD de medicinas
app.get('/medicinas', medicinaController.listarMedicinas);
app.get('/medicinas/:id', medicinaController.obtenerMedicina);
app.post('/medicinas', medicinaController.agregarMedicina);
app.put('/medicinas/:id', medicinaController.editarMedicina);
app.delete('/medicinas/:id', medicinaController.eliminarMedicina);

// Rutas CRUD de ropa
app.get('/ropa', ropaController.listarRopa);
app.get('/ropa/:id', ropaController.obtenerRopa);
app.post('/ropa', ropaController.agregarRopa);
app.put('/ropa/:id', ropaController.editarRopa);
app.delete('/ropa/:id', ropaController.eliminarRopa);

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
      description: 'Documentación de la API de SuperHeroes y Mascotas.\n\nPara acceder a los endpoints protegidos, inicia sesión y copia el token JWT. Haz clic en el botón Authorize (candado) y pégalo así: Bearer <tu_token>',
    },
    tags: [
      {
        name: 'Autenticación',
        description: 'Registro y login de usuarios'
      },
      {
        name: 'Mascota',
        description: 'Endpoints para gestión de mascotas'
      },
      {
        name: 'Estado',
        description: 'Ver el estado de la mascota'
      },
      {
        name: 'Cuidado',
        description: 'Acciones de cuidado de la mascota (alimentar, bañar, jugar, pasear, curar)'
      },
      {
        name: 'Personalización',
        description: 'Personalización de la mascota con objetos'
      },
      {
        name: 'Héroes',
        description: 'Gestión de héroes y sus datos'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
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