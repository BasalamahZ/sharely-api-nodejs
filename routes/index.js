import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import * as authController from "../controllers/auth.js";

const router = Router();
router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.get("/user", verifyToken, authController.getUsers);

export default router;
