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