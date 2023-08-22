/**
 * api entry point: reference all endpoint
 */
import { Request, Response, Router } from "express";
import MessageResponse from "../interfaces/MessageResponse";
import usersRouter from "./users/users.routes";
import appSettingsRouter from "./appSettings/appSettings.routes";
import currencyRouter from "./currencies/currencies.routes";
import notificationRouter from "./notifications/notifications.routes";
import securityLogRouter from "./securityLogs/securityLogs.routes";
import beneficiaryRouter from "./beneficiaries/beneficiaries.routes";
import transactionRouter from "./transactions/transactions.routes";
import authRouter from "./auth/auth.routes";
import { verifyToken } from "../common/middlewares";

const apiRouter = Router();

apiRouter.get("/", (req: Request, res: Response<MessageResponse>) => {
	return res.json({
		message: "api - v1",
	});
});

apiRouter.use("/users", verifyToken, usersRouter);
apiRouter.use("/app-settings", verifyToken, appSettingsRouter);
apiRouter.use("/currencies", verifyToken, currencyRouter);
apiRouter.use("/notifications", verifyToken, notificationRouter);
apiRouter.use("/security-logs", verifyToken, securityLogRouter);
apiRouter.use("/beneficiaries", verifyToken, beneficiaryRouter);
apiRouter.use("/transactions", verifyToken, transactionRouter);
apiRouter.use("/auth", authRouter);

export default apiRouter;
