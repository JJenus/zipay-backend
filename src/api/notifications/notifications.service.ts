import { NotificationStatus } from "./notifications";
import Notification, { NotificationAttr } from "./notifications.model";

export const findNotificationUserById = async (
	id: string
): Promise<Notification[]> => {
	try {
		let result = await Notification.findAll({
			where: {
				userId: id,
			},
		});
		if (!result) {
			throw new Error("");
		}
		return result;
	} catch (error) {
		throw new Error("Unable to fetch notifications");
	}
};

export const createNotification = async (
	notification: NotificationAttr
): Promise<Notification> => {
	try {
		const result = await Notification.create(notification);

		return result;
	} catch (error) {
		throw new Error("Unable to create notification");
	}
};

export const updateNotification = async (
	id: string,
	status: NotificationStatus
): Promise<Notification> => {
	let notification;
	try {
		notification = await Notification.findByPk(id);

		if (!notification) {
			throw new Error();
		}
	} catch (error) {
		throw new Error("Notification not found");
	}

	try {
		notification.setDataValue("status", status);
		await notification.save();

		return notification;
	} catch (error) {
		throw new Error("Unable to update notification");
	}
};
