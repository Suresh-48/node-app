import { Router } from "express";
import { verifyToken } from "../utils/tokenAuth.js";

import {
  teacherSignUp,
  getAllTeacher,
  getTeacher,
  updateTeacher,
  deleteTeacher,
  updateTeacherStatus,
  getApprovedTeacher,
  teacherImage,
  UpdateTeacherImage,
  DeleteTeacherImage,
  getUserName,
  getTeacherPendingList,
  getTeacherCourseList,
  studentsListFromCourse,
  updatePublishTeacher,
  getPublishTeacher,
  TeacherSessionAmount,
} from "../controllers/teacherController.js";
import {
  getTeacherAllPayments,
  teacherAllPayments,
  UpdateTeacherPayment,
} from "../controllers/teacherPaymentController.js";

import {
  createTeacherBankDetails,
  getTeacherBankDetails,
  updateTeacherBankDetails,
  createStripeCustomer,
  chargeStripeCustomer,
} from "../controllers/teacherBankDetailsController.js";

const router = Router();

router.post("/signup", teacherSignUp);
router.post("/status", verifyToken, updateTeacherStatus);
router.route("/").get(verifyToken, getAllTeacher);
router.route("/list").get(getApprovedTeacher);
router.route("/image/upload").patch(verifyToken, teacherImage);
router.route("/image/update/:id").patch(verifyToken, UpdateTeacherImage);
router.route("/remove/image").delete(verifyToken, DeleteTeacherImage);
router.route("/check/username").get(verifyToken, getUserName);
router.route("/:id").get(getTeacher).patch(verifyToken, updateTeacher).delete(verifyToken, deleteTeacher);
router.route("/pending/list").get(verifyToken, getTeacherPendingList);
router.route("/course/list").get(verifyToken, getTeacherCourseList);
router.route("/schedule/student/list").get(verifyToken, studentsListFromCourse);
router.route("/update/public").patch(verifyToken, updatePublishTeacher);
router.route("/publish/list").get(getPublishTeacher);
router.route("/teacher/session/amount").patch(verifyToken, TeacherSessionAmount);
router.route("/teacher/payment/:id").get(verifyToken, teacherAllPayments);
router.route("/payment/update").patch(verifyToken, UpdateTeacherPayment);
router
  .route("/bank/details")
  .post(verifyToken, createTeacherBankDetails)
  .get(verifyToken, getTeacherBankDetails)
  .patch(verifyToken, updateTeacherBankDetails);

router.route("/create/customer").post(createStripeCustomer);
router.route("/charge/customer").post(chargeStripeCustomer);

export default router;
