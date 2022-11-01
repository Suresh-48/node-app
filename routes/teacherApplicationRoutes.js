import { Router } from "express";

const router = Router();

import {
  createTeacherApplication,
  deleteTeacherApplication,
  getAllTeacherApplication,
  getTeacherApplication,
  updateTeacherApplication,
  UpdateTeacherApplicationStatus,
} from "../controllers/teacherApplicationController.js";
import { verifyToken } from "../utils/tokenAuth.js";

router
  .route("/")
  .post(verifyToken, createTeacherApplication)
  .get(verifyToken, getAllTeacherApplication);

router
  .route("/:id")
  .get(getTeacherApplication)
  .patch(verifyToken, updateTeacherApplication)
  .delete(verifyToken, deleteTeacherApplication);

router.route("/status/:id").patch(verifyToken, UpdateTeacherApplicationStatus);

export default router;
