import { SecurityLogAction } from "./securityLogs";
import SecurityLog, { SecurityLogAttr } from "./securityLogs.model";

export const findUserSecurityLogs = async (
	id: string
): Promise<SecurityLog[]> => {
	try {
		let result = await SecurityLog.findAll({
			where: {
				userId: id,
			},
		});
		if (!result) {
			throw new Error("");
		}
		return result;
	} catch (error) {
		throw new Error("Unable to fetch logs");
	}
};

export const createSecurityLog = async (
	notification: SecurityLogAttr
): Promise<SecurityLog> => {
	try {
		const result = await SecurityLog.create(notification);

		return result;
	} catch (error) {
		throw new Error("Unable to create notification");
	}
};

