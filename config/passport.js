const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// hacer refebecia al modelo donde vamos a autenticar
const Usuarios = require("../models/Usuarios");

// local strategy->login con crendencuiales propias user and pasword

passport.use(
  new LocalStrategy(
    // por default espera usuario y passwor
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const usuario = await Usuarios.findOne({ where: { email, activo: 1 } });
        // ese usuario exite,password incorrecto
        if (!usuario.verificarPassword(password)) {
          return done(null, false, {
            message: "Usuario o contrasañe incorrecta",
          });
        }
        // caso contrario emiao existe y password correcto
        return done(null, usuario);
      } catch (error) {
        return done(null, false, {
          message: "Esa cuenta no existe, o active su cuenta",
        });
      }
    }
  )
);
// serializar el usuario
passport.serializeUser((usuario, callback) => {
  callback(null, usuario);
});
// deserializar el usuario
passport.deserializeUser((usuario, callback) => {
  callback(null, usuario);
});
module.exports = passport;
