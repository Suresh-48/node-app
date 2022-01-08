import { Router } from "express";
const router = Router();
import { adminDashboard, AdminGetBillingDetail } from "../controllers/adminDashboardController.js";

router.route("/").get(adminDashboard);

router.route("/billing/detail").get(AdminGetBillingDetail)
export default router;
