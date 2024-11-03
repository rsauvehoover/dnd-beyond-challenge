import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import DBManager from "./db/db";

import Router from "./routes";

const PORT = process.env.PORT || 3000;

const app: Application = express();

app.use(express.json());
app.use(express.static("public"));

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

app.use(Router);

const dbm = new DBManager();

dbm.start().then(async () => {
  await dbm.initCharacterCollection();
  app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
  });
})

