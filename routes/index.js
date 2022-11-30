import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import * as authController from "../controllers/auth.js";
import * as userController from "../controllers/user.js";

const router = Router();
router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.get("/user", verifyToken, authController.getUsers);
router.post("/image", userController.image )
export default router;