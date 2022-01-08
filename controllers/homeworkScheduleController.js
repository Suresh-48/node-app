import homeworkSchedule from "../models/homeworkScheduleModels.js";
import { getAll, getOne, deleteOne, updateOne, createOne } from "./baseController.js";

export const createHomeworkSchedule = createOne(homeworkSchedule);
export const updateHomeworkSchedule = updateOne(homeworkSchedule);
export const getAllHomeworkSchedule = getAll(homeworkSchedule);
export const getHomeworkSchedule = getOne(homeworkSchedule);
export const deleteHomeworkSchedule = deleteOne(homeworkSchedule);

export async function getStudentHomeworkList(req, res, next) {
  try {
    const data = req.query;
    const homeworkList = await homeworkSchedule
      .find({
        studentId: data.studentId,
      })
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("scheduleLesson")
      .populate("studentId");

    res.status(201).json({
      message: "Homework Updated In Course Lesson",
      homeworkList,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateStudentAnswer(req, res, next) {
  try {
    const data = req.body;
    const updateAnswer = await homeworkSchedule.findByIdAndUpdate(data.homeworkScheduleId, {
      answers: data.answer,
      homeworkStatus: "Completed",
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
    const id = req.query.homeworkScheduleId;
    const getOne = await homeworkSchedule.findOne({ _id: id }).populate("homeworkId");

    res.status(201).json({
      message: "homework Updated In Course Lesson",
      getOne,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateHomeWorkRemarks(req, res, next) {
  try {
    const data = req.body;
    const id = data.id;
    const editedData = {
      remarks: data.remarks,
    };

    const editDetail = await homeworkSchedule.findByIdAndUpdate(id, editedData, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      message: "Student Remarks Updated Successfully",
      editDetail,
    });
  } catch (error) {
    next(error);
  }
}

export async function onReviewHomeworkList(req, res, next) {
  try {
    const data = req.query;
    const pendingReviewList = await homeworkSchedule
      .find({ teacherId: data.teacherId, reviewStatus: "OnReview" })
      .populate("homeworkId")
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("scheduleLesson")
      .populate("studentId");

    res.status(200).json({
      message: "List Of Pending Reviews In Homework",
      pendingReviewList,
    });
  } catch (error) {
    next(error);
  }
}

export async function completedHomeworkReviewList(req, res, next) {
  try {
    const data = req.query;
    const completedReviewList = await homeworkSchedule
      .find({ teacherId: data.teacherId, reviewStatus: "ReviewCompleted" })
      .populate("homeworkId")
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("scheduleLesson")
      .populate("studentId");

    res.status(200).json({
      message: "List Of Completed Reviews In Homework",
      completedReviewList,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMark(req, res, next) {
  try {
    const data = req.body;
    const reviewList = await homeworkSchedule.findByIdAndUpdate(data.homeworkScheduleId, {
      homeworkStatus: "Reviewed",
      reviewStatus: "ReviewCompleted",
      reviewAnswer: data.reviewAnswer,
    });
    res.status(200).json({
      message: "List Of Completed Reviews In Homework",
      reviewList,
    });
  } catch (error) {
    next(error);
  }
}

// student homework api based on status
export async function studentHomeworkStatusPending(req, res, next) {
  try {
    const data = req.query;
    const pendingReviewList = await homeworkSchedule
      .find({ studentId: data.studentId, homeworkStatus: "Pending" })
      .populate("quizId")
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("scheduleLesson")
      .populate("teacherId");

    res.status(200).json({
      message: "List Of Student Pending Reviews In Home Work",
      pendingReviewList,
    });
  } catch (error) {
    next(error);
  }
}
export async function studentHomeWorkStatusCompleted(req, res, next) {
  try {
    const data = req.query;
    const pendingReviewList = await homeworkSchedule
      .find({ studentId: data.studentId, homeworkStatus: "Completed" })
      .populate("quizId")
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("scheduleLesson")
      .populate("teacherId");

    res.status(200).json({
      message: "List Of Student Completed Reviews In Home Work",
      pendingReviewList,
    });
  } catch (error) {
    next(error);
  }
}
export async function studentHomeworkStatusReviewed(req, res, next) {
  try {
    const data = req.query;
    const pendingReviewList = await homeworkSchedule
      .find({ studentId: data.studentId, homeworkStatus: "Reviewed" })
      .populate("quizId")
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("scheduleLesson")
      .populate("teacherId");

    res.status(200).json({
      message: "List Of Student Reviewed Reviews In Homw work",
      pendingReviewList,
    });
  } catch (error) {
    next(error);
  }
}
