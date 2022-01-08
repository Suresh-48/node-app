import { Router } from "express";
const router = Router();
import {  studentDashboard } from "../controllers/studentDashboardController.js";

router.route("/").get(studentDashboard);
export default router;
