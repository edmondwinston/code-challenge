import "dotenv/config";

import express from "express";
import { configureServer } from "./core";

const app = express();
configureServer(app);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log(`Server is up on PORT ${PORT}`);
});
