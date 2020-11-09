// import express from 'express' express no sopporta esta sintaxis
const express = require("express");
const routes = require("./routes/index");
const path = require("path");
const bodyParser = require("body-parser");
// const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");

// helpers con algunas funcones
const helpers = require("./helpers");

// cread db conection
const db = require("./config/db");
// importat el modelo con el autehnticate solo se conecta con el sync crea la strutura de la bd
require("./models/Proyectos");
require("./models/Tareas");
require("./models/Usuarios");

db.sync()
  .then(() => console.log("conectado al servidor"))
  .catch((error) => console.log(error));

// crear app de express
const app = express();

// expresvlidator
// app.use(expressValidator);
// static files
app.use(express.static("public"));
// add pug view engine
app.set("view engine", "pug");

// add bodyparser  to read form data
app.use(bodyParser.urlencoded({ extended: false }));
// add view folder
app.set("views", path.join(__dirname, "./views"));
// add flash messages

app.use(flash());

app.use(cookieParser());
// sesiones nos permiten navegar entre paginas sin autenticar
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// add vardump to app
app.use((req, res, next) => {
  // para que el helper este presente en cualuier lugar de la app
  res.locals.vardump = helpers.vardump;
  res.locals.mensajes = req.flash();
  next();
});

// Routes
app.use("/", routes());

//puerto del servidor
app.listen(3000, () => {
  console.log("server express online on port:3000");
});
