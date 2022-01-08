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
} from "../controllers/parentController.js";

router.post("/signup", signUp);

router.route("/").get(getAllParent);

router.route("/:id").get(getParent).patch(updateParent).delete(deleteParent);

router.route("/parentuser").get(getAllUser);

router.route("/:id").get(getUser);

router.route("/student/list") .get(getStudentList)

router.route("/remove/student/:id").delete(parentDeleteStudent);

router.route("/courseHistory/:id").get(listOfCourseHistory);

router.route("/profile/upload").post(parentProfileImage);

router.route("/remove/profile").delete(DeleteParentImage)

export default router;
