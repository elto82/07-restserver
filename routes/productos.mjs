import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validarCampos.mjs";
import { validarjwt } from "../middlewares/validarjwt.mjs";
import {
  actualizarProducto,
  borrarProducto,
  crearProducto,
  obtenerProducto,
  obtenerProductos,
} from "../controllers/productos.mjs";
import { existeCategoria, existeProducto } from "../helpers/db-validators.mjs";
import { validarRoles } from "../middlewares/validarRoles.mjs";

const router = Router();
/**
 * {{url}}/api/productos
 */
// obtener todos los productos - publico
router.get("/", obtenerProductos);

// obtener una categoria por id  - publico
router.get(
  "/:id",
  [
    check("id", "No es un id de mongo valido").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos,
  ],
  obtenerProducto
);

// crear producto - privado - cualquier persona con un token valido
router.post(
  "/",
  [
    validarjwt,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "No es un id de mongo valido").isMongoId(),
    check("categoria").custom(existeCategoria),
    validarCampos,
  ],
  crearProducto
);

// actualizar producto - privado - cualquier persona con un token valido
router.put(
  "/:id",
  [
    validarjwt,
    check("categoria", "No es un id de Mongo").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos,
  ],
  actualizarProducto
);

// eliminar categoria - privado - admin
router.delete(
  "/:id",
  [
    validarjwt,
    validarRoles,
    check("id", "No es un id de mongo valido").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos,
  ],
  borrarProducto
);

export default router;
