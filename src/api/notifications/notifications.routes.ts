import { Router } from "express";
import * as notificationController from "./notifications.controller";
import { validateRequest } from "../../common/middlewares";
import { NotificationAttr } from "./notifications.model";
import { ParamsWithId } from "../../interfaces/ParamsWithId";

const router = Router();

router.get(
	"/:id",
	validateRequest({ params: ParamsWithId }),
	notificationController.findNotificationUserById
);
router.post(
	"/",
	validateRequest({ body: NotificationAttr }),
	notificationController.createNotification
);
router.put(
	"/",
	validateRequest({ body: NotificationAttr }),
	notificationController.updateNotification
);

export default router;
