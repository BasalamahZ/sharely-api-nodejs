import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import * as authController from "../controllers/auth.js";
import {
  validateRegisterEmail,
  validateLoginEmail,
  validatePassword,
  validatePhoneNumber,
} from "../middlewares/validation.js";

const router = Router();
router.post(
  "/signup",
  [validateRegisterEmail, validatePassword, validatePhoneNumber],
  authController.signup
);
router.post(
  "/signin",
  [validateLoginEmail, validatePassword],
  authController.signin
);
router.get("/user", verifyToken, authController.getUsers);
router.put("/image/:id", verifyToken, authController.image);

export default router;
