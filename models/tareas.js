const { DataTypes } = require("sequelize");
const db = require("../config/db");
const Proyectos = require("../models/Proyectos");

const Tareas = db.define("tareas", {
  id: {
    type: DataTypes.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  tarea: DataTypes.STRING(100),
  estado: DataTypes.INTEGER(1),
});
// relaciones tarea pertenece al proyecto
Tareas.belongsTo(Proyectos);

module.exports = Tareas;
