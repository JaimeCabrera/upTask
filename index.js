// import express from 'express' express no sopporta esta sintaxis
const express = require("express");
const routes = require("./routes/index");
const path = require("path");
const bodyParser = require("body-parser");

// helpers con algunas funcones
const helpers = require("./helpers");

// cread db conection
const db = require("./config/db");
// importat el modelo con el autehnticate solo se conecta con el sync crea la strutura de la bd
require("./models/Proyectos");
db.sync()
  .then(() => {
    console.log("conectado al servidor");
  })
  .catch((error) => console.log(error));

// crear app de express
const app = express();
// static files
app.use(express.static("public"));
// add pug view engine
app.set("view engine", "pug");

// add vardump to app
app.use((req, res, next) => {
  // para que el helper este presente en cualuier lugar de la app
  res.locals.year = 2019;
  res.locals.vardump = helpers.vardump;
  next();
});

// add view folder
app.set("views", path.join(__dirname, "./views"));
// add bodyparser  to read form data
app.use(bodyParser.urlencoded({ extended: true }));
// Routes
app.use("/", routes());

//puerto del servidor
app.listen(3000, () => {
  console.log("server express online on port:3000");
});
