import { response } from "express";
import Usuario from "../models/usuario.mjs";
import bcrypt from "bcryptjs";
import { generarJWT } from "../helpers/generarJWT.mjs";

const login = async (req, res = response) => {
  const { correo, password } = req.body;
  try {
    //verificar si el correo existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - correo",
      });
    }

    //verificar si el usuario esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - estado:false",
      });
    }
    //verificar si el password es correcto
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - password",
      });
    }

    //generar el token jwt
    const token = await generarJWT(usuario.id);

    res.json({
      msg: "login ok",
      usuario,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "error en el servidor",
    });
  }
};

export { login };
