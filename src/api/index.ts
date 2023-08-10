import { Request, Response, Router } from "express";
import MessageResponse from "../interfaces/MessageResponse";
import usersRouter from "./users/users.routes";
import appSettingsRouter from "./appSettings/appSettings.routes";

const apiRouter = Router();

apiRouter.get("/", (req: Request, res: Response<MessageResponse>) => {
	return res.json({
		message: "api - v1",
	});
});

apiRouter.use("/users", usersRouter);
apiRouter.use("/app-settings", appSettingsRouter);

export default apiRouter;
