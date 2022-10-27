import { Router } from "express";
import { verifyToken } from "../utils/tokenAuth.js";


const router = Router();

import { createChatQuestion, getChatAnswer } from "../controllers/chatbotController.js";

router.route("/create").post(verifyToken, createChatQuestion);

router.route("/faq").post(verifyToken, getChatAnswer);

export default router;
