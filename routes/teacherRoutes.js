import { Router } from "express";
const router = Router();

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
} from "../controllers/teacherController.js";

router.post("/signup", teacherSignUp);
router.post("/status", updateTeacherStatus);
router.route("/").get(getAllTeacher);
router.route("/list").get(getApprovedTeacher);
router.route("/image/upload").patch(teacherImage);
router.route("/image/update/:id").patch(UpdateTeacherImage);
router.route("/remove/image").delete(DeleteTeacherImage);
router.route("/check/username").get(getUserName);
router.route("/:id").get(getTeacher).patch(updateTeacher).delete(deleteTeacher);
router.route("/pending/list").get(getTeacherPendingList);
router.route("/course/list").get(getTeacherCourseList);
router.route("/schedule/student/list").get(studentsListFromCourse);

export default router;
