import mongoose from 'mongoose';

const ropaSchema = new mongoose.Schema({
  id: Number,
  nombre: String,
  descripcion: String
}, { _id: false });

const petSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
  tipo: { type: String, required: true },
  superpoder: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  // Asegurarnos que todos los campos numéricos se manejen correctamente
  hambre: { 
    type: Number, 
    default: 75, 
    min: 1, 
    max: 100,
    get: v => Math.round(v), 
    set: v => Number(v) // Forzar conversión a número
  },
  felicidad: { 
    type: Number, 
    default: 100, 
    min: 1, 
    max: 100,
    get: v => Math.round(v),
    set: v => Number(v)
  },
  limpieza: { 
    type: Number, 
    default: 75, 
    min: 1, 
    max: 100,
    get: v => Math.round(v),
    set: v => Number(v)
  },
  energia: { 
    type: Number, 
    default: 100, 
    min: 1, 
    max: 100,
    get: v => Math.round(v),
    set: v => Number(v)
  },
  salud: { 
    type: Number, 
    default: 100, 
    min: 1, 
    max: 100,
    get: v => Math.round(v),
    set: v => Number(v)
  },
  enfermedad: { type: String, default: null },
  ropa: { type: Array, default: [] },
  svg: { type: String }
});

const Pet = mongoose.model('Pet', petSchema, 'pets');
export default Pet;