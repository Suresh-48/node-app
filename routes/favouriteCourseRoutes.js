import { Router } from "express";
import {
  createFavouriteCourse,
  deleteFavouriteCourse,
  getAllFavouriteCourse,
  getFavouriteCourse,
  updateFavouriteCourse,
  getFavouriteCourseList,
} from "../controllers/favouriteCourseController.js";
import { verifyToken } from "../utils/tokenAuth.js";

const router = Router();

router.route("/").post(verifyToken, createFavouriteCourse);

router.route("/").get(verifyToken, getAllFavouriteCourse);

router.route("/user").get(verifyToken, getFavouriteCourseList);

router
  .route("/:id")
  .get(verifyToken, getFavouriteCourse)
  .patch(verifyToken, updateFavouriteCourse)
  .delete(verifyToken, deleteFavouriteCourse);

export default router;
