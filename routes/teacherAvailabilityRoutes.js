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

router.route("/").post(createTeacherAvailability);

router.route("/").get(getAllTeacherAvailability);

router.route("/list").get(TeacherAvailabilityList);

router
  .route("/:id")
  .get(getTeacherAvailability)
  .patch(updateTeacherAvailability)
  .delete(deleteTeacherAvailability);

export default router;
