const Proyectos = require("../models/Proyectos");
const Tareas = require("../models/Tareas");

exports.proyectosHome = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({ where: { usuarioId } });
  res.render("index", { nombrePagina: "Proyectos", proyectos });
};
exports.formularioProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({ where: { usuarioId } });
  res.render("nuevoProyecto", { nombrePagina: "Nuevo Proyecto", proyectos });
};
exports.nuevoProyecto = async (req, res) => {
  // enviar a la consola lo que el usuario escriba req.body
  // console.log(req.body);if()
  // validar
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({ where: { usuarioId } });
  const nombre = req.body.nombre;
  let errores = [];
  if (!nombre) {
    errores.push({ texto: "Agrega un Nombre al Proyecto" });
  }
  // verificamos si existen errores
  if (errores.length > 0) {
    res.render("nuevoProyecto", {
      nombrePagina: "Nuevo Proyecto",
      proyectos,
      errores,
    });
  } else {
    // si no hay errores a insertar en la db
    // Proyectos.create({ nombre })
    //   .then(() => {
    //     console.log("insertado correctamente");
    //   })
    //   .catch((err) => console.log(err));
    // usando async await
    // const url = slug(nombre).toLowerCase(),
    const usuarioId = res.locals.usuario.id;
    await Proyectos.create({
      nombre,
      usuarioId,
    });
    res.redirect("/");
  }
};

exports.proyectoPorUrl = async (req, res) => {
  // para multiples consultas que son independietnes es mejor usar el promise
  const usuarioId = res.locals.usuario.id;
  const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });
  const proyectoPromise = Proyectos.findOne({
    where: {
      url: req.params.url,
      usuarioId,
    },
  });
  const [proyectos, proyecto] = await Promise.all([
    proyectosPromise,
    proyectoPromise,
  ]);
  // consultar tareas del proyecto actual
  const tareas = await Tareas.findAll({
    where: { proyectoId: proyecto.id },
    // include: [{ model: Proyectos }],
  });

  if (!proyecto) {
    res.redirect("/");
  }
  // pasar datos a la vista
  res.render("tareas", {
    nombrePagina: "Tareas del Proyecto",
    proyecto,
    proyectos,
    tareas,
  });
};

exports.formularioEditar = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });
  const proyectoPromise = Proyectos.findOne({
    where: {
      id: req.params.id,
      usuarioId,
    },
  });
  const [proyectos, proyecto] = await Promise.all([
    proyectosPromise,
    proyectoPromise,
  ]);

  res.render("nuevoProyecto", {
    nombrePagina: "Editar proyecto",
    proyectos,
    proyecto,
  });
};
exports.actualizarProyecto = async (req, res) => {
  // enviar a la consola lo que el usuario escriba req.body
  // console.log(req.body);if()
  // validar
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({ where: { usuarioId } });
  const nombre = req.body.nombre;
  let errores = [];
  if (!nombre) {
    errores.push({ texto: "Agrega un Nombre al Proyecto" });
  }
  // verificamos si existen errores
  if (errores.length > 0) {
    res.render("nuevoProyecto", {
      nombrePagina: "Nuevo Proyecto",
      proyectos,
      errores,
    });
  } else {
    await Proyectos.update(
      { nombre: nombre },
      { where: { id: req.params.id } }
    );
    res.redirect("/");
  }
};
exports.eliminarProyecto = async (req, res, next) => {
  // console.log("req del server", req.params);
  const { urlProyecto } = req.query;
  console.log(urlProyecto);
  const resultado = await Proyectos.destroy({ where: { url: urlProyecto } });
  if (!resultado) {
    return next();
  }
  res.status(200).send("Proyecto Eliminado correctamente");
};
