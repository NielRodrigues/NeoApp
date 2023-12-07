import express from "express";
import routes from "./routes";
import authorizationMiddlewares from "./apps/middlewares/auth"

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(authorizationMiddlewares);
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;