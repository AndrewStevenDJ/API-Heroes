import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const JWT_SECRET = 'supersecreto'; // Usa variable de entorno en producción

// Middleware para autenticar usuario
export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    req.user = { id: user._id, role: user.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Middleware para verificar rol
export const requireRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  next();
}; 