import { Router } from "express";
import * as settingsController from "./appSettings.controller";
import { validateRequest } from "../../common/middlewares";
import { appSettings } from "./appSettings.model";

const router = Router();

router.get("/", settingsController.getAppSettings);
router.post(
	"/",
	validateRequest({ body: appSettings }),
	settingsController.createSettings
);
router.put(
	"/",
	validateRequest({ body: appSettings }),
	settingsController.updateSettings
);

export default router;