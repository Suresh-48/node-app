import { Router } from "express";
import { verifyToken } from "../utils/tokenAuth.js";

const router = Router();
import { adminDashboard, AdminGetBillingDetail } from "../controllers/adminDashboardController.js";

router.route("/").get(verifyToken, adminDashboard);

router.route("/billing/detail").get(verifyToken, AdminGetBillingDetail);
export default router;
