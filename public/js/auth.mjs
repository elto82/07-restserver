//referecias al HTML
const miFormulario = document.querySelector("form");

const url = window.location.hostname.includes("localhost")
  ? "http://localhost:3000/api/auth/"
  : "https://restserver-1.onrender.com/api/auth/";

miFormulario.addEventListener("submit", (ev) => {
  ev.preventDefault();

  const formData = {};

  for (let el of miFormulario.elements) {
    if (el.name.length > 0) {
      formData[el.name] = el.value;
    }
  }
  // console.log(formData);
  fetch(url + "login", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: { "Content-Type": "application/json" },
  })
    .then((resp) => resp.json())
    .then(({ msg, token }) => {
      if (msg) {
        return console.error(msg);
      }
      localStorage.setItem("token", token);
    })
    .catch((err) => console.log(err));
});

function handleCredentialResponse(response) {
  const id_token = response.credential;
  console.log("ID Token: " + id_token);
  const responsePayload = decodeJwtResponse(id_token);

  // console.log("ID: " + responsePayload.sub);
  // console.log("Full Name: " + responsePayload.name);
  // console.log("Given Name: " + responsePayload.given_name);
  // console.log("Family Name: " + responsePayload.family_name);
  // console.log("Image URL: " + responsePayload.picture);
  // console.log("Email: " + responsePayload.email);

  // Aquí puedes enviar el token al servidor si es necesario
  // Por ejemplo:
  fetch(url + "google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id_token: response.credential }),
  })
    .then((response) => response.json())
    .then(({ token }) => {
      localStorage.setItem("token", token);
      // Aquí puedes guardar el token en el almacenamiento local o manejar la autenticación
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function decodeJwtResponse(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  // console.log(token);
  return JSON.parse(jsonPayload);
}

function signOut() {
  const client_id =
    "903546997869-plng4ai0k0vhsbvekkhdk1ju8tcb9gu0.apps.googleusercontent.com";
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = `https://accounts.google.com/logout`;
  document.body.appendChild(iframe);

  // Remover el iframe después de un segundo
  setTimeout(() => {
    document.body.removeChild(iframe);
    console.log("User signed out.");
  }, 1000);

  // Aquí puedes realizar otras acciones de cierre de sesión como limpiar la información de usuario almacenada
}
