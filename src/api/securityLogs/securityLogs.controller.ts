import { NextFunction, Request, Response } from "express";
import * as SecurityLogs from "./securityLogs.service";
import SecurityLog, { SecurityLogAttr } from "./securityLogs.model";
import { ParamsWithId } from "../../interfaces/ParamsWithId";

export const findSecurityLogUserById = async (
	req: Request<ParamsWithId>,
	res: Response<SecurityLog[]>,
	next: NextFunction
) => {
	try {
		const logs = await SecurityLogs.findUserSecurityLogs(
			req.params.id
		);
		res.json(logs);
	} catch (error) {
		next(error);
	}
};

export const createSecurityLog = async (
	req: Request<{}, SecurityLog, SecurityLogAttr>,
	res: Response<SecurityLog>,
	next: NextFunction
) => {
	try {
		const log = await SecurityLogs.createSecurityLog(req.body);
		res.json(log);
	} catch (error) {
		next(error);
	}
};