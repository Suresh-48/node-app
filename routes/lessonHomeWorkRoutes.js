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
  getLessonHomeworkDetail,
  getLessonHomeworkList,
} from "../controllers/lessonHomeWorkController.js";
import { verifyToken } from "../utils/tokenAuth.js";


router.route("/").post(verifyToken, createHomework);

router.route("/add").post(verifyToken, addHomeworkToCourseLesson);

router.route("/list").get(verifyToken, getLessonHomeworkList);

router.route("/lesson/update/").patch(verifyToken, updateHomeworkToCourseLesson);

router.route("/getLesson/").get(verifyToken, getHomeworkCourseLesson);

router.route("/").get(verifyToken, getAllHomework);

router.route("/lesson/detail").get(verifyToken, getLessonHomeworkDetail);

router
  .route("/:id")
  .get(verifyToken, getHomework)
  .patch(verifyToken, updateHomework)
  .delete(verifyToken, deleteHomework);

export default router;
