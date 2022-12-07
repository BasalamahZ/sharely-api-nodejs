import * as eventController from "../controllers/event.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { Router } from "express";

const router = Router();

router.post("/event", verifyToken, eventController.createEvent);
router.put("/subs/:userId", verifyToken, eventController.subsFirebase);
router.get("/event", verifyToken, eventController.getEvent);
router.get("/event/:userId", verifyToken, eventController.getEventById);
router.get(
  "/event/helper/:helperId",
  verifyToken,
  eventController.getEventByIdHelper
);
router.put("/event/:eventId", verifyToken, eventController.finishedEvent);
router.put("/event/cancel/:eventId", verifyToken, eventController.cancelEvent);

export default router;
