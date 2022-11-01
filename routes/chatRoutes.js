import { Router } from "express";
import { verifyToken } from "../utils/tokenAuth.js";


const router = Router();

import {
  getChatMembers,
  getAllChat,
  createChat,
  getChat,
  updateChat,
  deleteChat,
  getTeacherCourse,
  getTeacherChatMembers,
  getStudentChat,
  getStudentCourse,
  getParentChat,
  getAllChatForAdmin,
} from "../controllers/chatController.js";

router.route("/getChatMembers").get(verifyToken, getChatMembers);

router.route("/teacher/course").get(verifyToken, getTeacherCourse);

router.route("/teacher").get(verifyToken, getTeacherChatMembers);

router.route("/student/course").get(verifyToken, getStudentCourse);

router.route("/student").get(verifyToken, getStudentChat);

router.route("/parent").get(verifyToken, getParentChat);

router.route("/all/user").get(verifyToken, getAllChatForAdmin);

router
  .route("/")
  .get(verifyToken, getAllChat)
  .post(verifyToken, createChat);

router.route("/list").get(verifyToken, getChat);

router
  .route("/:id")
  .patch(verifyToken, updateChat)
  .delete(verifyToken, deleteChat);

export default router;
