import {Router} from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { role } from "../consts/role";
import ApplicationController from "../controllers/application.controller";

const router = Router();

router.get("/", authMiddleware([role.manager, role.tenant]), ApplicationController.getAll);
router.post("/", authMiddleware([ role.tenant]), ApplicationController.create);
router.put("/:id/status", authMiddleware([role.manager]), ApplicationController.update);

export default router;