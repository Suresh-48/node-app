import quizSchedule from "../models/quizScheduleModels.js";
import { getAll, getOne, deleteOne, updateOne, createOne } from "./baseController.js";

export const createQuizSchedule = createOne(quizSchedule);
export const updateQuizSchedule = updateOne(quizSchedule);
export const getAllQuizSchedule = getAll(quizSchedule);
export const getQuizSchedule = getOne(quizSchedule);
export const deleteQuizSchedule = deleteOne(quizSchedule);

export async function getStudentQuizList(req, res, next) {
  try {
    const data = req.query;
    const quizList = await quizSchedule
      .find({
        studentId: data.studentId,
      })
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("scheduleLesson")
      .populate("studentId");

    res.status(201).json({
      message: "Quiz Updated In Course Lesson",
      quizList,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateStudentAnswer(req, res, next) {
  try {
    const data = req.body;
    const updateAnswer = await quizSchedule.findByIdAndUpdate(data.quizScheduleId, {
      answers: data.answer,
      quizStatus: "Completed",
      reviewStatus: "OnReview",
    });

    res.status(201).json({
      message: "Quiz Updated In Course Lesson",
      updateAnswer,
    });
  } catch (error) {
    next(error);
  }
}

export async function getDetailOfSchedule(req, res, next) {
  try {
    const id = req.query.quizScheduleId;
    const getOne = await quizSchedule
      .findOne({ _id: id })
      .populate("quizId")
      .populate("courseId")
      .populate("courseLessonId");

    res.status(201).json({
      message: "Quiz Updated In Course Lesson",
      getOne,
    });
  } catch (error) {
    next(error);
  }
}

export async function getStudentCompletedQuizResult(req, res, next) {
  try {
    const id = req.query.studentId;
    const data = await quizSchedule.find({ studentId: id, quizStatus: "Reviewed" });

    let quiz_Id = data.map((list) => {
      let studentId = [];
      studentId = list._id;
      return studentId;
    });

    const getAll = await quizSchedule
      .find({ _id: { $in: quiz_Id }, quizStatus: "Reviewed" })
      .populate({ path: "courseId", populate: { path: "category" } })
      .populate("quizId")
      .populate("courseLessonId")
      .populate("scheduleLesson");

    res.status(201).json({
      getAll,
    });
  } catch (error) {
    next(error);
  }
}

export async function onReviewQuizList(req, res, next) {
  try {
    const data = req.query;
    const pendingReviewList = await quizSchedule
      .find({ teacherId: data.teacherId, reviewStatus: "OnReview" })
      .populate("quizId")
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("scheduleLesson")
      .populate("studentId");

    res.status(200).json({
      message: "List Of Pending Reviews In Quiz",
      pendingReviewList,
    });
  } catch (error) {
    next(error);
  }
}
export async function completedQuizReviewList(req, res, next) {
  try {
    const data = req.query;
    const completedReviewList = await quizSchedule
      .find({ teacherId: data.teacherId, reviewStatus: "ReviewCompleted" })
      .populate("quizId")
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("scheduleLesson")
      .populate("studentId");

    res.status(200).json({
      message: "List Of Completed Reviews In Quiz",
      completedReviewList,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMark(req, res, next) {
  try {
    const data = req.body;
    const ReviewList = await quizSchedule.findByIdAndUpdate(data.quizScheduleId, {
      reviewStatus: "ReviewCompleted",
      quizStatus: "Reviewed",
      scored: data.scored,
      reviewAnswer: data.reviewAnswer,
    });
    res.status(200).json({
      message: "List Of Completed Reviews In Quiz",
      ReviewList,
    });
  } catch (error) {
    next(error);
  }
}

export async function studentQuizStatusPending(req, res, next) {
  try {
    const data = req.query;
    const pendingReviewList = await quizSchedule
      .find({ studentId: data.studentId, quizStatus: "Pending" })
      .populate("quizId")
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("scheduleLesson")
      .populate("teacherId");

    res.status(200).json({
      message: "List Of Student Pending Reviews In Quiz",
      pendingReviewList,
    });
  } catch (error) {
    next(error);
  }
}

export async function studentQuizStatusCompleted(req, res, next) {
  try {
    const data = req.query;
    const pendingReviewList = await quizSchedule
      .find({ studentId: data.studentId, quizStatus: "Completed" })
      .populate("quizId")
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("scheduleLesson")
      .populate("teacherId");

    res.status(200).json({
      message: "List Of Student Completed Reviews In Quiz",
      pendingReviewList,
    });
  } catch (error) {
    next(error);
  }
}
export async function studentQuizStatusReviewed(req, res, next) {
  try {
    const data = req.query;
    const pendingReviewList = await quizSchedule
      .find({ studentId: data.studentId, quizStatus: "Reviewed" })
      .populate("quizId")
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("scheduleLesson")
      .populate("teacherId");

    res.status(200).json({
      message: "List Of Student Reviewed Reviews In Quiz",
      pendingReviewList,
    });
  } catch (error) {
    next(error);
  }
}
