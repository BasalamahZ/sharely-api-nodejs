import * as eventController from "../controllers/event.js"
import { verifyToken } from "../middlewares/verifyToken.js";
import { Router } from "express"

const router = Router();

router.post("/event", eventController.createEvent)
router.get("/event", verifyToken, eventController.getEvent)
router.get("/event/:userId", eventController.getEventById)
router.put("/event/:eventId", eventController.finishedEvent)
router.put("/event/cancel/:eventId", eventController.cancelEvent)

export default router;