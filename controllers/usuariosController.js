const Usuarios = require("../models/Usuarios");

exports.formCrearCuenta = (req, res) => {
  res.render("crearCuenta", {
    nombrePagina: "Crear Cuenta",
  });
};
exports.crearCuenta = async (req, res, next) => {
  // leer los datos
  const { email, password } = req.body;

  try {
    // crear el usuario
    await Usuarios.create({
      email,
      password,
    });
    res.redirect("/iniciar-sesion");
  } catch (error) {
    // si hgay algun error se le pasa a la vista
    req.flash(
      "error",
      error.errors.map((error) => error.message)
    );
    res.render("crearCuenta", {
      mensajes: req.flash(),
      nombrePagina: "Crear Cuenta en Uptask",
      email,
      password,
    });
  }
};

exports.iniciarSesion = (req, res) => {
  res.render("iniciarSesion", {
    nombrePagina: "Iniciar Sesion",
  });
};
