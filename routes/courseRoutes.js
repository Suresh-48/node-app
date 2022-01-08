import { Router } from "express";

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

router.route("/").post(courseCreation);

router.route("/").get(getAllCourse);

router.route("/publish").get(getPublishCourse);

router.route("/archive").get(getArchiveCourse);

router.route("/draft").get(getDraftCourse);

router.route("/landingScreen").get(getCourseForLandingScreen);

router.route("/type").patch(changeCourseType);

router.route("/filter").post(categoryFilter);

router.route("/:id").get(getCourse).patch(updateCourse).delete(deleteCourse);

router.route("/image/upload").patch(courseImage);

router.route("/image/update/:id").patch(UpdateCourseImage);

router.route("/detail/:id").get(courseDetail);

export default router;
