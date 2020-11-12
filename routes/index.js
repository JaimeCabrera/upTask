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
  router.get(
    "/",
    authController.usuarioAutenticado,
    proyectosController.proyectosHome
  );
  router.get(
    "/nuevo-proyecto",
    authController.usuarioAutenticado,
    proyectosController.formularioProyecto
  );
  router.post(
    "/nuevo-proyecto",
    authController.usuarioAutenticado,
    [body("nombre").not().isEmpty().trim().escape()],
    proyectosController.nuevoProyecto
  );
  // listar proyecto
  router.get(
    "/proyecto/:url",
    authController.usuarioAutenticado,
    proyectosController.proyectoPorUrl
  );
  router.get(
    "/proyecto/editar/:id",
    authController.usuarioAutenticado,
    proyectosController.formularioEditar
  );
  router.post(
    "/nuevo-proyecto/:id",
    authController.usuarioAutenticado,
    [body("nombre").not().isEmpty().trim().escape()],
    proyectosController.actualizarProyecto
  );
  // delete proyecto
  router.delete(
    "/proyecto/:url",
    authController.usuarioAutenticado,
    proyectosController.eliminarProyecto
  );

  // routes para las tareas
  router.post(
    "/proyecto/:url",
    authController.usuarioAutenticado,
    tareasController.agregarTarea
  );
  // update tarea
  router.patch(
    "/tareas/:id",
    authController.usuarioAutenticado,
    tareasController.cambiarEstadoTarea
  );
  router.delete(
    "/tareas/:id",
    authController.usuarioAutenticado,
    tareasController.eliminarTarea
  );

  // crear nueva cuenta
  router.get("/crear-cuenta", usuariosController.formCrearCuenta);
  router.post("/crear-cuenta", usuariosController.crearCuenta);
  router.get("/iniciar-sesion", usuariosController.iniciarSesion);
  router.post("/iniciar-sesion", authController.autenticarUsuario);
  router.get("/confirmar/:correo", usuariosController.confirmarCuenta);
  // cerrar sesion
  router.get("/cerrar-sesion", authController.cerrarSesion);
  // restablecer contraseña
  router.get("/restablecer", usuariosController.formRestablecerPassword);
  router.post("/restablecer", authController.enviarToken);
  router.get("/restablecer/:token", authController.resetPasswordForm);
  router.post("/restablecer/:token", authController.updatePassword);

  return router;
};
