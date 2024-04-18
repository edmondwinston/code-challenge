import express from "express";

import {getScores} from "./scores.service.js";

import {ensureAuthenticated} from "../../middlewares";

/**
 * @base_path /api/v1/scores
 */
export const scoresRouter = express
	.Router()
	.get("/", getScores)
	.post("/update", ensureAuthenticated, (req, res) => {});
