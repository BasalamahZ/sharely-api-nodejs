import * as eventController from "../controllers/event.js"
import { Router } from "express"

const router = Router();

router.post("/event", eventController.createEvent)
router.get("/event", eventController.getEvent)
router.get("/event/:id", eventController.getEventById)
router.put("/event/:id", eventController.finishedEvent)
router.delete("/event/:id", eventController.cancelEvent)

export default router;