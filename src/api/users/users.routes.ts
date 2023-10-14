import { Router } from "express";
import * as userController from "./users.controller";
import { validateRequest } from "../../common/middlewares";
import { UserAttributes, UserUpdateAttributes } from "../users/users.model";
import { ParamsWithId } from "../../interfaces/ParamsWithId";

const router = Router();

// router.post(
// 	"/",
// 	validateRequest({ body: UserAttributes }),
// 	userController.createUser
// );
router.get("/", userController.findAll);
router.put(
	"/:id",
	validateRequest({ params: ParamsWithId, body: UserUpdateAttributes }),
	userController.updateUser
);

router.get(
	"/:id",
	validateRequest({ params: ParamsWithId }),
	userController.findUser
);

router.post(
	"/find",
	validateRequest({ body: UserUpdateAttributes }),
	userController.findUserByEmail
);

router.delete(
	"/:id",
	validateRequest({ params: ParamsWithId }),
	userController.deleteUser
);

export default router;
