import { Router } from "express";
const router = Router();

import {
  signUp,
  getAllStudent,
  getStudent,
  updateStudent,
  deleteStudent,
  getAllUser,
  getUser,
  getStudentCourseDetail,
  studentUpcomingList,
  studentProfileImage,
  listOfCourseHistory,
  DeleteStudentImage,
  ActiveEnrollList,
  completedCourseList,
  checkStudentSchdeuleExist,
} from "../controllers/studentController.js";
import { verifyToken } from "../utils/tokenAuth.js";

router.post("/signup", signUp);

router.route("/upcomingList").post(studentUpcomingList);

router.route("/").get(verifyToken, getAllStudent);

router
  .route("/:id")
  .get(verifyToken, getStudent)
  .patch(verifyToken, updateStudent)
  .delete(verifyToken, deleteStudent);

router.route("/studentuser").get(verifyToken, getAllUser);

router.route("/:id").get(verifyToken, getUser);

router.route("/getcourse/list/:id").get(verifyToken, getStudentCourseDetail);

router.route("/profile/upload").post(verifyToken, studentProfileImage);

router.route("/courseHistory/:id").get(verifyToken, listOfCourseHistory);

router.route("/remove/profile").delete(verifyToken, DeleteStudentImage);

router.route("/ActiveCourse/list").get(verifyToken, ActiveEnrollList);

router.route("/completedCourse/list").get(verifyToken, completedCourseList);

router.route("/upcomingSchedule/check").get(verifyToken, checkStudentSchdeuleExist);

export default router;
