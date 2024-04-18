import {attachMiddlewares} from "./attach-middlewares.js";
import {attachRoutes} from "./attach-routes.js";
import { type Application} from 'express'

export function configureServer(app: :Application) {

  attachMiddlewares(app);
  attachRoutes(app);

}
