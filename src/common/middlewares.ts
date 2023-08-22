import { NextFunction, Request, Response } from "express";
import { HTTPStatusCode } from "./HTTPStatusCode";
import ErrorResponse from "../interfaces/ErrorResponse";
import { ZodError } from "zod";
import RequestValidators from "../interfaces/RequestValidator";
import jwt from "jsonwebtoken";
import { JwtSignToken } from "./appUtil";

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

	const response: ErrorResponse = {
		message: error.message,
		stack:
			process.env.NODE_ENV === "production"
				? "Contact support if you're seeing this."
				: error.stack,
	};

	if (error instanceof ZodError) {
		if (error.errors[0].message.toLocaleLowerCase().includes("required")) {
			response.message = `${
				error.errors[0].path[0]
			} ${error.errors[0].message.toLocaleLowerCase()}`;
			res.status(HTTPStatusCode.BAD_REQUEST);
		} else response.message = error.errors[0].message;
	}

	res.json(response);
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
				// console.log(error.errors[0]);
			}
			next(error);
		}
	};
}

// Middleware to verify JWT
export const verifyToken = (req: any, res: any, next: any) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		res.status(HTTPStatusCode.AUTHORIZATION_ERROR);
		next(new Error("Access denied"));
	} else {
		try {
			const payload = jwt.verify(token, JwtSignToken);
			console.log(payload);
			next();
		} catch (error) {
			if (error instanceof Error) {
				error.message = "Invalid token";
			}
			res.status(HTTPStatusCode.BAD_REQUEST);
			next(error);
		}
	}
};
