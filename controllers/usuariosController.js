const Usuarios = require("../models/Usuarios");
const enviarEmails = require("../handler/email");

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
    // crea una url de confirmar
    const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

    // crear el objeto de usuarioi
    const usuario = { email };
    // enviar email
    await enviarEmails.enviar({
      usuario,
      subject: "Confirma tu cuenta Uptask",
      confirmarUrl,
      archivo: "confirmarCuenta",
    });
    req.flash("correcto", "Enviamos un correo, confirma tu cuenta ");
    // redirigir al usuario
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
  const { error } = res.locals.mensajes;
  res.render("iniciarSesion", {
    nombrePagina: "Iniciar Sesion",
    error,
  });
};

exports.formRestablecerPassword = (req, res) => {
  res.render("restablecer", { nombrePagina: "Restablecer tu contraseña" });
};

// cambia el estado de una cuenta
exports.confirmarCuenta = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: { email: req.params.correo },
  });
  // sino bhay usuario
  if (!usuario) {
    req.flash("error", "Ni valido");
    res.redirect("/crear-cuenta");
  }
  usuario.activo = 1;
  usuario.save();
  req.flash("correcto", "Cuenta Activada con exito");
  res.redirect("/iniciar-sesion");
};
