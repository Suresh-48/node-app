import { Router } from "express";
import { verifyToken } from "../utils/tokenAuth.js";

const router = Router();
import { parentDashboard } from "../controllers/parentDashboardController.js";

router.route("/").get(verifyToken, parentDashboard);

export default router;
