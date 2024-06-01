const url = window.location.hostname.includes("localhost")
  ? "http://localhost:3000/api/auth/"
  : "https://restserver-1.onrender.com/api/auth/";

let usuario = null;
let socket = null;

// Referencias HTML
const txtUid = document.querySelector("#txtUid");
const txtMensaje = document.querySelector("#txtMensaje");
const ulUsuarios = document.querySelector("#ulUsuarios");
const ulMensajes = document.querySelector("#ulMensajes");
const btnSalir = document.querySelector("#btnSalir");

const dibujarUsuarios = (usuarios = []) => {
  let usersHtml = "";
  usuarios.forEach(({ nombre, uid }) => {
    usersHtml += `
      <li>
        <p>
          <h5 class="text-success">${nombre}</h5>
          <span class="fs-6 text-muted">${uid}</span>
        </p>
      </li>
    `;
  });

  ulUsuarios.innerHTML = usersHtml;
};

const dibujarMensajes = (mensajes = []) => {
  let mensajesHtml = "";
  mensajes.forEach(({ nombre, mensaje }) => {
    mensajesHtml += `
      <li>
        <p>
          <span class="text-primary">${nombre}:</span>
          <span>${mensaje}</span>
        </p>
      </li>
    `;
  });

  ulMensajes.innerHTML = mensajesHtml;
};

const dibujarMensajePrivado = (mensaje) => {
  const { de, mensaje: mensajePrivado } = mensaje;
  ulMensajes.innerHTML += `
    <li>
      <p>
        <span class="text-danger">${de} (privado):</span>
        <span>${mensajePrivado}</span>
      </p>
    </li>
  `;
};

// Validar el token del localStorage
const validarJWT = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location = "index.html";
    throw new Error("No hay token en el servidor");
  }

  const resp = await fetch(url, {
    headers: { "x-token": token },
  });

  const { usuario: userDB, token: tokenDB } = await resp.json();
  localStorage.setItem("token", tokenDB);
  usuario = userDB;
  document.title = usuario.nombre;

  await conectarSocket();
};

const conectarSocket = async () => {
  socket = io({
    extraHeaders: {
      "x-token": localStorage.getItem("token"),
    },
  });

  socket.on("connect", () => {
    console.log("Socket online");
  });

  socket.on("disconnect", () => {
    console.log("Socket offline");
  });

  socket.on("recibir-mensajes", (mensajes) => {
    dibujarMensajes(mensajes);
  });

  socket.on("usuarios-activos", (usuarios) => {
    dibujarUsuarios(usuarios);
  });

  socket.on("mensaje-privado", (mensaje) => {
    dibujarMensajePrivado(mensaje);
  });
};

txtMensaje.addEventListener("keyup", ({ keyCode }) => {
  const mensaje = txtMensaje.value;
  const uid = txtUid.value;

  if (keyCode !== 13) return;

  if (mensaje.length === 0) return;

  socket.emit("enviar-mensaje", { mensaje, uid });
  txtMensaje.value = "";
});

btnSalir.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location = "index.html";
});

const main = async () => {
  await validarJWT();
};

main();
