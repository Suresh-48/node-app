import { Router } from "express";

const router = Router();

import {
  getParentStudentUpcomingSchedule,
  getStudentUpcomingSchedule,
  getUpcomingScheduleOnCourse,
  getStudentCompletedSchedule,
  getParentStudentCompletedSchedule,
} from "../controllers/upcomingScheduleController.js";

router.route("/student/list").get(getStudentUpcomingSchedule);

router.route("/parent/list").get(getParentStudentUpcomingSchedule);

router.route("/course/list").get(getUpcomingScheduleOnCourse);

router.route("/student/complete/list").get(getStudentCompletedSchedule);

router.route("/parent/complete/list").get(getParentStudentCompletedSchedule);

export default router;
