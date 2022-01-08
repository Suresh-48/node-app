import { Router } from "express";
const router = Router();

import {
  createUser,
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
  login,
  logout,
} from "../controllers/userController.js";

router.route("/all").get(getAllUser);

router.route("/").post(createUser);

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

router.route("/login").post(login);
router.route("/logout").post(logout);

export default router;
