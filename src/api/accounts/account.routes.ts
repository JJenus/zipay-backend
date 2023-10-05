import { Router } from "express";
import * as accountController from "./account.controller";
import { validateRequest } from "../../common/middlewares";
import { ParamsWithId } from "../../interfaces/ParamsWithId";

const router = Router();

router.get(
	"/:id",
	validateRequest({ params: ParamsWithId }),
	accountController.findAccount
);



// router.delete(
// 	"/:id",
// 	validateRequest({ params: ParamsWithId }),
// 	accountController.deleteAccount
// );

export default router;
