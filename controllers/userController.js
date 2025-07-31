/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Registro y login de usuarios
 */

import express from 'express';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Usuario ya existe o datos inválidos
 *       500:
 *         description: Error en el registro
 */
// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
    }
    const userExist = await User.findOne({ username });
    if (userExist) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error en el registro' });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso, retorna token JWT
 *       400:
 *         description: Usuario o contraseña incorrectos
 *       500:
 *         description: Error en el login
 */
// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Intentando login para:', username);
    const user = await User.findOne({ username });
    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
    }
    console.log('Usuario encontrado:', user);
    const valid = await bcrypt.compare(password, user.password);
    console.log('¿Contraseña válida?', valid);
    if (!valid) {
      return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ 
      token, 
      role: user.role, 
      username: user.username,
      userId: user._id 
    });
  } catch (err) {
    console.error('Error en el login:', err);
    res.status(500).json({ error: 'Error en el login' });
  }
});

/**
 * @swagger
 * /auth/validate:
 *   get:
 *     summary: Validar token JWT
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido, retorna datos del usuario
 *       401:
 *         description: Token inválido o expirado
 */
// Validar token
router.get('/validate', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    
    res.json({
      username: user.username,
      role: user.role,
      userId: user._id
    });
  } catch (err) {
    console.error('Error validando token:', err);
    res.status(401).json({ error: 'Token inválido' });
  }
});

export default router; 