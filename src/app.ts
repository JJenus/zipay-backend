import express, { Request, Response } from "express";
import winston from "winston";
import expressWinston from "express-winston";
import cors from "cors";
import helmet from "helmet";
import MessageResponse from "./interfaces/MessageResponse";
import * as middlewares from "./common/middlewares";

import api from "./api";

require("dotenv").config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

const loggerOptions: expressWinston.LoggerOptions = {
	transports: [new winston.transports.Console()],
	format: winston.format.combine(
		winston.format.json(),
		winston.format.prettyPrint(),
		winston.format.colorize({ all: true })
	),
};

if (!process.env.DEBUG) {
	loggerOptions.meta = false; // when not debugging, make terse
}
app.use(expressWinston.logger(loggerOptions));

app.get("/", (req: Request, res: Response<MessageResponse>) => {
	res.json({
		message: "Welcome to statsset api",
	});
});

app.use("/api", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
