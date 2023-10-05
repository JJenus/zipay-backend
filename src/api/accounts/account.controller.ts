import { NextFunction, Request, Response } from "express";
import * as accountService from "./account.service";
import Account, { AccountAttr } from "./account.model";
import { ParamsWithId } from "../../interfaces/ParamsWithId";


export async function findAccount(
	req: Request<ParamsWithId, Partial<Account>, null>,
	res: Response<Partial<Account> | null>,
	next: NextFunction
) {
	try {
		let user: Partial<Account> = await accountService.findUserAccount(req.params.id);

		res.json(user);
	} catch (error) {
		next(error);
	}
}

export async function deleteAccount(
	req: Request<ParamsWithId, Partial<Account>, null>,
	res: Response<Partial<Account>>,
	next: NextFunction
) {}
