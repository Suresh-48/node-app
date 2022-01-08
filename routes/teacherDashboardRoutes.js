import { Router } from "express";
const router = Router();
import { teacherDashboard } from "../controllers/teacherDashboardController.js";

router.route("/").get(teacherDashboard);
export default router;
