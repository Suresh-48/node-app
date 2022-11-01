import { Router } from "express";

const router = Router();

import {
  createForum,
  updateForum,
  getForum,
  getAllForum,
  deleteForumQuestion,
  courseFilter,
  sendForumCloseNotification,
  updateForumQuestionstatus,
  getForumStatusList,
  enableForumchat,
  getLatestForum,
  forumCourseCategory,
} from "../controllers/forumController.js";
import { verifyToken } from "../utils/tokenAuth.js";


router
  .route("/")
  .post(verifyToken, createForum)
  .get(verifyToken, getAllForum);
router.route("/course/category").get(verifyToken, forumCourseCategory);

router.route("/filter").get(verifyToken, courseFilter);
router.route("/notify").patch(verifyToken, sendForumCloseNotification);
router.route("/edit").patch(verifyToken, updateForum);
router.route("/list").get(verifyToken, getForum);
router.route("/delete").delete(verifyToken, deleteForumQuestion);
router.route("/status").patch(verifyToken, updateForumQuestionstatus);
router.route("/status/list").get(verifyToken, getForumStatusList);
router.route("/chat/status").patch(verifyToken, enableForumchat);
router.route("/latest").get(verifyToken, getLatestForum);

export default router;
