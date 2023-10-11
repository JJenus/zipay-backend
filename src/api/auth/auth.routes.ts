import { Router } from "express";
import { loginUser, registerUser, resetPassword, verifyEmail } from "./auth.controller";
import { validateRequest } from "../../common/middlewares";
import { UserAttributes, UserUpdateAttributes } from "../users/users.model";
import { Login } from "./auth.model";

const authRouter = Router();

authRouter.post(
	"/register",
	validateRequest({ body: UserAttributes }),
	registerUser
);
authRouter.post("/login", validateRequest({body: Login}), loginUser);
authRouter.post("/verify-email",validateRequest({body: UserUpdateAttributes}) , verifyEmail);
authRouter.post("/reset-password", validateRequest({body: UserUpdateAttributes}), resetPassword);

export default authRouter;
