import { Router } from "express";
import upload from "../utils/s3.js";

const router = Router();

import {
  createHomeworkSchedule,
  deleteHomeworkSchedule,
  getAllHomeworkSchedule,
  getHomeworkSchedule,
  getStudentHomeworkList,
  updateHomeworkSchedule,
  updateStudentAnswer,
  getDetailOfSchedule,
  updateHomeWorkRemarks,
  onReviewHomeworkList,
  completedHomeworkReviewList,
  updateMark,
  studentHomeworkStatusPending,
  studentHomeWorkStatusCompleted,
  studentHomeworkStatusReviewed,
  homeworkFileUpload,
  updateStudentAnswerToSchedule,
} from "../controllers/homeworkScheduleController.js";
import { verifyToken } from "../utils/tokenAuth.js";


router.route("/").post(verifyToken, createHomeworkSchedule);

router.route("/").get(verifyToken, getAllHomeworkSchedule);

router.route("/remark").patch(verifyToken, updateHomeWorkRemarks);

router
  .route("/:id")
  .get(verifyToken, getHomeworkSchedule)
  .patch(verifyToken, updateHomeworkSchedule)
  .delete(verifyToken, deleteHomeworkSchedule);

router
  .route("/:id")
  .get(verifyToken, getHomeworkSchedule)
  .patch(verifyToken, updateHomeworkSchedule)
  .delete(verifyToken, deleteHomeworkSchedule);

router.route("/student/list").get(verifyToken, getStudentHomeworkList);

router.route("/homework/answer").patch(verifyToken, updateStudentAnswer);

router.route("/schedule/get").get(verifyToken, getDetailOfSchedule);

router.route("/review/pending").get(verifyToken, onReviewHomeworkList);

router.route("/review/completed").get(verifyToken, completedHomeworkReviewList);

router.route("/review/mark").patch(verifyToken, updateMark);

router.route("/student/homework/pending").get(verifyToken, studentHomeworkStatusPending);

router.route("/student/homework/completed").get(verifyToken, studentHomeWorkStatusCompleted);

router.route("/student/homework/review").get(verifyToken, studentHomeworkStatusReviewed);

router.route("/file/upload").post(upload, verifyToken, homeworkFileUpload);

router.route("/student/answer").post(verifyToken, updateStudentAnswerToSchedule);

export default router;
