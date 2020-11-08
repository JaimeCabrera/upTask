const { DataTypes } = require("sequelize");
const slug = require("slug");
const shortid = require("shortid");
// importando la conexion a la db
const db = require("../config/db");

const Proyectos = db.define(
  "proyectos",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: DataTypes.STRING,
    url: DataTypes.STRING,
  },
  {
    hooks: {
      // funcion que se ejecuta antes de insertar
      beforeCreate(proyecto) {
        const url = slug(proyecto.nombre).toLowerCase();
        // agregabndo un id unico al url con shortid
        proyecto.url = `${url}-${shortid.generate()}`;
      },
    },
  }
);

module.exports = Proyectos;
