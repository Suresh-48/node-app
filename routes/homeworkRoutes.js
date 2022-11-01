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
  getLessonQuizDetail,
} from "../controllers/homeworkController.js";
import { verifyToken } from "../utils/tokenAuth.js";


router.route("/").post(verifyToken, createHomework);

router.route("/add").post(verifyToken, addHomeworkToCourseLesson);

router.route("/lesson/update/").patch(verifyToken, updateHomeworkToCourseLesson);

router.route("/getLesson/").get(verifyToken, getHomeworkCourseLesson);

router.route("/").get(verifyToken, getAllHomework);

router.route("/lesson/detail").get(verifyToken, getLessonQuizDetail);

router
  .route("/:id")
  .get(verifyToken, getHomework)
  .patch(verifyToken, updateHomework)
  .delete(verifyToken, deleteHomework);

export default router;
