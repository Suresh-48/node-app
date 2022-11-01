import ForumConversation from "../models/forumConversationModel.js";
import Forum from "../models/forumModel.js";
import { deleteOne, getAll } from "./baseController.js";
import moment from "moment-timezone";

export async function createConversation(req, res, next) {
  try {
    const data = req.body;

    const createData = await ForumConversation.create({
      question: data.question,
      answer: data.answer,
      createdAt: data.createdAt,
      userId: data.user,
      courseId: data.courseId,
    });

    const getComments = await ForumConversation.find({
      question: data.question,
    });

    const editData = {
      replyCount: getComments.length,
    };
    const editDetail = await Forum.findByIdAndUpdate(data.question, editData, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      message: "Conversation created sucessfully",
      data: createData,
    });
  } catch (error) {
    next(error);
  }
}
export async function updateConversation(req, res, next) {
  try {
    const data = req.body;

    const exist = await ForumConversation.findOne({ _id: data.answerId });

    const editData = {
      question: data.question,
      answer: data.answer,
      createdAt: data.createdAt,
      userId: data.user,
    };
    const editDetail = await ForumConversation.findByIdAndUpdate(data.answerId, editData, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: "Created",
      message: "Updated Forum Conversation Successfully ",
    });
  } catch (error) {
    next(error);
  }
}

export async function getConversation(req, res, next) {
  try {
    const data = req.body;

    const conversationList = await ForumConversation.find({
      _id: data.id,
    });

    res.status(200).json({
      message: "Get Conversation List",
      conversationList,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllConversation(req, res, next) {
  try {
    const questionId = req.query.questionId;

    var today = new Date();
    const conversationList = await ForumConversation.find({
      question: questionId,
      createdAt: { $lt: "today" },
    })
      .populate({ path: "userId", populate: { path: "studentId" } })
      .populate({ path: "userId", populate: { path: "parentId" } })
      .populate({ path: "userId", populate: { path: "teacherId" } })
      .populate("courseId")
      .sort({ $natural: -1 });

    res.status(200).json({
      message: "Get All conversation List",
      conversationList,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteReplyComment(req, res, next) {
  try {
    const commentId = req.query.id;

    const data = await ForumConversation.findByIdAndDelete({ _id: commentId });

    if (data) {
      const getComments = await ForumConversation.find({
        question: data.question,
      });

      const editData = {
        replyCount: getComments.length,
      };
      const editDetail = await Forum.findByIdAndUpdate(data.question, editData, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({
        message: "Comments Deleted Successfuly",
      });
    } else {
      res.status(403).json({
        message: "No comments found with that id ",
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function deleteForumQuestion(req, res, next) {
  try {
    const questionId = req.query.id;

    const data = await ForumConversation.findByIdAndDelete({ question: questionId });

    if (data) {
      const getQuestion = await ForumConversation.find({
        question: data.question,
      });

      res.status(200).json({
        message: "Forum Question Deleted Successfuly",
      });
    } else {
      res.status(403).json({
        message: "No Questions found with that id ",
      });
    }
  } catch (error) {
    next(error);
  }
}
