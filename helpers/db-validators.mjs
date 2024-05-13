import Role from "../models/rol.mjs";
import usuario from "../models/usuario.mjs";

const isValidRole = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no esta registrado en la BD`);
  }
};

const existEmail = async (correo = "") => {
  const existeEmail = await usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error(`El correo ${correo} ya esta registrado`);
  }
};

const existUserById = async (id) => {
  const existUser = await usuario.findById(id);
  if (!existUser) {
    throw new Error(`El id ${id} no existe`);
  }
};

export { isValidRole, existEmail, existUserById };
