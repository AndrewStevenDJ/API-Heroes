import mongoose from 'mongoose';

const uri = 'mongodb+srv://StevenDB:andrewsteven07@clusterhero.qdnsvij.mongodb.net/?retryWrites=true&w=majority&appName=ClusterHero';

export async function connectDB() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
} 