import { Router } from "express";
const router = Router();

import {
  signUp,
  getAllParent,
  getParent,
  updateParent,
  deleteParent,
  getAllUser,
  getUser,
  getStudentList,
  parentDeleteStudent,
  listOfCourseHistory,
  parentProfileImage,
  DeleteParentImage,
  changeStudentActiveStatus,
} from "../controllers/parentController.js";
import { verifyToken } from "../utils/tokenAuth.js";

router.post("/signup", signUp);

router.route("/").get(verifyToken, getAllParent);

router
  .route("/:id")
  .get(verifyToken, getParent)
  .patch(verifyToken, updateParent)
  .delete(verifyToken, deleteParent);

router.route("/parentuser").get(verifyToken, getAllUser);

router.route("/:id").get(verifyToken, getUser);

router.route("/student/list").get(verifyToken, getStudentList);

router.route("/remove/student/:id").delete(verifyToken, parentDeleteStudent);

router.route("/courseHistory/:id").get(verifyToken, listOfCourseHistory);

router.route("/profile/upload").post(verifyToken, parentProfileImage);

router.route("/remove/profile").delete(verifyToken, DeleteParentImage);

router.route("/student/activeStatus").post(verifyToken, changeStudentActiveStatus);

export default router;
