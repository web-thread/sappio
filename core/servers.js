import express from "express";
import swStats from "swagger-stats";
import swaggerUi from "swagger-ui-express";
import { parseExpressApp } from "express-route-parser";

import { log } from "../utils/logger.js";
import { swaggerSpec } from "../utils/swagger.js";
import { router } from "./routes/root.js";
import { middlewares } from "./middlewares/bundler.js";
import { errors_MWs } from "./middlewares/errors.js";

import apps from "./apps.js";

let app = {};

for(const app_index in apps) {
  app = apps[app_index];

  app.set("views", process.cwd() + "/core/views");
  app.set("view engine", "pug");

  app.use(express.static(process.cwd() + "/public"));

  // Swagger middleware

  /**
   * @openapi
   * /health:
   *   get:
   *     description: server status
   *     responses:
   *       200:
   *         description: Returns a json file with current server status.
   */

   /**
   * @openapi
   * /info:
   *   get:
   *     description: current server info
   *     responses:
   *       200:
   *         description: Returns a json file with current server info.
   */

   /**
   * @openapi
   * /swagger-stats:
   *   get:
   *     description: swagger descriptive request statistics
   *     responses:
   *       200:
   *         description: Returns a descriptive application swagger with request statistics.
   */

  app.use(
    swStats.getMiddleware({
      swaggerSpec: swaggerSpec,
    })
  );

  app.use("/swagger", swaggerUi.serve);

  /**
   * @openapi
   * /swagger:
   *   get:
   *     description: routes description
   *     responses:
   *       200:
   *         description: Returns the swagger of available routes.
   */
  router.get("/swagger", swaggerUi.setup(swaggerSpec));

  for (const middleware of middlewares) {
    app.use(middleware);
  }

  app.use(router);

  /**
   * Any error handler middleware MUST be added after we define our routes.
   */
  for (const error_middleware of errors_MWs) {
    app.use(error_middleware);
  }

  /**
   * @openapi
   * /all:
   *   get:
   *     description: available routes
   *     responses:
   *       200:
   *         description: Returns the available routes.
   */
  app.get("/all", function (req, res) {
    res.send(parseExpressApp(app));
  });

  apps[app_index] = app;
}

export default apps;

