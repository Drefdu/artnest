const express = require('express');
const router = express.Router();

//Index
router.get("/", (req, res) => {
    res.render("index", { Usuario: req.session.usuario });
});
//Login
router.get("/login", (req, res) => {
    res.render("formularios/login", { Usuario: req.session.usuario, mensaje:"" });
});
//Registro
router.get("/registro", (req, res) => {
    res.render("formularios/registro", { Usuario: req.session.usuario, mensaje:"" });
});
//recuperar contraseña
router.get("/cambiar_contra", (req, res) => {
  res.render("formularios/rep_contra", { Usuario: req.session.usuario, mensaje:"" });
});

router.get("/cambiar", (req, res) => {
  res.render("formularios/cambiar", { Usuario: req.session.usuario, mensaje:"", correoSave:"" });
});
//Upload
router.get('/upload', (req,res)=>{
    if(req.session.usuario){
        res.render("funciones/upload", { Usuario: req.session.usuario, mensaje:"" })
    }
    else{
        res.render("formularios/login", { Usuario: req.session.usuario, mensaje:"No hay una sesión iniciada" });
    }
});

router.get("/perfil", (req, res) => {
  if (req.session.usuario) {
    res.render("perfil", {
      Usuario: req.session.usuario,
      mensaje: "",
    });
  } else {
    res.render("perfil", {
      Usuario: req.session.usuario,
      mensaje: "No hay una sesión iniciada",
    });
  }
});


router.get('/bookmarks', (req,res)=>{
    if(req.session.usuario){
        res.render("funciones/bookmarks", { Usuario: req.session.usuario, mensaje:"" })
    }
    else{
        res.render("formularios/login", { Usuario: req.session.usuario, mensaje:"No hay una sesión iniciada" });
    }
});


router.get('/confirmation', (req, res) => {
  res.render('confirmation');
});

router.get('/comprar/imagen', (req, res) => {
  res.render('comprar');
})

module.exports = router;