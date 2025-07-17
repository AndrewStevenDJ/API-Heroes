import mongoose from 'mongoose';

const HeroeSchema = new mongoose.Schema({
  id: Number,
  name: String,
  alias: String,
  city: String,
  team: String,
  petId: { type: Number, default: null }
});

const Heroe = mongoose.model('Heroe', HeroeSchema, 'heroes');

export default Heroe;
