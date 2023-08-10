import { Router } from "express";
import * as currencyController from "./currencies.controller";
import { validateRequest } from "../../common/middlewares";
import { CurrencyAttr } from "./currencies.model";
import { ParamsWithId } from "../../interfaces/ParamsWithId";

const router = Router();

router.get("/", currencyController.findAll);
router.get(
	"/:id",
	validateRequest({ params: ParamsWithId }),
	currencyController.findCurrencyById
);
router.post(
	"/",
	validateRequest({ body: CurrencyAttr }),
	currencyController.createCurrency
);
router.put(
	"/",
	validateRequest({ body: CurrencyAttr }),
	currencyController.updateCurrency
);

export default router;
