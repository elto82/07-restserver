import express from "express";
import "dotenv/config";
import cors from "cors";
import authRoutes from "../routes/auth.mjs";
import userRoutes from "../routes/usuarios.mjs";
import categoriaRoutes from "../routes/categorias.mjs";
import productoRoutes from "../routes/productos.mjs";
import buscarRouter from "../routes/buscar.mjs";
import uploadsRoutes from "../routes/uploads.mjs";
import { dbConnection } from "../database/config.mjs";
import fileUpload from "express-fileupload";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.paths = {
      auth: "/api/auth",
      usuarios: "/api/usuarios",
      categorias: "/api/categorias",
      productos: "/api/productos",
      buscar: "/api/buscar",
      uploads: "/api/uploads",
    };

    // Conectar a la base de datos
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas de mi app
    this.routes();
  }

  middlewares() {
    // Cors
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio público
    this.app.use(express.static("public"));

    // Fileupload - Carga de archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, authRoutes);
    this.app.use(this.paths.usuarios, userRoutes);
    this.app.use(this.paths.categorias, categoriaRoutes);
    this.app.use(this.paths.productos, productoRoutes);
    this.app.use(this.paths.buscar, buscarRouter);
    this.app.use(this.paths.uploads, uploadsRoutes);
  }

  async conectarDB() {
    await dbConnection();
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`http://localhost:${this.port}`);
    });
  }
}

export default Server;
