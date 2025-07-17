import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/userModel.js';

const MONGO_URI ='mongodb+srv://StevenDB:andrewsteven07@clusterhero.qdnsvij.mongodb.net/?retryWrites=true&w=majority&appName=ClusterHero'; // Reemplaza esto por tu string de conexión real

async function crearAdmin() {
  await mongoose.connect(MONGO_URI);
  const hashedPassword = await bcrypt.hash('hola', 10);
  const existe = await User.findOne({ username: 'Steven' });
  if (existe) {
    console.log('El usuario Steven ya existe.');
    await mongoose.disconnect();
    return;
  }
  const admin = new User({
    username: 'Steven',
    password: hashedPassword,
    role: 'admin'
  });
  await admin.save();
  console.log('Usuario admin creado');
  await mongoose.disconnect();
}

crearAdmin(); 