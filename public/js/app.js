import proyectos from "./modules/proyectos";
import tareas from "./modules/tareas";
import { actualizarAvance } from "./funciones/avance";
// usar dom
document.addEventListener("DOMContentLoaded", () => {
  actualizarAvance();
});
