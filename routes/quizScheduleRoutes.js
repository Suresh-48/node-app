import { Router } from "express";

const router = Router();

import {
  createQuizSchedule,
  deleteQuizSchedule,
  getAllQuizSchedule,
  getDetailOfSchedule,
  getQuizSchedule,
  getStudentQuizList,
  updateQuizSchedule,
  updateStudentAnswer,
  onReviewQuizList,
  completedQuizReviewList,
  updateMark,
  getStudentCompletedQuizResult,
  studentQuizStatusPending,
  studentQuizStatusCompleted,
  studentQuizStatusReviewed,
} from "../controllers/quizScheduleController.js";

router.route("/").post(createQuizSchedule);

router.route("/").get(getAllQuizSchedule);

router.route("/:id").get(getQuizSchedule).patch(updateQuizSchedule).delete(deleteQuizSchedule);

router.route("/student/list").get(getStudentQuizList);

router.route("/quiz/answer").patch(updateStudentAnswer);

router.route("/schedule/get").get(getDetailOfSchedule);

router.route("/review/pending").get(onReviewQuizList);

router.route("/review/completed").get(completedQuizReviewList);

router.route("/student/quiz/pending").get(studentQuizStatusPending);

router.route("/student/quiz/completed").get(studentQuizStatusCompleted);

router.route("/student/quiz/review").get(studentQuizStatusReviewed);

router.route("/review/mark").patch(updateMark);

router.route("/student/completed/quiz/result").get(getStudentCompletedQuizResult);

export default router;
