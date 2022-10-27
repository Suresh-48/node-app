import homeworkSchedule from "../models/homeworkScheduleModels.js";
import Teacher from "../models/teacherModel.js";
import Student from "../models/studentModel.js";
import Course from "../models/courseModel.js";
import CourseLesson from "../models/courseLessonModel.js"
import { getAll, getOne, deleteOne, updateOne, createOne } from "./baseController.js";

import sendMail from "../utils/sendMail.js";

const { FROM_EMAIL, FROM_EMAIL_DISPLAY_NAME } = process.env;

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
    
    const getTeacherData = await Teacher.findOne(updateAnswer.teacherId);
    const getStudentData = await Student.findOne(updateAnswer.studentId);
    const CourseData = await Course.findOne(updateAnswer.courseId);
    const CourseLessonData = await CourseLesson.findOne(updateAnswer.CourseLessonId);

     // Email Notifications start
     const StudentHomeWorkSubmitDetails = {
      appUrl: `http:localhost:3000/login`,
      websiteBaseUrl: "http:localhost:3000",
      facebookUrl: "http:localhost:3000",
      twitterUrl: "http:localhost:3000",
      instagramUrl: "http:localhost:3000",
      linkedInUrl: "http:localhost:3000",
      dribbleUrl: "http:localhost:3000",
      emailLogoUrl: "http:localhost:3000",
      copyRightText: "http:localhost:3000",
      emailPrimaryBackgroundColor: "#009dda",
      emailPrimaryTextColor: "#FFFFFF",
      mediaBaseUrl: "http:localhost:3000",
      marketplaceName: "http:localhost:3000",
      studentName: `${getStudentData.firstName} ${getStudentData.lastName}`,
      courseName:CourseData.name,
      courseLessonName:CourseLessonData.lessonName,
    };

    const studentHomeWorkSubmitData = {
      // to: FROM_EMAIL,
      to: getTeacherData.email,
      from: FROM_EMAIL,
      subject: "Student HomeWork Submit",
      template: "StudentHomeWorkSubmit",
      substitutions: StudentHomeWorkSubmitDetails,
    };

    res.status(201).json({
      message: "Quiz Updated In Course Lesson",
      updateAnswer,
    });
    res.on("finish", () => {
      // To send a Email Notifications
      sendMail(studentHomeWorkSubmitData, () => {});
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
      scored:data.scored
    });

    const getTeacherData = await Teacher.findOne(reviewList.teacherId);
    const getStudentData = await Student.findOne(reviewList.studentId);
    const CourseData = await Course.findOne(reviewList.courseId);
    const CourseLessonData = await CourseLesson.findOne(reviewList.CourseLessonId);

     // Email Notifications start
     const TeacherHomeWorkReviewedDetails = {
      appUrl: `http:localhost:3000/login`,
      websiteBaseUrl: "http:localhost:3000",
      facebookUrl: "http:localhost:3000",
      twitterUrl: "http:localhost:3000",
      instagramUrl: "http:localhost:3000",
      linkedInUrl: "http:localhost:3000",
      dribbleUrl: "http:localhost:3000",
      emailLogoUrl: "http:localhost:3000",
      copyRightText: "http:localhost:3000",
      emailPrimaryBackgroundColor: "#009dda",
      emailPrimaryTextColor: "#FFFFFF",
      mediaBaseUrl: "http:localhost:3000",
      marketplaceName: "http:localhost:3000",
      studentName: `${getStudentData.firstName} ${getStudentData.lastName}`,
      courseName:CourseData.name,
      courseLessonName:CourseLessonData.lessonName,
    };

    const TeacherHomeWorkReviewedData = {
      // to: FROM_EMAIL,
      to: getStudentData.email,
      from: FROM_EMAIL,
      subject: "Teacher HomeWork Reviewed",
      template: "TeacherHomeWorkReviewed",
      substitutions: TeacherHomeWorkReviewedDetails,
    };

    res.status(200).json({
      message: "List Of Completed Reviews In Homework",
      reviewList,
    });
    res.on("finish", () => {
      // To send a Email Notifications
      sendMail(TeacherHomeWorkReviewedData, () => {});
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

//api to update student answer in quiz schedule
export async function updateStudentAnswerToSchedule(req, res, next) {
  try {
    const data = req.body;
    const answerList = data.answers;

    answerList.forEach(async (res, i) => {
      const update = await homeworkSchedule.findByIdAndUpdate(
        { _id: data.homeworkId },
        {
          $set: { ["questions." + `${i}` + ".answer"]: res.answer },
          homeworkStatus: "Completed",
          reviewStatus: "OnReview",
        }
      );
    });
    res.status(201).json({
      message: " Update Quiz Answer",
    });
  } catch (error) {
    next(error);
  }
}

export async function homeworkFileUpload(req, res, next) {
  try {
    const number=req.body.questionNumber
    const file = req.files;
    const questionNumbers=number.length<=1?[number]:number

    res.status(201).json({
      message: " File Uploaded To AWS",
      file,
      questionNumbers
    });
  } catch (error) {
    next(error);
  }
}
