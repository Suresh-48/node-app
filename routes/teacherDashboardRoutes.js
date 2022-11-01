import { Router } from "express";
import { verifyToken } from "../utils/tokenAuth.js";

const router = Router();
import { teacherDashboard } from "../controllers/teacherDashboardController.js";

router.route("/").get(teacherDashboard);
export default router;
