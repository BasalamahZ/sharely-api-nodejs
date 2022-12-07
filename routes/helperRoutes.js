import * as helperController from "../controllers/helper.js";
import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.post("/helper", verifyToken, helperController.createHelper);
router.get("/helper", verifyToken, helperController.getHelper);
router.get(
  "/event/helper/:helperId",
  verifyToken,
  helperController.getEventByIdHelper
);

export default router;
