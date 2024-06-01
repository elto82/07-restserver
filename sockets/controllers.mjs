import { Socket } from "socket.io";
import { comprobarJWT } from "../helpers/generarJWT.mjs";
import { ChatMensajes } from "../models/chatMensajes.mjs";

const chatMensajes = new ChatMensajes();

const socketController = async (socket = new Socket(), io) => {
  const usuario = await comprobarJWT(socket.handshake.headers["x-token"]);
  if (!usuario) {
    return socket.disconnect();
  }

  // Agregar el usuario conectado
  chatMensajes.conectarUsuario(usuario);
  io.emit("usuarios-activos", chatMensajes.usuariosArr);

  // Limpiar cuando se desconecta
  socket.on("disconnect", () => {
    chatMensajes.desconectarUsuario(usuario.id);
    io.emit("usuarios-activos", chatMensajes.usuariosArr);
  });

  // Escuchar los mensajes del cliente
  socket.on("enviar-mensaje", ({ uid, mensaje }) => {
    if (uid) {
      // Mensaje privado
      socket.to(uid).emit("mensaje-privado", { de: usuario.nombre, mensaje });
    } else {
      chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
      io.emit("recibir-mensajes", chatMensajes.ultimos10);
    }
  });
};

export { socketController };
