import { Router } from "express";
import { verifyToken } from "../utils/tokenAuth.js";


const router = Router();

import {
  createLesson,
  deleteCourseLesson,
  getAllCourseLesson,
  getCategoryLessonList,
  getCourseLesson,
  updateCourseLesson,
  getAllCourseLessonData,
  getCourseLessonList,
  getSingleCourseLesson,
} from "../controllers/courseLessonController.js";

router.route("/").post(verifyToken, createLesson);

router.route("/lessonlist").get(verifyToken, getCategoryLessonList);

router.route("/").get(verifyToken, getAllCourseLesson);

router.route("/details").get(verifyToken, getAllCourseLessonData);

router.route("/get/one/:id").get(verifyToken, getSingleCourseLesson);

router.route("/check/list").get(verifyToken, getCourseLessonList);

router
  .route("/:id")
  .get(verifyToken, getCourseLesson)
  .patch(verifyToken, updateCourseLesson)
  .delete(verifyToken, deleteCourseLesson);

export default router;
