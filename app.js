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



////////////////////////
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'formularios/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'formularios/register.html'));
});

app.post('/login', (req, res) => {
  // Simulate login validation
  if (req.body.username === 'user' && req.body.password === 'password') {
      req.session.user = req.body.username;
      return res.redirect('/');
  }
  res.redirect('/login');
});

app.post('/register', (req, res) => {
  // Handle user registration logic here
  res.redirect('/login');
});

app.use((req, res, next) => {
  if (!req.session.user && req.path !== '/login' && req.path !== '/register') {
      return res.redirect('/login');
  }
  next();
});

////////////////////////





app.listen(port, () => {
  console.log(`Aplicacion corriendo en http://localhost:${port}`);
});
