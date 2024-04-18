import type {Application} from "express";

import {attachMiddlewares} from "./attach-middlewares";
import {attachRoutes} from "./attach-routes";

export function configureServer(app: Application) {
	attachMiddlewares(app);
	attachRoutes(app);
}
