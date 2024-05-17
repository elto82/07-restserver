import express from "express";
import "dotenv/config";
import cors from "cors";
import authRoutes from "../routes/auth.mjs";
import userRoutes from "../routes/usuarios.mjs";
import categoriaRoutes from "../routes/categorias.mjs";
import productoRoutes from "../routes/productos.mjs";
import buscarRouter from "../routes/buscar.mjs";
import { dbConnection } from "../database/config.mjs";

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
  }

  routes() {
    this.app.use(this.paths.auth, authRoutes);
    this.app.use(this.paths.usuarios, userRoutes);
    this.app.use(this.paths.categorias, categoriaRoutes);
    this.app.use(this.paths.productos, productoRoutes);
    this.app.use(this.paths.buscar, buscarRouter);
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
