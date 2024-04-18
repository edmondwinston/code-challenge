import type {Request, Response} from "express";

export function getScores(req: Request, res: Response) {
	return res.status(200).json({message: "Hi there!", user: req.user});
}
