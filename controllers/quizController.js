import quiz from "../models/quizModels.js";
import { getAll, getOne, deleteOne, updateOne, createOne } from "./baseController.js";

export async function addQuizToCourseLesson(req, res, next) {
  try {
    const data = req.body;
    const exist = await quiz.find({ courseLessonId: data.courseLessonId, courseId: data.courseId });
    if (exist.length == 0) {
      const quizCreation = await quiz.create({
        courseLessonId: data.courseLessonId,
        courseId: data.courseId,
        questions: data.questions,
      });
      res.status(201).json({
        message: "Quiz Updated In Course Lesson",
        quizCreation,
      });
    } else {
      res.status(208).json({
        message: "Quiz Question Already Exist",
        data: {
          exist,
        },
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function updateQuizToCourseLesson(req, res, next) {
  try {
    const data = req.body;

    const exist = await quiz.findOne({ courseLessonId: data.courseLessonId, courseId: data.courseId });

    const id = exist._id;

    const editedData = {
      courseLessonId: data.courseLessonId,
      courseId: data.courseId,
      questions: data.questions,
    };
    const editDetail = await quiz.findByIdAndUpdate(id, editedData, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      status: "Created",
      message: " Updated Quiz Successfuly to Courrse Lesson",
      editDetail,
    });
  } catch (error) {
    next(error);
  }
}

export async function getQuizCourseLesson(req, res, next) {
  try {
    const courseLessonId = req.query.courseLessonId;

    const lessonData = await quiz.findOne({ courseLessonId: courseLessonId }).populate("courseId");

    res.status(201).json({
      message: " Quiz Course Lesson Data",
      lessonData,
    });
  } catch (error) {
    next(error);
  }
}

export async function getLessonQuizDetail(req, res, next) {
  try {
    const courseLessonId = req.query.courseLessonId;

    const lessonData = await quiz.find({ courseLessonId: courseLessonId })

    res.status(201).json({
      message: " Quiz Course Lesson Data",
      lessonData,
    });
  } catch (error) {
    next(error);
  }
}


export const createQuiz = createOne(quiz);
export const updateQuiz = updateOne(quiz);
export const getAllQuiz = getAll(quiz);
export const getQuiz = getOne(quiz);
export const deleteQuiz = deleteOne(quiz);
