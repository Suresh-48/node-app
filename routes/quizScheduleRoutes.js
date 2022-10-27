import { Router } from "express";
import upload from "../utils/s3.js";
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
  // studentQuizScheduleDetail,
  updateStudentAnswerToSchedule,
  quizFileUpload,
} from "../controllers/quizScheduleController.js";
import { verifyToken } from "../utils/tokenAuth.js";

router.route("/").post(verifyToken, createQuizSchedule);

router.route("/").get(verifyToken, getAllQuizSchedule);

router
  .route("/:id")
  .get(verifyToken, getQuizSchedule)
  .patch(verifyToken, updateQuizSchedule)
  .delete(verifyToken, deleteQuizSchedule);

router.route("/student/list").get(verifyToken, getStudentQuizList);

router.route("/quiz/answer").patch(verifyToken, updateStudentAnswer);

router.route("/schedule/get").get(verifyToken, getDetailOfSchedule);

router.route("/review/pending").get(verifyToken, onReviewQuizList);

router.route("/review/completed").get(verifyToken, completedQuizReviewList);

router.route("/student/quiz/pending").get(verifyToken, studentQuizStatusPending);

router.route("/student/quiz/completed").get(verifyToken, studentQuizStatusCompleted);

router.route("/student/quiz/review").get(verifyToken, studentQuizStatusReviewed);

router.route("/review/mark").patch(verifyToken, updateMark);

router.route("/student/completed/quiz/result").get(verifyToken, getStudentCompletedQuizResult);

// router.route("/studet/quiz/detail").get(studentQuizScheduleDetail)

router.route("/file/upload").post(upload, verifyToken, quizFileUpload);

router.route("/student/answer").post(verifyToken, updateStudentAnswerToSchedule);

export default router;
