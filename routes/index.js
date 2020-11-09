const express = require("express");
// importnado express validator
const { body } = require("express-validator");
const router = express.Router();

// importnado el controlador
const proyectosController = require("../controllers/proyectosController");
const tareasController = require("../controllers/tareasController");
const usuariosController = require("../controllers/usuariosController");
const authController = require("../controllers/authController");

// exportnado las routas para usarlos en otro archivo
module.exports = function () {
  router.get("/", proyectosController.proyectosHome);
  router.get("/nuevo-proyecto", proyectosController.formularioProyecto);
  router.post(
    "/nuevo-proyecto",
    [body("nombre").not().isEmpty().trim().escape()],
    proyectosController.nuevoProyecto
  );
  // listar proyecto
  router.get("/proyecto/:url", proyectosController.proyectoPorUrl);
  router.get("/proyecto/editar/:id", proyectosController.formularioEditar);
  router.post(
    "/nuevo-proyecto/:id",
    [body("nombre").not().isEmpty().trim().escape()],
    proyectosController.actualizarProyecto
  );
  // delete proyecto
  router.delete("/proyecto/:url", proyectosController.eliminarProyecto);

  // routes para las tareas
  router.post("/proyecto/:url", tareasController.agregarTarea);
  // update tarea
  router.patch("/tareas/:id", tareasController.cambiarEstadoTarea);
  router.delete("/tareas/:id", tareasController.eliminarTarea);

  // crear nueva cuenta
  router.get("/crear-cuenta", usuariosController.formCrearCuenta);
  router.post("/crear-cuenta", usuariosController.crearCuenta);
  router.get("/iniciar-sesion", usuariosController.iniciarSesion);
  router.post("/iniciar-sesion", authController.autenticarUsuario);

  return router;
};
