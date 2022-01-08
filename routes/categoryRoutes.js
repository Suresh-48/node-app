import { Router } from "express";

const router = Router();

import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategory,
  updateCategory,
} from "../controllers/categoryController.js";

router.route("/").post(createCategory);

router.route("/").get(getAllCategory);

router.route("/:id").get(getCategory).patch(updateCategory).delete(deleteCategory);

export default router;
