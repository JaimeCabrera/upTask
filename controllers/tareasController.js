const Proyectos = require("../models/Proyectos");
const Tareas = require("../models/Tareas");

exports.agregarTarea = async (req, res, next) => {
  const proyecto = await Proyectos.findOne({ where: { url: req.params.url } });
  // leer el valor del input
  const { tarea } = req.body;
  const estado = 0;
  // insertar en la db y redireccionar
  const tareas = await Tareas.create({
    tarea,
    estado,
    proyectoId: proyecto.id,
  });
  if (!tareas) {
    next();
  }
  res.redirect(`/proyecto/${req.params.url}`);
};

exports.cambiarEstadoTarea = async (req, res, next) => {
  const { id } = req.params;
  // buscamos la tarea por id
  const tarea = await Tareas.findOne({ where: { id } });
  let estado = 0;
  // si el estado esta en cero cambiala
  if (tarea.estado === estado) {
    estado = 1;
  }
  // si estaba en 1 camboala a 0
  tarea.estado = estado;
  const resultado = await tarea.save();
  if (!resultado) {
    next();
  }
  res.status(200).send("Actualizado");
};
exports.eliminarTarea = async (req, res, next) => {
  const { id } = req.params;
  const tarea = await Tareas.destroy({ where: { id } });
  if (!tarea) {
    next();
  }
  res.status(200).send("Tarea Eliminada correctamente");
};
