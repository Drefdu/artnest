const mongoose = require('mongoose');
const ImagenSchema = new mongoose.Schema({
    nombre:{
        type: String,
        require: true
    },
    apellidos:{
        type: String,
        require: true
    },
    correo:{
        type: String,
        require: true,
    },
    nombreImagen:{
        type: String,
        require: true
    },
    imagen:{
        type: String,
        require: true
    },
});

module.exports = mongoose.model('Imagen', ImagenSchema);