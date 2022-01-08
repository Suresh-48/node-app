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
} from "../controllers/quizController.js";

router.route("/").post(createQuiz);

router.route("/add").post(addQuizToCourseLesson);

router.route("/lesson/update/").patch(updateQuizToCourseLesson);

router.route("/getLesson/").get(getQuizCourseLesson);

router.route("/").get(getAllQuiz);

router.route("/:id").get(getQuiz).patch(updateQuiz).delete(deleteQuiz);

export default router;
