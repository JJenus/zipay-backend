import { Router } from "express";
import * as securityLogController from "./transactions.controller";
import { validateRequest } from "../../common/middlewares";
import { TransactionAttr } from "./transactions.model";
import { ParamsWithId } from "../../interfaces/ParamsWithId";

const router = Router();

router.get(
	"/:id",
	validateRequest({ params: ParamsWithId }),
	securityLogController.findUserTransactions
);
router.post(
	"/",
	validateRequest({ body: TransactionAttr }),
	securityLogController.createTransaction
);

export default router;
