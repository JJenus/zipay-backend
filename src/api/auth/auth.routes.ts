import { Router } from "express";
import { loginUser, registerUser } from "./auth.controller";
import { validateRequest } from "../../common/middlewares";
import { UserAttributes } from "../users/users.model";
import { Login } from "./auth.model";

const authRouter = Router();

authRouter.post(
	"/register",
	validateRequest({ body: UserAttributes }),
	registerUser
);
authRouter.post("/login", validateRequest({body: Login}), loginUser);
// authRouter.post("/verify-email", verifyEmail);
// authRouter.post("/reset-password", resetPassword);

export default authRouter;
