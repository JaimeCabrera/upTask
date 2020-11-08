const express = require("express");
// importnado express validator
const { body } = require("express-validator");
const router = express.Router();

// importnado el controlador
const proyectosController = require("../controllers/proyectosController");
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

  return router;
};
