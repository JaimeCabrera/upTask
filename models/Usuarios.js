const { DataTypes } = require("sequelize");
const Proyectos = require("../models/Proyectos");
const db = require("../config/db");
const bcrypt = require("bcrypt-nodejs");

const Usuarios = db.define(
  "usuarios",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(70),
      allowNull: false,
      validate: {
        isEmail: {
          msg: "Agregar un correo válido",
        },
        notEmpty: {
          msg: "El email no puede ir vacio",
        },
      },
      unique: {
        args: true,
        msg: "Email ya registrado",
      },
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El password no puede ir vacio",
        },
      },
    },
    activo: {
      type: DataTypes.INTEGER,
      defaultValiu: 0,
    },
    token: DataTypes.STRING,
    expire: DataTypes.INTEGER,
  },
  {
    hooks: {
      beforeCreate(usuario) {
        usuario.password = bcrypt.hashSync(
          usuario.password,
          bcrypt.genSaltSync(10)
        );
      },
    },
  }
);
// metodos personaloizados
Usuarios.prototype.verificarPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};
Usuarios.hasMany(Proyectos);
module.exports = Usuarios;
