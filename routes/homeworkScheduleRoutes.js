import { Router } from "express";

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
} from "../controllers/homeworkScheduleController.js";

router.route("/").post(createHomeworkSchedule);

router.route("/").get(getAllHomeworkSchedule);

router.route("/remark").patch(updateHomeWorkRemarks);

router.route("/:id").get(getHomeworkSchedule).patch(updateHomeworkSchedule).delete(deleteHomeworkSchedule);

router.route("/:id").get(getHomeworkSchedule).patch(updateHomeworkSchedule).delete(deleteHomeworkSchedule);

router.route("/student/list").get(getStudentHomeworkList);

router.route("/homework/answer").patch(updateStudentAnswer);

router.route("/schedule/get").get(getDetailOfSchedule);

router.route("/review/pending").get(onReviewHomeworkList);

router.route("/review/completed").get(completedHomeworkReviewList);

router.route("/review/mark").patch(updateMark);

router.route("/student/homework/pending").get(studentHomeworkStatusPending);

router.route("/student/homework/completed").get(studentHomeWorkStatusCompleted);

router.route("/student/homework/review").get(studentHomeworkStatusReviewed);

export default router;
