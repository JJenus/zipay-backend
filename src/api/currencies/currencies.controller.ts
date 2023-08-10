import { NextFunction, Request, Response } from "express";
import * as Currencies from "./currencies.service";
import Currency, { CurrencyAttr } from "./currencies.model";
import { ParamsWithId } from "../../interfaces/ParamsWithId";

export const findAll = async (
	req: Request,
	res: Response<Currency[]>,
	next: NextFunction
) => {
	try {
		const settings = await Currencies.findAll();
		res.json(settings);
	} catch (error) {
		next(error);
	}
};

export const findCurrencyById = async (
	req: Request<ParamsWithId>,
	res: Response<Currency>,
	next: NextFunction
) => {
	try {
		const settings = await Currencies.findCurrencyById(req.params.id);
		res.json(settings);
	} catch (error) {
		next(error);
	}
};

export const createCurrency = async (
	req: Request<{}, Currency, CurrencyAttr>,
	res: Response<Currency>,
	next: NextFunction
) => {
	try {
		const settings = await Currencies.createCurrency(req.body);
		res.json(settings);
	} catch (error) {
		next(error);
	}
};

export const updateCurrency = async (
	req: Request<ParamsWithId, CurrencyAttr, Currency>,
	res: Response<Currency>,
	next: NextFunction
) => {
	try {
		const settings = await Currencies.updateCurrency(
			req.params.id,
			req.body
		);
		res.json(settings);
	} catch (error) {
		next(error);
	}
};
