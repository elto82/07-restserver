import { Socket } from "socket.io";
import { comprobarJWT } from "../helpers/generarJWT.mjs";
import { ChatMensajes } from "../models/chatMensajes.mjs";

const chatMensajes = new ChatMensajes();

const socketController = async (socket = new Socket(), io) => {
  // console.log("cliente conectado", socket.id);
  const usuario = await comprobarJWT(socket.handshake.headers["x-token"]);
  if (!usuario) {
    return socket.disconnect();
  }
  // console.log("se conecto", usuario.nombre);
  //agregar el usuario conectado
  chatMensajes.conectarUsuario(usuario);
  io.emit("usuarios-activos", chatMensajes.usuariosArr);
};

export { socketController };
