import { Router } from "express";
import { check } from "express-validator";
import { login } from "../controllers/auth.mjs";
import { validarCampos } from "../middlewares/validarCampos.mjs";

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

export default router;
