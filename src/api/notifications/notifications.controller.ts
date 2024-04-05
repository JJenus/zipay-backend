import { NextFunction, Request, Response } from "express";
import * as Notifications from "./notifications.service";
import Notification, { NotificationAttr } from "./notifications.model";
import { ParamsWithId } from "../../interfaces/ParamsWithId";
import { NotificationStatus } from "./notifications";

export const findNotificationUserById = async (
	req: Request<ParamsWithId>,
	res: Response<Notification[]>,
	next: NextFunction
) => {
	try {
		const notifications = await Notifications.findNotificationUserById(
			req.params.id
		);
		res.json(notifications);
	} catch (error) {
		next(error);
	}
};

export const createNotification = async (
	req: Request<{}, Notification, NotificationAttr>,
	res: Response<Notification>,
	next: NextFunction
) => {
	try {
		const notifications = await Notifications.createNotification(req.body);
		res.json(notifications);
	} catch (error) {
		next(error);
	}
};

export const updateNotification = async (
	req: Request<ParamsWithId, NotificationAttr, Notification>,
	res: Response<Notification>,
	next: NextFunction
) => {
	try {
		const settings = await Notifications.updateNotification(
			req.params.id,
			req.body.status
		);
		res.json(settings);
	} catch (error) {
		next(error);
	}
};

export const updateAllNotification = async (
	req: Request<{}, NotificationAttr[], Notification[]>,
	res: Response<Notification[]>,
	next: NextFunction
) => {
	try {
		let notifications: Notification[] = [];
		req.body.forEach(async (e) => {
			let notif: Notification = e;
			if (e.status === NotificationStatus.UNREAD)
				notif = await Notifications.updateNotification(e.id, NotificationStatus.READ);
			notifications.push(notif);
		});
		res.json(notifications);
	} catch (error) {
		next(error);
	}
};
