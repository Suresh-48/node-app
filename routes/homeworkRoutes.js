import { Router } from "express";

const router = Router();

import {
  createHomework,
  deleteHomework,
  getAllHomework,
  getHomework,
  updateHomework,
  addHomeworkToCourseLesson,
  updateHomeworkToCourseLesson,
  getHomeworkCourseLesson,
} from "../controllers/homeworkController.js";

router.route("/").post(createHomework);

router.route("/add").post(addHomeworkToCourseLesson);

router.route("/lesson/update/").patch(updateHomeworkToCourseLesson);

router.route("/getLesson/").get(getHomeworkCourseLesson);

router.route("/").get(getAllHomework);

router.route("/:id").get(getHomework).patch(updateHomework).delete(deleteHomework);

export default router;
