import { Router } from "express";
import { buscar } from "../controllers/buscar.mjs";

const router = Router();

router.get("/:coleccion/:termino", buscar);

export default router;
