import { Router } from "express";

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
} from "../controllers/courseScheduleController.js";

router.post("/createSchedule", createSchedule);
router.route("/").get(getAllSchedule).delete(deleteSchedule);
router.route("/:id").get(getSchedule).patch(updateSchedule)

router.route("/course/list").get(getCourse);

router.route("/get/schedule").get(getCourseScheduleOne);



// router.route("/get/validate/list").post(existingTeacherschedule)
export default router;
