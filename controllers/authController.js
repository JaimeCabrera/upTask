const passport = require("passport");
const Usuarios = require("../models/Usuarios");
const crypto = require("crypto");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt-nodejs");
const enviarEmails = require("../handler/email");

exports.autenticarUsuario = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/iniciar-sesion",
  failureFlash: true,
  badRequestMessage: "Los campos son obligatorios",
});
// funciones para revisar si el usuario esta logeado o no
exports.usuarioAutenticado = (req, res, next) => {
  // si el usuario esta logeado adelante
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/iniciar-sesion");
  // ssino redirigir a login
};

// funcion para cerra sesion
exports.cerrarSesion = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/iniciar-sesion"); //
  });
};

// genera un token si el email es valido para restablecer la password
exports.enviarToken = async (req, res) => {
  // verificar si el email existe
  const usuario = await Usuarios.findOne({ where: { email: req.body.email } });
  // sino exoste el usuario
  if (!usuario) {
    req.flash("error", "No existe esa cuenta");
    res.redirect("/restablecer");
  }
  // generar token y fechja de expiracion
  usuario.token = crypto.randomBytes(20).toString("hex");
  // expiracion
  usuario.expire = Date.now() + 3600;
  // giarar en la db
  await usuario.save();
  // url de reset
  const resetUrl = `http://${req.headers.host}/restablecer/${usuario.token}`;
  // comunicar el reset url envia el correo con el token
  await enviarEmails.enviar({
    usuario,
    subject: "Password Reset",
    resetUrl,
    archivo: "restablecerPasword",
  });
  // terminar el proceoso de enviar correo para eresta
  req.flash("correcto", "Se envio un mensaje a tu correo");
  res.redirect("/iniciar-sesion");
};
exports.resetPasswordForm = async (req, res) => {
  // res.json(req.params.token);
  const usuario = await Usuarios.findOne({
    where: { token: req.params.token },
  });
  if (!usuario) {
    res.flash("eror", "No valido");
    res.redirect("/restablecer");
  }
  // formulario para generar password
  res.render("resetPassword", { nombrePagina: "Restablecer contraseñ" });
};

// camvia el passowrd por uno nuevo
exports.updatePassword = async (req, res) => {
  // 7verifica el toek valido pero tambien la expiracion
  const usuario = await Usuarios.findOne({
    where: { token: req.params.token, expire: { [Op.gte]: Date.now() } },
  });
  // verificamos si el usuer existe
  if (!usuario) {
    req.flash("erro", "No valido");
    res.redirect("/restablecer");
  }
  //  pasa las validaciones hashear en nuevo passowr
  // limpiar el token y la expiracion
  usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSalt(10));
  usuario.token = null;
  usuario.expire = null;
  // guardar en nuevo passwoird  //
  usuario.save();
  req.flash("correcto", "Tu password se recuperado correctamente");
  res.redirect("/iniciar-sesion");
};
