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
} from "../controllers/teacherUpcomingScheduleController.js";

router.route("/").post(teacherUpcomingList).get(getAllTeacherUpcomingSchedule);
router.route("/upcoming").get(getTeacherUpcomingSchedule);
router.route("/completed").get(getTeacherCompletedSchedule);
router
  .route("/schedule/upcoming/list")
  .get(getTeacherUpcomingScheduleBasedonSchedule);
router
  .route("/schedule/completed/list")
  .get(getTeacherCompletedScheduleBasedonSchedule);
router.route("/update/teacher").post(updateTeacherInList);

export default router;
