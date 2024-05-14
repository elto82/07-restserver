import { response } from "express";
import Usuario from "../models/usuario.mjs";
import bcryptjs from "bcryptjs";

const usuariosGet = async (req, res = response) => {
  // const { q, nombre = "sin nombre", apikey, page=1, limit } = req.query;
  const query = { estado: true };
  const { limite = 5, desde = 0 } = req.query;
  // const users = await Usuario.find(query)
  //   .skip(Number(desde))
  //   .limit(Number(limite));
  // const total = await Usuario.countDocuments(query);

  const resp = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  const [total, users] = resp;

  res.json({
    total,
    users,
  });
};

const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({
    nombre,
    correo,
    password,
    rol,
  });
  // verificar si el correo existe
  // const existeEmail = await Usuario.findOne({ correo });
  // if (existeEmail) {
  //   return res.status(400).json({
  //     msg: "El correo ya existe",
  //   });
  // }

  //encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);
  //guardar en la base de datos
  await usuario.save();
  res.json({
    msg: "post API - controller",
    usuario,
  });
};

const usuariosPut = async (req, res = response) => {
  const id = req.params.id;
  const { _id, password, google, correo, ...resto } = req.body;
  //validar contra base de datos
  if (password) {
    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }
  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json({
    usuario,
  });
};

const usuariosPatch = (req, res = response) => {
  res.json({
    msg: "patch API - controller",
    url: req.url,
  });
};

const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;
  //borrado fisico
  // const usuario = await Usuario.findByIdAndDelete(id);

  //borrado logico
  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
  const usuarioAutenticado = req.usuario;
  res.json({
    usuario,
    // usuarioAutenticado,
  });
};

export {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch,
};
