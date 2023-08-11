import { Router } from "express";
import * as securityLogController from "./beneficiaries.controller";
import { validateRequest } from "../../common/middlewares";
import { BeneficiaryAttr } from "./beneficiaries.model";
import { ParamsWithId } from "../../interfaces/ParamsWithId";

const router = Router();

router.get(
	"/:id",
	validateRequest({ params: ParamsWithId }),
	securityLogController.findUserBeneficiaries
);
router.post(
	"/",
	validateRequest({ body: BeneficiaryAttr }),
	securityLogController.createBeneficiary
);

export default router;
