import { response } from "express";

const usuariosGet = (req, res = response) => {
  const { q, nombre = "sin nombre", apikey, page, limit } = req.query;
  res.json({
    msg: "get API - controller",
    q,
    nombre,
    apikey,
    page,
    limit,
  });
};

const usuariosPost = (req, res = response) => {
  const { nombre, edad } = req.body;
  console.log(nombre, edad);
  res.json({
    msg: "post API - controller",
    url: req.url,
    nombre,
    edad,
  });
};

const usuariosPut = (req, res = response) => {
  const id = req.params.id;
  console.log(id);
  res.json({
    msg: "put API - controller",
    id,
  });
};

const usuariosPatch = (req, res = response) => {
  res.json({
    msg: "patch API - controller",
    url: req.url,
  });
};

const usuariosDelete = (req, res = response) => {
  res.json({
    msg: "delete API - controller",
    url: req.url,
  });
};

export {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch,
};
