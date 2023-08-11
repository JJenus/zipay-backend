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

const apiRouter = Router();

apiRouter.get("/", (req: Request, res: Response<MessageResponse>) => {
	return res.json({
		message: "api - v1",
	});
});

apiRouter.use("/users", usersRouter);
apiRouter.use("/app-settings", appSettingsRouter);
apiRouter.use("/currencies", currencyRouter);
apiRouter.use("/notifications", notificationRouter);
apiRouter.use("/security-logs", securityLogRouter)

export default apiRouter;
