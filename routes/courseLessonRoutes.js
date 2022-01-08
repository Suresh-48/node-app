import { Router } from "express";

const router = Router();

import { createLesson, deleteCourseLesson, getAllCourseLesson, getCategoryLessonList, getCourseLesson, updateCourseLesson } from "../controllers/courseLessonController.js";

router.route("/").post(createLesson);

router.route("/lessonlist").get(getCategoryLessonList);

router.route("/").get(getAllCourseLesson);

router.route("/:id").get(getCourseLesson).patch(updateCourseLesson).delete(deleteCourseLesson);

export default router;
