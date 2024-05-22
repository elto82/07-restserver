import { response } from "express";
import { subirArchivo } from "../helpers/subir-archivo.mjs";
import { Producto, Usuario } from "../models/index.mjs";
import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { v2 as cloudinary } from "cloudinary";
cloudinary.config(process.env.CLOUDINARY_URL);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cargarArchivo = async (req, res = response) => {
  // se crea middleware para validar si hay archivos
  // if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
  //   res.status(400).json("No hay archivos para subir");
  //   return;
  // }
  try {
    //imagenes
    // const nombre = await subirArchivo(req.files, ["txt", "md"], "textos");
    const nombre = await subirArchivo(req.files);
    res.json({ nombre });
  } catch (msg) {
    res.status(400).json({ msg });
  }
};

const actualizarImagen = async (req, res = response) => {
  // se crea middleware para validar si hay archivos
  // if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
  //   res.status(400).json("No hay archivos para subir");
  //   return;
  // }
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe el usuario con el id ${id}` });
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe el producto con el id ${id}` });
      }
      break;
    default:
      return res.status(500).json({ msg: "Se me olvido validar esto" });
  }

  //limpiar imagenes previas
  if (modelo.img) {
    // borrar la imagen del servidor
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );
    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen);
    }
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = nombre;
  await modelo.save();
  res.json(modelo);
};

const actualizarImagenCloudinary = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe el usuario con el id ${id}` });
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe el producto con el id ${id}` });
      }
      break;
    default:
      return res.status(500).json({ msg: "Se me olvido validar esto" });
  }

  //limpiar imagenes previas
  if (modelo.img) {
    // borrar la imagen del servidor
    const nombreArr = modelo.img.split("/");
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");
    cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  modelo.img = secure_url;
  await modelo.save();
  res.json(modelo);
};

const mostrarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe el usuario con el id ${id}` });
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe el producto con el id ${id}` });
      }
      break;
    default:
      return res.status(500).json({ msg: "Se me olvido validar esto" });
  }

  //limpiar imagenes previas
  if (modelo.img) {
    // borrar la imagen del servidor
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );
    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen);
    }
  }
  const pathImagen = path.join(__dirname, "../assets/no-image.jpg");
  res.sendFile(pathImagen);
};

export {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary,
};
