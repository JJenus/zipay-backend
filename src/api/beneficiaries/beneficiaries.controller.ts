import { NextFunction, Request, Response } from "express";
import * as Beneficiaries from "./beneficiaries.service";
import Beneficiary, { BeneficiaryAttr } from "./beneficiaries.model";
import { ParamsWithId } from "../../interfaces/ParamsWithId";

export const findUserBeneficiaries = async (
	req: Request<ParamsWithId>,
	res: Response<Beneficiary[]>,
	next: NextFunction
) => {
	try {
		const beneficiaries = await Beneficiaries.findUserBeneficiaries(req.params.id);
		res.json(beneficiaries);
	} catch (error) {
		next(error);
	}
};

export const createBeneficiary = async (
	req: Request<{}, Beneficiary, BeneficiaryAttr>,
	res: Response<Beneficiary>,
	next: NextFunction
) => {
	try {
		const log = await Beneficiaries.createBeneficiary(req.body);
		res.json(log);
	} catch (error) {
		next(error);
	}
};
