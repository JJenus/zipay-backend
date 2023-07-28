import { NextFunction, Request, Response } from "express";
import * as userService from "./users.service";
import User, { UserAttributes } from "./users.model";

export async function createUser(
	req: Request<{}, Partial<User>, UserAttributes>,
	res: Response<Partial<User>>,
	next: NextFunction
) {
	try {
		const user = await userService.createUser(req.body);
		res.json(user);
	} catch (error) {
		next(error);
	}
}

export async function updateUser(
	req: Request,
	res: Response,
	next: NextFunction
) {}

export async function findUser(
	req: Request,
	res: Response,
	next: NextFunction
) {}

export async function findAll(
	req: Request,
	res: Response,
	next: NextFunction
) {}

export async function deleteUser(
	req: Request,
	res: Response,
	next: NextFunction
) {}
