import { Router } from "express";
const router = Router();
import { verifyToken } from "../utils/tokenAuth.js";


import { payDetails, getPayDetails, getAllPayDetails } from "../controllers/studentCourseController.js";

router.route("/").post(verifyToken, payDetails);
router.route("/:id").get(verifyToken, getPayDetails);
router.route("/").get(verifyToken, getAllPayDetails);

export default router;
