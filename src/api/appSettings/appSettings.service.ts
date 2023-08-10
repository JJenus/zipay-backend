import { Op } from "sequelize";
import AppSettings, { appSettings } from "./appSettings.model";

export const getAppSettings = async (): Promise<AppSettings> => {
	try {
		let result = await AppSettings.findOne({
			where: {
				id: {
					[Op.not]: "null",
				},
			},
		});
		if (!result) {
			result = await saveSettings({
				defaultBaseCurrency: "USD",
				defaultLanguage: "en",
			});
		}
		return result;
	} catch (error) {
		throw new Error("Unable to get settings");
	}
};

export const saveSettings = async (
	setting: appSettings
): Promise<AppSettings> => {
	try {
		const result = await AppSettings.create(setting);

		return result;
	} catch (error) {
		throw new Error("Unable to save settings");
	}
};

export const updateSettings = async (
    id: string,
	settingUpdate: AppSettings
): Promise<AppSettings> => {
	let setting;
	try {
		setting = await AppSettings.findByPk(id);

		if (!setting) {
			throw new Error();
		}
	} catch (error) {
		throw new Error("Unauthorized settings update");
	}

	try {
		setting.setAttributes(settingUpdate);
		await setting.save();

		return setting;
	} catch (error) {
		throw new Error("Unable to save settings");
	}
};
