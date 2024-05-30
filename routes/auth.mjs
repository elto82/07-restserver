import { Router } from "express";
import { check } from "express-validator";
import { googleSignin, login, renovarToken } from "../controllers/auth.mjs";
import { validarCampos } from "../middlewares/validarCampos.mjs";
import { validarjwt } from "../middlewares/validarjwt.mjs";

const router = Router();

router.post(
  "/login",
  [
    check("correo", "Email is required").isEmail(),
    check("password", "Password is required").not().isEmpty(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  login
);

router.post(
  "/google",
  [
    check("id_token", "El id_token es necesario").not().isEmpty(),
    validarCampos,
  ],
  googleSignin
);

router.get("/", validarjwt, renovarToken);

export default router;
