import { request, response } from "express";
import jwt from "jsonwebtoken";
import Usuario from "../models/usuario.mjs";
import usuario from "../models/usuario.mjs";

const validarjwt = async (req = request, res = response, next) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay token en la peticion",
    });
  }
  try {
    const { uid } = jwt.verify(token, process.env.SECRET_JWT_SEED);

    //leer el usuario que corresponde al uid
    const usuario = await Usuario.findById(uid);
    if (!usuario) {
      return res.status(401).json({
        ok: false,
        msg: "Token no valido - usuario no existe en DB",
      });
    }

    //verificar si el uid tiene estado true
    if (!usuario.estado) {
      return res.status(401).json({
        ok: false,
        msg: "Token no valido - usuario estado:false",
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token no valido",
    });
  }
};
export { validarjwt };
