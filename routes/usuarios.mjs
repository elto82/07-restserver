import { Router } from "express";
import { check } from "express-validator";
import {
  usuariosDelete,
  usuariosGet,
  usuariosPatch,
  usuariosPost,
  usuariosPut,
} from "../controllers/usuarios.mjs";
import { validarCampos } from "../middlewares/validarCampos.mjs";
import {
  existEmail,
  existUserById,
  isValidRole,
} from "../helpers/db-validators.mjs";

const router = Router();

router.get("/", usuariosGet);

router.put(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existUserById),
    check("rol").custom(isValidRole),
    validarCampos,
  ],
  usuariosPut
);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe ser de 6 caracteres").isLength({
      min: 6,
    }),
    check("correo", "El correo no es valido").isEmail(),
    check("correo").custom(existEmail),
    // check("rol", "No es un rol valido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("rol").custom(isValidRole),
    validarCampos,
  ],
  usuariosPost
);

router.delete(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existUserById),
    validarCampos,
  ],
  usuariosDelete
);

router.patch("/", usuariosPatch);

export default router;
