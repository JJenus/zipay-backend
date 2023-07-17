import { NextFunction, Request, Response } from "express";
import { HTTPStatusCode } from "./HTTPStatusCode";
import ErrorResponse from "../interfaces/ErrorResponse";

export function notFound(req: Request, res: Response, next: NextFunction) {
	res.status(HTTPStatusCode.NOT_FOUND);
	const error = new Error(`Not found - ${req.originalUrl}"`);
	next(error);
}

export function errorHandler(
	error: Error,
	req: Request,
	res: Response<ErrorResponse>,
	next: NextFunction
) {
	const statusCode =
		res.statusCode !== 200
			? res.statusCode
			: HTTPStatusCode.INTERNAL_SERVER_ERROR;
	res.status(statusCode);

	res.json({
		message: error.message,
		stack:
			process.env.NODE_ENV === "production"
				? "Contact support if you're seeing this."
				: error.stack,
	});
}
