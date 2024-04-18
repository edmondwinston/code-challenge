import express, {type Application} from "express";

import {accountRouter} from "~/modules/account/account.controller";
import {scoresRouter} from "~/modules/scores/scores.controller";

export function attachRoutes(app: Application) {
	const router = express.Router();
	router.use("/account", accountRouter);
	router.use("/scores", scoresRouter);

	// Path of the below `router` is prefixed with `/api/v1`,
	// so the full path of `accountRouter` is `/api/v1/account`.
	app.use("/api/v1", router);

	app.get("/healthcheck", (_, res) => {
		return res.status(200).json({message: "Service is healthy."});
	});

	app.get("/", (_, res) => {
		return res
			.status(200)
			.json({message: "Welcome to the service. This is the root path."});
	});
}
