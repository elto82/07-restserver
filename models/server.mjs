import express from "express";
import "dotenv/config";
import cors from "cors";
import userRoutes from "../routes/usuarios.mjs";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPath = "/api/usuarios";
    //Middlewares
    this.middlewares();
    //Rutas de mi app
    this.routes();
  }

  middlewares() {
    //cors
    this.app.use(cors());
    //Lectura y parseo del body
    this.app.use(express.json());
    //directorio publico
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.usuariosPath, userRoutes);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`http://localhost:${this.port}`);
    });
  }
}

export default Server;
