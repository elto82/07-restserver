import { Socket } from "socket.io";
import { comprobarJWT } from "../helpers/generarJWT.mjs";

const socketController = async (socket = new Socket()) => {
  // console.log("cliente conectado", socket.id);
  const usuario = await comprobarJWT(socket.handshake.headers["x-token"]);
  if (!usuario) {
    return socket.disconnect();
  }
  console.log("se conecto", usuario.nombre);
};

export { socketController };
