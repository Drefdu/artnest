const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

app.engine(".html", require("ejs").__express);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/perfil", (req, res) => {
  res.render("perfil");
});

app.listen(port, () => {
  console.log(`Aplicacion corriendo en http://localhost:${port}`);
});
