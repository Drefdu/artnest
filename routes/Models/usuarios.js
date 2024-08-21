const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
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
        unique: true
    },
    telefono:{
        type: Number,
        require: true,
        unique: true
    },
    foto:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    code: {
        type: Number
    },
    code_confirmed: {
        type: Boolean
    },
    preguntaSeguridad: {
        type: String
    },
    respuestaSeguridad: {
        type: String
    }
});
module.exports = mongoose.model('Usuario', UsuarioSchema);