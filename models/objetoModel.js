import mongoose from 'mongoose';

const objetoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true }
});

const Objeto = mongoose.model('Objeto', objetoSchema);
export default Objeto; 