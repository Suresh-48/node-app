import { Router } from "express";
const router = Router();

import { payDetails, getPayDetails, getAllPayDetails } from "../controllers/studentCourseController.js";

router.route("/").post(payDetails);
router.route("/:id").get(getPayDetails);
router.route("/").get(getAllPayDetails);

export default router;
