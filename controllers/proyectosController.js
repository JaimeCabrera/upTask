const Proyectos = require("../models/Proyectos");

exports.proyectosHome = async (req, res) => {
  const proyectos = await Proyectos.findAll();
  res.render("index", { nombrePagina: "Proyectos", proyectos });
};
exports.formularioProyecto = async (req, res) => {
  const proyectos = await Proyectos.findAll();
  res.render("nuevoProyecto", { nombrePagina: "Nuevo Proyecto", proyectos });
};
exports.nuevoProyecto = async (req, res) => {
  // enviar a la consola lo que el usuario escriba req.body
  // console.log(req.body);if()
  // validar
  const proyectos = await Proyectos.findAll();
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
    await Proyectos.create({
      nombre,
    });
    res.redirect("/");
  }
};

exports.proyectoPorUrl = async (req, res) => {
  // para multiples consultas que son independietnes es mejor usar el promise
  const proyectosPromise = Proyectos.findAll();
  const proyectoPromise = Proyectos.findOne({
    where: {
      url: req.params.url,
    },
  });
  const [proyectos, proyecto] = await Promise.all([
    proyectosPromise,
    proyectoPromise,
  ]);
  if (!proyecto) {
    res.redirect("/");
  }
  res.render("tareas", {
    nombrePagina: "Tareas del Proyecto",
    proyecto,
    proyectos,
  });
};

exports.formularioEditar = async (req, res) => {
  const proyectosPromise = Proyectos.findAll();
  const proyectoPromise = Proyectos.findOne({
    where: {
      id: req.params.id,
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
  const proyectos = await Proyectos.findAll();
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
