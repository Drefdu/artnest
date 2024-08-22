const express = require('express');
const router = express.Router();
const Usuario = require('./Models/usuarios');
const Imagen = require('./Models/imagenes');
const multer = require('multer');
const fs = require('fs');
const path = require("path");
const crypto = require('crypto');
const axios = require('axios');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const url = 'https://rest.clicksend.com/v3/sms/send';
const username = 'eduelcrack33@gmaial.com';
const password = '874F1AB5-6774-2CAC-1C7C-AC842085EEAB';


router.post('/confirmation', async (req, res) => {
    let { code } = req.body;

    console.log(code);

    try {
        let user = await Usuario.findOne({ code: code });

        if (!user) {
            return res.send('<script>alert("Código inválido"); window.location.href = "/confirmation";</script>');
        }


        await Usuario.updateOne({ code: code }, { $set: { code_confirmed: true } });

        return res.render("formularios/login", { mensaje: "El usuario ha sido creado satisfactoriamente" });
    } catch (error) {
        console.error("Error during confirmation process:", error);
        return res.status(500).send('<script>alert("Ocurrió un error. Por favor, inténtalo de nuevo."); window.location.href = "/confirmation";</script>');
    }
});


router.post('/database/registro', upload.single('Foto'), async (req, res) => {
    try {
        const { Nombre, Apellidos, Correo, Telefono, Password, ConfirmarPassword,PreguntaSeguridad,RespuestaSeguridad } = req.body;
        let Foto;
        console.log(PreguntaSeguridad,RespuestaSeguridad);
        if (req.file) {
           
            Foto = req.file.buffer.toString('base64');
        } else { 
            
            const defaultImagePath = path.join(__dirname, '..', 'public', 'assets', 'user_Default.png');
            const defaultImageBuffer = fs.readFileSync(defaultImagePath);
            Foto = defaultImageBuffer.toString('base64');
        }
        let regexPass = /^[a-zA-Z0-9!#$%&\/?\\¿¡+*~{[^`},;.:_-]*$/;
        let regexUser = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        let regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!regexUser.test(Nombre) || !regexUser.test(Apellidos)) {
            return res.render("formularios/registro", { mensaje: "Nombre o Apellidos contienen caracteres no permitidos" });
        }
        if (!regexCorreo.test(Correo)) {
            return res.render("formularios/registro", { mensaje: "El correo electrónico no es válido" });
        }
        if (Password !== ConfirmarPassword) {
            return res.render("formularios/registro", { mensaje: "Las contraseñas no coinciden" });
        }
        if (!regexPass.test(Password)) {
            return res.render("formularios/registro", { mensaje: "La contraseña contiene caracteres no permitidos" });
        }
        let hash = crypto.createHash('sha1');
        let data = hash.update(Password, 'utf-8');
        let gen_hash = data.digest('hex');
        // let confirmationCode = Math.floor(10000 + Math.random() * 90000);
        const usuario = new Usuario({
            nombre: Nombre,
            apellidos: Apellidos,
            correo: Correo,
            telefono: Telefono,
            password: gen_hash,
            foto: Foto,
            code: confirmationCode,
            code_confirmed: false,
            preguntaSeguridad: PreguntaSeguridad,
            respuestaSeguridad: RespuestaSeguridad
        });
        const NuevoUsuario = await usuario.save();
        const sms = {
            messages: [
                {
                    body: `Tu codigo de confirmacion es:    ${confirmationCode}`,
                    to: `+52${Telefono}`,
                    from: "{{from}}"
                }
            ]
        };
    
        axios.post(url, sms,{
            auth: {
                username: username,
                password: password
            }
        })
        .then(response => {
            console.log('Respuesta:', response.data);
            return res.render('confirmation')
        })
        .catch(error => {
            console.error('Error:', error);
            res.send('<script>alert("Algo a fallado"); window.location.href = "/login";</script>');
        });

        


        



    return res.render("formularios/login", { mensaje: "El usuario ha sido creado satisfactoriamente" });
    } catch (error) {
        if (error.code === 11000) { 
            const campoDuplicado = Object.keys(error.keyPattern)[0];
            return res.render("formularios/registro", { mensaje: `El campo ${campoDuplicado} ya está registrado` });
        } else {
            console.error("Error en el servidor:", error);
            return res.render("error", { message: error.message });
        }
    }
});


//mi parte♥
router.post('/database/comprobar-seguridad', async (req, res) => {
    try {
        const { Correo, PreguntaSeguridad, RespuestaSeguridad } = req.body;

        const usuario = await Usuario.findOne({ correo: Correo });

        if (!usuario) {
            return res.render("formularios/recuperar", { mensaje: "El correo no está registrado" });
        }

        if (usuario.preguntaSeguridad !== PreguntaSeguridad || usuario.respuestaSeguridad !== RespuestaSeguridad) {
            return res.render("formularios/recuperar", { mensaje: "La pregunta o respuesta de seguridad son incorrectas" });
        }

        return res.render("formularios/cambiar", { correoSave: Correo });

    } catch (error) {
        console.error("Error en el servidor:", error);
        return res.render("error", { message: error.message });
    }
});

router.post('/database/cambiar-contrasena', async (req, res) => {
    try {
        const { Correo, NuevaPassword, ConfirmarPassword } = req.body;
        console.log(Correo, NuevaPassword, ConfirmarPassword);

        // Comprobación de contraseñas
        if (NuevaPassword !== ConfirmarPassword) {
            return res.render("formularios/cambiar", { mensaje: "Las contraseñas no coinciden", correo: Correo });
        }

        let regexPass = /^[a-zA-Z0-9!#$%&\/?\\¿¡+*~{[^`},;.:_-]*$/;
        if (!regexPass.test(NuevaPassword)) {
            return res.render("formularios/cambiar", { mensaje: "La contraseña contiene caracteres no permitidos", correo: Correo });
        }

        // Hash de la contraseña nueva
        let hash = crypto.createHash('sha1');
        let data = hash.update(NuevaPassword, 'utf-8');
        let gen_hash = data.digest('hex');

        // Actualización de la contraseña en la base de datos
        const updateResult = await Usuario.updateOne(
            { correo: Correo },
            { $set: { password: gen_hash } }
        );

        if (updateResult.nModified === 0) {
            return res.render("formularios/cambiar", { mensaje: "No se pudo actualizar la contraseña. Verifique los datos ingresados.", correo: Correo });
        }

        return res.render("formularios/login", { mensaje: "Contraseña cambiada exitosamente" });
    } catch (error) {
        console.error("Error en el servidor:", error);
        return res.render("error", { message: error.message });
    }
});






//hasta aqui♥


router.post('/database/login', async (req, res) => {
    try {
        const { Correo, Password } = req.body;
        let regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regexCorreo.test(Correo)) {
            return res.render("formularios/login", { mensaje: "El correo electrónico no es válido" });
        }
        const usuario = await Usuario.findOne({ correo: Correo });
        if (!usuario) {
            return res.render("formularios/login", { mensaje: "Correo electrónico no encontrado" });
        }
        let hash = crypto.createHash('sha1');
        let data = hash.update(Password, 'utf-8');
        let gen_hash = data.digest('hex');
        if (gen_hash !== usuario.password) {
            return res.render("formularios/login", { mensaje: "Contraseña incorrecta" });
        }
        

        // if(!usuario.code_confirmed) {
        //     return res.render('confirmation')
        // } else {

        //     req.session.usuario = usuario;
        //     req.session.save()

                 return res.redirect('/')
        // }

        
    } catch (error) {
        return res.render("error", { message: error.message });
    }
});


router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});


router.get('/database/imagenes', async (req, res) => {
    try {
        const imagenes = await Imagen.find();
        res.status(200).json(imagenes);
    } catch (error) {
        return res.render("error", { message: error.message });
    }
});


router.get('/database/imagenes/:correo', async (req, res) => {
    const correo = req.params.correo;
    try {
        const imagenes = await Imagen.find({ correo });
        res.status(200).json(imagenes);
    } catch (error) {
        return res.render("error", { message: error.message });
    }
});

//Agregar una nueva imagen
router.post('/upload', upload.single('imagen'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No se subió ninguna imagen');
        }
        // Convertir la imagen a base64
        const base64Image = req.file.buffer.toString('base64');
        // Guardar la imagen en la base de datos o hacer lo que sea necesario
        // Aquí se guarda en la base de datos de ejemplo
 
        console.log(req.price)

        const nuevaImagen = new Imagen({
            nombreImagen: req.file.originalname,
            imagen: base64Image,
            correo: req.session.usuario.correo,
            nombre: req.session.usuario.nombre,
            apellidos: req.session.usuario.apellidos,
            price: req.price
        });

        await nuevaImagen.save();
        // Responder con éxito
        res.status(201).send('Imagen subida correctamente');
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        res.status(500).send('Error al subir la imagen');
    }
});

module.exports = router;
