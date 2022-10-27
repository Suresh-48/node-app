import { Router } from "express";

const router = Router();

import {
  getAllTeacherUpcomingSchedule,
  getTeacherUpcomingSchedule,
  updateTeacherInList,
  teacherUpcomingList,
  getTeacherCompletedSchedule,
  getTeacherUpcomingScheduleBasedonSchedule,
  getTeacherCompletedScheduleBasedonSchedule,
  updateTeacherZoomTimings,
} from "../controllers/teacherUpcomingScheduleController.js";
import { verifyToken } from "../utils/tokenAuth.js";

router
  .route("/")
  .post(verifyToken, teacherUpcomingList)
  .get(getAllTeacherUpcomingSchedule);
router.route("/upcoming").get(getTeacherUpcomingSchedule);
router.route("/completed").get(getTeacherCompletedSchedule);
router.route("/schedule/upcoming/list").get(verifyToken, getTeacherUpcomingScheduleBasedonSchedule);
router.route("/schedule/completed/list").get(verifyToken, getTeacherCompletedScheduleBasedonSchedule);
router.route("/update/teacher").post(updateTeacherInList);
router.route("/zoom/timing").patch(updateTeacherZoomTimings);

export default router;
