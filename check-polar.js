require('dotenv').config();
const mongoose = require('mongoose');

async function checkPolarUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectado a MongoDB');
        
        // Definir esquemas básicos
        const userSchema = new mongoose.Schema({}, { strict: false });
        const petSchema = new mongoose.Schema({}, { strict: false });
        
        const User = mongoose.model('User', userSchema);
        const Pet = mongoose.model('Pet', petSchema);
        
        // Buscar usuario Polar
        const user = await User.findOne({username: 'Polar'});
        console.log('Usuario Polar:', user);
        
        if (user) {
            // Buscar si tiene mascotas
            const pets = await Pet.find({ownerId: user._id});
            console.log('Mascotas de Polar:', pets.length);
            pets.forEach(pet => {
                console.log('- Mascota:', pet.nombre, 'ID:', pet.id, 'Hambre:', pet.hambre, 'Felicidad:', pet.felicidad);
            });
        }
        
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkPolarUser();
