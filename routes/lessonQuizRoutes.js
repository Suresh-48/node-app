import { Router } from "express";

const router = Router();

import {
  createQuiz,
  deleteQuiz,
  getAllQuiz,
  getQuiz,
  updateQuiz,
  addQuizToCourseLesson,
  updateQuizToCourseLesson,
  getQuizCourseLesson,
  getLessonQuizDetail,
  getLessonQuizList,
} from "../controllers/lessonQuizController.js";
import { verifyToken } from "../utils/tokenAuth.js";

router.route("/").post(verifyToken, createQuiz);

router.route("/add").post(verifyToken, addQuizToCourseLesson);

router.route("/list").get(verifyToken, getLessonQuizList);

router.route("/lesson/update/").patch(verifyToken, updateQuizToCourseLesson);

router.route("/getLesson/").get(verifyToken, getQuizCourseLesson);

router.route("/").get(verifyToken, getAllQuiz);

router.route("/lesson/detail").get(verifyToken, getLessonQuizDetail);

router
  .route("/:id")
  .get(verifyToken, getQuiz)
  .patch(verifyToken, updateQuiz)
  .delete(verifyToken, deleteQuiz);

export default router;
