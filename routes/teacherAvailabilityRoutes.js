import { Router } from "express";

const router = Router();

import {
  createTeacherAvailability,
  updateTeacherAvailability,
  getAllTeacherAvailability,
  getTeacherAvailability,
  deleteTeacherAvailability,
  TeacherAvailabilityList,
} from "../controllers/teacherAvailabilityController.js";
import { verifyToken } from "../utils/tokenAuth.js";

router.route("/").post(verifyToken, createTeacherAvailability);

router.route("/").get(verifyToken, getAllTeacherAvailability);

router.route("/list").get(verifyToken, TeacherAvailabilityList);

router
  .route("/:id")
  .get(verifyToken, getTeacherAvailability)
  .patch(verifyToken, updateTeacherAvailability)
  .delete(verifyToken, deleteTeacherAvailability);

export default router;
