import { NextFunction, Request, Response } from "express";
import * as userService from "./users.service";
import User, { UserAttributes, UserUpdateAttributes } from "./users.model";
import { ParamsWithId } from "../../interfaces/ParamsWithId";
import * as Accounts from "../accounts/account.service";

export async function createUser(
	req: Request<{}, Partial<User>, UserAttributes>,
	res: Response<Partial<User>>,
	next: NextFunction
) {
	try {
		const user = await userService.createUser(req.body);
		res.json(user);
	} catch (error) {
		console.log(error);
		next(error);
	}
}

export async function updateUser(
	req: Request<ParamsWithId, Partial<User>, UserAttributes>,
	res: Response<Partial<User>>,
	next: NextFunction
) {
	try {
		const user = await userService.updateUser(req.params.id, req.body);
		res.json(user);
	} catch (error) {
		next(error);
	}
}

export async function findAll(
	req: Request,
	res: Response<Partial<UserUpdateAttributes[]>>,
	next: NextFunction
) {
	try {
		const userAll = await userService.findAll();
		const users: UserUpdateAttributes[] = [];

		const userBalances = userAll.map(async (user) => {
			// console.log(transaction.beneficiaryId);
			const newUser: UserUpdateAttributes = user.toJSON();

			const account = await Accounts.findUserAccount(user.id);
			newUser.account = account;
			users.push(newUser);
		});
		await Promise.all(userBalances);

		res.json(users);
	} catch (error) {
		next(error);
	}
}

export async function findUser(
	req: Request<ParamsWithId, Partial<User>, null>,
	res: Response<Partial<User> | null>,
	next: NextFunction
) {
	try {
		let user: Partial<User> = await userService.findUserById(req.params.id);

		res.json(user);
	} catch (error) {
		next(error);
	}
}

export async function findUserByEmail(
	req: Request<{}, Partial<User>, UserUpdateAttributes>,
	res: Response<Partial<User>>,
	next: NextFunction
) {
	try {
		if (!req.body.email) {
			throw new Error("Invalid email");
		}

		let user: Partial<User> = await userService.findUserByEmail(
			req.body.email
		);
		res.json(user);
	} catch (error) {
		next(error);
	}
}

export async function deleteUser(
	req: Request<ParamsWithId, Partial<User>, null>,
	res: Response<Partial<User>>,
	next: NextFunction
) {}
