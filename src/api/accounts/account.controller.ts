import { NextFunction, Request, Response } from "express";
import * as accountService from "./account.service";
import * as Users from "../users/users.service";

import Account, {
	AccountAttr,
	updateBalance as Balance,
} from "./account.model";
import { ParamsWithId } from "../../interfaces/ParamsWithId";
import User from "../users/users.model";

export async function findAccount(
	req: Request<ParamsWithId, Partial<Account>, null>,
	res: Response<Partial<Account> | null>,
	next: NextFunction
) {
	try {
		let user: Partial<Account> = await accountService.findUserAccount(
			req.params.id
		);

		res.json(user);
	} catch (error) {
		next(error);
	}
}

export async function updateBalance(
	req: Request<{}, Partial<Balance>, Balance>,
	res: Response<Account>,
	next: NextFunction
) {
	try {
		const user: User = await Users.findUserByEmail(req.body.email);
		const account: Account = await accountService.findUserAccount(user.id);

		account.amount = account.amount | 0;
		const balance = req.body.amount;

		account.set("amount", balance + account.amount);

		await account.save();

		res.json(account);
	} catch (error) {
		next(error);
	}
}

export async function deleteAccount(
	req: Request<ParamsWithId, Partial<Account>, null>,
	res: Response<Partial<Account>>,
	next: NextFunction
) {}
