import { Router } from "express";
import { verifyToken } from "../utils/tokenAuth.js";

const router = Router();

import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategory,
  updateCategory,
  categoryImage,
  getCategoryList,
} from "../controllers/categoryController.js";

router.route("/").post(verifyToken, createCategory);

router.route("/image/upload").patch(verifyToken, categoryImage);

router.route("/list").get(verifyToken, getCategoryList);
router.route("/").get(getAllCategory);

router
  .route("/:id")
  .get(verifyToken, getCategory)
  .patch(verifyToken, updateCategory)
  .delete(verifyToken, deleteCategory);

export default router;
