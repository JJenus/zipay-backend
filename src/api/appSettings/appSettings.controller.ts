import { NextFunction, Request, Response } from "express";
import * as Settings from "./appSettings.service";
import AppSettings from "./appSettings.model";
import { ParamsWithId } from "../../interfaces/ParamsWithId";

export const createSettings = async (
	req: Request<{}, AppSettings, AppSettings>,
	res: Response<AppSettings>,
	next: NextFunction
) => {
	try {
		const settings = await Settings.saveSettings(req.body);
        res.json(settings)
	} catch (error) {
		next(error);
	}
};

export const getAppSettings = async (
	req: Request,
	res: Response<AppSettings>,
	next: NextFunction
) => {
	try {
		const settings = await Settings.getAppSettings();
        res.json(settings)
	} catch (error) {
		next(error);
	}
};


export const updateSettings = async (
	req: Request<ParamsWithId, AppSettings, AppSettings>,
	res: Response<AppSettings>,
	next: NextFunction
) => {
	try {
		const settings = await Settings.updateSettings(req.params.id, req.body);
        res.json(settings)
	} catch (error) {
		next(error);
	}
};