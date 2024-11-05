import express, { type Application } from "express";
import swaggerUi from "swagger-ui-express";
import DBManager from "./db/db";

import Router from "./routes";
import { Server } from "http";

const PORT = process.env.PORT || 3000;

export default class API {
  httpServer: Server | null;
  app: Application;
  dbm: DBManager;

  constructor() {
    this.httpServer = null;
    this.app = express();
    this.dbm = new DBManager();
  }

  public async start() {
    this.app.use(express.json());
    this.app.use(express.static("public"));

    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(undefined, {
        swaggerOptions: {
          url: "/swagger.json"
        }
      })
    );

    this.app.use(Router);

    await this.dbm.start();
    await this.dbm.initCharacterCollection();

    this.httpServer = this.app.listen(PORT);
  }

  public async stop() {
    await this.dbm.stop();
    if (this.httpServer) this.httpServer.close();
  }
}
