import { Router } from "express";
import { verifyToken } from "../utils/tokenAuth.js";

const router = Router();

import {
  createSchedule,
  getAllSchedule,
  getSchedule,
  updateSchedule,
  deleteSchedule,
  getCourse,
  getCourseScheduleOne,
  // existingTeacherschedule
  createZoomMeeting,
} from "../controllers/courseScheduleController.js";

router.post("/createSchedule", verifyToken, createSchedule);
router.route("/zoom/meeting").post(verifyToken, createZoomMeeting);
router
  .route("/")
  .get(verifyToken, getAllSchedule)
  .delete(verifyToken, deleteSchedule);
router
  .route("/:id")
  .get(verifyToken, getSchedule)
  .patch(verifyToken, updateSchedule);
router.route("/course/list").get(verifyToken, getCourse);
router.route("/get/schedule").get(verifyToken, getCourseScheduleOne);
router.route("/zoom/meeting").post(verifyToken, createZoomMeeting);
// router.route("/get/validate/list").post(existingTeacherschedule)
export default router;
