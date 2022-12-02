import * as helperController from "../controllers/helper.js"
import { Router } from "express"

const router = Router();

router.post("/helper", helperController.createHelper)
router.get("/helper", helperController.getHelper)

export default router;