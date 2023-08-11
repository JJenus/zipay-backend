import { Router } from "express";
import * as securityLogController from "./securityLogs.controller";
import { validateRequest } from "../../common/middlewares";
import { SecurityLogAttr } from "./securityLogs.model";
import { ParamsWithId } from "../../interfaces/ParamsWithId";

const router = Router();

router.get(
	"/:id",
	validateRequest({ params: ParamsWithId }),
	securityLogController.findSecurityLogUserById
);
router.post(
	"/",
	validateRequest({ body: SecurityLogAttr }),
	securityLogController.createSecurityLog
);

export default router;
