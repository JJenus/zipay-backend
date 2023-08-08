import { NextFunction, Request, Response } from "express";
import { HTTPStatusCode } from "./HTTPStatusCode";
import ErrorResponse from "../interfaces/ErrorResponse";
import { ZodError } from "zod";
import RequestValidators from "../interfaces/RequestValidator";

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
		res.statusCode !== HTTPStatusCode.OK
			? res.statusCode
			: HTTPStatusCode.INTERNAL_SERVER_ERROR;

	res.status(statusCode);

	if (error.message.toLocaleLowerCase().includes("not found")) {
		res.status(HTTPStatusCode.NOT_FOUND);
	}

	res.json({
		message: error.message,
		stack:
			process.env.NODE_ENV === "production"
				? "Contact support if you're seeing this."
				: error.stack,
	});
}

export function validateRequest(validators: RequestValidators) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			if (validators.body) {
				req.body = await validators.body?.parseAsync(req.body);
			}
			if (validators.params) {
				req.params = await validators.params?.parseAsync(req.params);
			}
			if (validators.query) {
				req.query = await validators.query?.parseAsync(req.query);
			}
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				res.status(HTTPStatusCode.VALIDATION_ERROR);
			}
			next(error);
		}
	};
}
