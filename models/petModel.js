import mongoose from 'mongoose';

const ropaSchema = new mongoose.Schema({
  id: Number,
  nombre: String,
  descripcion: String
}, { _id: false });

const petSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  nombre: { type: String, required: true },
  tipo: { type: String, required: true },
  superpoder: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  hambre: { type: Number, default: 15 },
  felicidad: { type: Number, default: 20 },
  limpieza: { type: Number, default: 15 },
  enfermedad: { type: String, default: null },
  ropa: { type: [ropaSchema], default: [] }
});

const Pet = mongoose.model('Pet', petSchema, 'pets');
export default Pet; 