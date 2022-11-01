import quizSchedule from "../models/quizScheduleModels.js";
import Teacher from "../models/teacherModel.js";
import Student from "../models/studentModel.js";
import Course from "../models/courseModel.js";
import CourseLesson from "../models/courseLessonModel.js";
import { getAll, getOne, deleteOne, updateOne, createOne } from "./baseController.js";
import sendMail from "../utils/sendMail.js";

const { FROM_EMAIL, FROM_EMAIL_DISPLAY_NAME } = process.env;

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
    const updateAnswer = await quizSchedule.findByIdAndUpdate(
      data.quizScheduleId,
      {
        answers: data.answer,
        quizStatus: "Completed",
        reviewStatus: "OnReview",
      }
    );

    const getTeacherData = await Teacher.findOne(updateAnswer.teacherId);
    const getStudentData = await Student.findOne(updateAnswer.studentId);
    const CourseData = await Course.findOne(updateAnswer.courseId);
    const CourseLessonData = await CourseLesson.findOne(updateAnswer.CourseLessonId);

    // Email Notifications start
    const StudentQuizSubmitDetails = {
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
      courseName: CourseData.name,
      courseLessonName: CourseLessonData.lessonName,
    };

    const studentQuizSubmitData = {
      // to: FROM_EMAIL,
      to: getTeacherData.email,
      from: FROM_EMAIL,
      subject: "Student Quiz Submit",
      template: "StudentQuizSubmit",
      substitutions: StudentQuizSubmitDetails,
    };

    res.status(201).json({
      message: "Quiz Updated In Course Lesson",
      updateAnswer,
    });
    res.on("finish", () => {
      // To send a Email Notifications
      sendMail(studentQuizSubmitData, () => {});
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
    const data = await quizSchedule.find({
      studentId: id,
      quizStatus: "Reviewed",
    });

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
    const getTeacherData = await Teacher.findOne(ReviewList.teacherId);
    const getStudentData = await Student.findOne(ReviewList.studentId);
    const CourseData = await Course.findOne(ReviewList.courseId);
    const CourseLessonData = await CourseLesson.findOne(ReviewList.CourseLessonId);

    // Email Notifications start
    const TeacherQuizReviewedDetails = {
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
      courseName: CourseData.name,
      courseLessonName: CourseLessonData.lessonName,
    };

    const TeacherQuizReviewedData = {
      // to: FROM_EMAIL,
      to: getStudentData.email,
      from: FROM_EMAIL,
      subject: "Teacher Quiz Reviewed",
      template: "TeacherQuizReviewed",
      substitutions: TeacherQuizReviewedDetails,
    };

    res.status(200).json({
      message: "List Of Completed Reviews In Quiz",
      ReviewList,
    });
    res.on("finish", () => {
      // To send a Email Notifications
      sendMail(TeacherQuizReviewedData, () => {});
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
//api to get student quiz schedule detail new
// export async function studentQuizScheduleDetail(req, res, next) {
//   try {
//    const data= req.query

//    const quizDetail=await quizSchedule.findOne({_id:data.quizId})

//     res.status(201).json({
//       message: " Quiz Course Lesson Data",
//       quizDetail
//     });
//   } catch (error) {
//     next(error);
//   }
// }

//api to update student answer in quiz schedule
export async function updateStudentAnswerToSchedule(req, res, next) {
  try {
    const data = req.body;
    const answerList = data.answers;

    answerList.forEach(async (res, i) => {
      const update = await quizSchedule.findByIdAndUpdate(
        { _id: data.quizId },
        {
          $set: { ["questions." + `${i}` + ".answer"]: res.answer },
          quizStatus: "Completed",
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

export async function quizFileUpload(req, res, next) {
  try {
    const number = req.body.questionNumber;
    const file = req.files;
    const questionNumbers = number.length <= 1 ? [number] : number;

    res.status(201).json({
      message: " File Uploaded To AWS",
      file,
      questionNumbers,
    });
  } catch (error) {
    next(error);
  }
}
