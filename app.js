const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const connectDb = require('./controllers/DB');
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');

//Rutas de vistas
const routes = require('./routes/routes');
//Rutas de funciones
const routesFunc = require('./routes/funciones.routes');

dotenv.config();
connectDb();
//Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(session({
    secret:'keyboard car',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));


/* Rutas */
app.use("/", routes);
app.use("/", routesFunc);

app.listen(port, () => {
  console.log(`Aplicacion corriendo en http://localhost:${port}`);
});
