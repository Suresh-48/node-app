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
} from "../controllers/studentController.js";

router.post("/signup", signUp);

router.route("/upcomingList").post(studentUpcomingList);

router.route("/").get(getAllStudent);

router.route("/:id").get(getStudent).patch(updateStudent).delete(deleteStudent);

router.route("/studentuser").get(getAllUser);

router.route("/:id").get(getUser);

router.route("/getcourse/list/:id").get(getStudentCourseDetail);

router.route("/profile/upload").post(studentProfileImage);

router.route("/courseHistory/:id").get(listOfCourseHistory);

router.route("/remove/profile").delete(DeleteStudentImage);

export default router;
