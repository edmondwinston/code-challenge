import type {Request, Response} from "express";

export function accountInfo(req: Request, res: Response) {
	// `req.user` is populated by the `passport.authenticate("local")` middleware
	// in `account.controller.js`. In other words, if you have logged in successfully,
	// this `req.user` will always be available.
	return res.status(200).json({message: "Hi there!", user: req.user});
}
