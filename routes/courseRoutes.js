import { Router } from "express";
import { verifyToken } from "../utils/tokenAuth.js";

const router = Router();

import {
  categoryFilter,
  changeCourseType,
  courseCreation,
  courseImage,
  deleteCourse,
  getAllCourse,
  getArchiveCourse,
  getCourse,
  getCourseForLandingScreen,
  getDraftCourse,
  getPublishCourse,
  updateCourse,
  UpdateCourseImage,
  courseDetail,
} from "../controllers/courseController.js";

router.route("/").post(verifyToken, courseCreation);

router.route("/").get(getAllCourse);

router.route("/publish").get(verifyToken, getPublishCourse);

router.route("/archive").get(verifyToken, getArchiveCourse);

router.route("/draft").get(verifyToken, getDraftCourse);

router.route("/landingScreen").get(verifyToken, getCourseForLandingScreen);

router.route("/type").patch(verifyToken, changeCourseType);

router.route("/filter").post(verifyToken, categoryFilter);

router
  .route("/:id")
  .get(verifyToken, getCourse)
  .patch(verifyToken, updateCourse)
  .delete(verifyToken, deleteCourse);

router.route("/image/upload").patch(verifyToken, courseImage);

router.route("/image/update/:id").patch(verifyToken, UpdateCourseImage);

router.route("/detail/:id").get(verifyToken, courseDetail);

export default router;
