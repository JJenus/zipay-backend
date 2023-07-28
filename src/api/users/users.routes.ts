import { Router } from "express";
import * as userController from "./users.controller";

const router = Router();

router.post("/user", userController.createUser);

export default router;
