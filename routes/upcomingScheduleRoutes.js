import { Router } from "express";

const router = Router();

import {
  getParentStudentUpcomingSchedule,
  getStudentUpcomingSchedule,
  getUpcomingScheduleOnCourse,
  getStudentCompletedSchedule,
  getParentStudentCompletedSchedule,
  getStudentUpcomingScheduleOnCalendar,
  updateStudentZoomTimings,
} from "../controllers/upcomingScheduleController.js";
import { verifyToken } from "../utils/tokenAuth.js";

router.route("/student/list").get(getStudentUpcomingSchedule);

router.route("/parent/list").get(getParentStudentUpcomingSchedule);

router.route("/course/list").get(verifyToken, getUpcomingScheduleOnCourse);

router.route("/student/complete/list").get(getStudentCompletedSchedule);

router.route("/parent/complete/list").get(getParentStudentCompletedSchedule);

router.route("/calendar/view").get(verifyToken, getStudentUpcomingScheduleOnCalendar);

router.route("/student/zoom/timing").patch(updateStudentZoomTimings);

export default router;
