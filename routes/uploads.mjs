import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validarCampos.mjs";
import {
  actualizarImagen,
  actualizarImagenCloudinary,
  cargarArchivo,
  mostrarImagen,
} from "../controllers/uploads.mjs";
import { coleccionesPermitidas } from "../helpers/db-validators.mjs";
import { validarArchivoSubir } from "../middlewares/validar-archivo.mjs";

const router = Router();

router.post("/", validarArchivoSubir, cargarArchivo);

router.put(
  "/:coleccion/:id",
  [
    validarArchivoSubir,
    check("id", "El id debe ser de mongo").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  // actualizarImagen
  actualizarImagenCloudinary
);

router.get(
  "/:coleccion/:id",
  [
    check("id", "El id debe ser de mongo").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  mostrarImagen
);

export default router;
