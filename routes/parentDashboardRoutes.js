import { Router } from "express";
const router = Router();
import { parentDashboard } from "../controllers/parentDashboardController.js";

router.route("/").get(parentDashboard);

export default router;
