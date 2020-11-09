import axios from "axios";
import Swal from "sweetalert2";
import { actualizarAvance } from "../funciones/avance";

const tareas = document.querySelector(".listado-pendientes");
if (tareas) {
  tareas.addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-check-circle")) {
      const icono = e.target;
      const idTarea = icono.parentElement.parentElement.dataset.tarea;
      // req tareas id
      const url = `${location.origin}/tareas/${idTarea}`;
      axios
        .patch(url, { idTarea })
        .then((resp) => {
          if (resp.status === 200) {
            // el toggle va hacer que le quita op el pone la clase completo
            icono.classList.toggle("completo");
            actualizarAvance();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (e.target.classList.contains("fa-trash")) {
      const tareaHtml = e.target.parentElement.parentElement;
      const idTarea = tareaHtml.dataset.tarea;
      Swal.fire({
        title: "Deseas borrar esta Tarea?",
        text: "Una Tarea eliminada no se puede recuperar!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si,Borrar!",
        cancelButtonText: "No Cancelar!",
      }).then((result) => {
        if (result.isConfirmed) {
          // req tareas id
          const url = `${location.origin}/tareas/${idTarea}`;
          axios
            .delete(url, { idTarea })
            .then((resp) => {
              if (resp.status === 200) {
                // eliminar el nodo de DOM
                tareaHtml.parentElement.removeChild(tareaHtml);
                // opcional alerta
                Swal.fire("Tarea Eliminada", resp.data, "success");
                actualizarAvance();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    }
  });
}
export default tareas;
