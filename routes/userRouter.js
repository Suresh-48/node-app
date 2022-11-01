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
  forgetPassword,
  setNewPassword,
  changePassword,
} from "../controllers/userController.js";
import { verifyToken } from "../utils/tokenAuth.js";

router.route("/all").get(verifyToken, getAllUser);

router.route("/").post(verifyToken, createUser);

router
  .route("/:id")
  .get(getUser)
  .patch(verifyToken, updateUser)
  .delete(verifyToken, deleteUser);

router.route("/login").post(login);

router.route("/logout").post(verifyToken, logout);

router.route("/forget/password").post(forgetPassword);

router.route("/set/newPassword").post(setNewPassword);

router.route("/change/password").post(changePassword);

export default router;
