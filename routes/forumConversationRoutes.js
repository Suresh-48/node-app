import { Router } from "express";

const router = Router();

import {
  createConversation,
  updateConversation,
  deleteForumQuestion,
  getAllConversation,
  getConversation,
  deleteReplyComment,
} from "../controllers/forumConversationController.js";
import { verifyToken } from "../utils/tokenAuth.js";

router
  .route("/")
  .post(verifyToken, createConversation)
  .get(verifyToken, getAllConversation);
router.route("/edit").patch(verifyToken, updateConversation);
router.route("/list").get(verifyToken, getConversation);
router.route("/delete/comment").delete(verifyToken, deleteReplyComment);
router.route("/:id").delete(verifyToken, deleteForumQuestion);

export default router;
