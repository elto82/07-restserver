import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
//uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

// Obtener el nombre de archivo y el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const subirArchivo = (
  files,
  extensionesValidas = ["png", "jpg", "jpeg", "gif"],
  carpeta = ""
) => {
  return new Promise((resolve, reject) => {
    const { archivo } = files;
    const nombreCortado = archivo.name.split(".");
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //validar extension
    // const extensionesValidas = ["png", "jpg", "jpeg", "gif"];
    if (!extensionesValidas.includes(extensionArchivo)) {
      return reject(
        `La extensión ${extensionArchivo} no es permitida - ${extensionesValidas}`
      );
    }
    // Generar el nombre del archivo
    const nombreArchivo = `${Date.now()}.${extensionArchivo}`;

    const nombreTemp = uuidv4() + "." + extensionArchivo;
    const uploadPath = path.join(__dirname, "../uploads/", carpeta, nombreTemp);

    archivo.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }

      resolve(nombreTemp);
    });
  });
};

export { subirArchivo };
