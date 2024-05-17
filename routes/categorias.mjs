import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validarCampos.mjs";
import { validarjwt } from "../middlewares/validarjwt.mjs";
import {
  actualizarCategoria,
  borrarCategoria,
  crearCategoria,
  obtenerCategoria,
  obtenerCategorias,
} from "../controllers/categorias.mjs";
import { existeCategoria } from "../helpers/db-validators.mjs";
import { validarRoles } from "../middlewares/validarRoles.mjs";

const router = Router();
/**
 * {{url}}/api/categorias
 */
// obtener todas las categorias - publico
router.get("/", obtenerCategorias);

// obtener una categoria por id  - publico
router.get(
  "/:id",
  [
    check("id", "No es un id de mongo valido").isMongoId(),
    check("id").custom(existeCategoria),
    validarCampos,
  ],
  obtenerCategoria
);

// crear categoria - privado - cualquier persona con un token valido
router.post(
  "/",
  [
    validarjwt,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

// actualizar categoria - privado - cualquier persona con un token valido
router.put(
  "/:id",
  [
    validarjwt,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("id").custom(existeCategoria),
    validarCampos,
  ],
  actualizarCategoria
);

// eliminar categoria - privado - admin
router.delete(
  "/:id",
  [
    validarjwt,
    validarRoles,
    check("id", "No es un id de mongo valido").isMongoId(),
    check("id").custom(existeCategoria),
    validarCampos,
  ],
  borrarCategoria
);

export default router;
