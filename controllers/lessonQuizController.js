import LessonQuiz from "../models/lessonQuizModels.js";
import quizSchedule from "../models/quizScheduleModels.js";
import { getAll, getOne, deleteOne, updateOne, createOne } from "./baseController.js";

export async function addQuizToCourseLesson(req, res, next) {
  try {
    const data = req.body;
    const exist = await LessonQuiz.find({
      courseLessonId: data.courseLessonId,
      courseId: data.courseId,
      questionNumber: data.questionNumber,
      question: data.question,
    });

    const NumberExist = await LessonQuiz.find({
      courseLessonId: data.courseLessonId,
      courseId: data.courseId,
      questionNumber: data.questionNumber,
    });
    // if (NumberExist.length !== 0) {
    //   res.status(400).json({
    //     message: "Quiz Question Number Already Exist",
    //   });
    // }
    if (exist.length == 0) {
      if (data.type === "text") {
        const quizCreation = await LessonQuiz.create({
          courseLessonId: data.courseLessonId,
          courseId: data.courseId,
          question: data.question,
          questionNumber: data.questionNumber,
          type: data.type,
        });
        res.status(201).json({
          message: "Quiz Updated In Course Lesson",
          quizCreation,
        });
      } else if (data.type === "radio") {
        const quizCreation = await LessonQuiz.create({
          courseLessonId: data.courseLessonId,
          courseId: data.courseId,
          question: data.question,
          questionNumber: data.questionNumber,
          option1: data.option1,
          option2: data.option2,
          option3: data.option3,
          option4: data.option4,
          type: data.type,
        });
        res.status(201).json({
          message: "Quiz Updated In Course Lesson",
          quizCreation,
        });
      } else if (data.type === "checkbox") {
        const quizCreation = await LessonQuiz.create({
          courseLessonId: data.courseLessonId,
          courseId: data.courseId,
          question: data.question,
          questionNumber: data.questionNumber,
          checkBox1: data.checkBox1,
          checkBox2: data.checkBox2,
          checkBox3: data.checkBox3,
          checkBox4: data.checkBox4,
          type: data.type,
        });
        res.status(201).json({
          message: "Quiz Updated In Course Lesson",
          quizCreation,
        });
      } else {
        const quizCreation = await LessonQuiz.create({
          courseLessonId: data.courseLessonId,
          courseId: data.courseId,
          question: data.question,
          questionNumber: data.questionNumber,
          fileType: data.fileType,
          type: data.type,
        });
        res.status(201).json({
          message: "Quiz Updated In Course Lesson",
          quizCreation,
        });
      }
    } else {
      res.status(403).json({
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
    const id = data.lessonQuizId;

    const editedData =
      data.type === "text"
        ? {
            courseLessonId: data.courseLessonId,
            courseId: data.courseId,
            question: data.question,
            questionNumber: data.questionNumber,
            type: data.type,
          }
        : data.type === "radio"
        ? {
            courseLessonId: data.courseLessonId,
            courseId: data.courseId,
            question: data.question,
            questionNumber: data.questionNumber,
            option1: data.option1,
            option2: data.option2,
            option3: data.option3,
            option4: data.option4,
            type: data.type,
          }
        : data.type === "checkbox"
        ? {
            courseLessonId: data.courseLessonId,
            courseId: data.courseId,
            question: data.question,
            questionNumber: data.questionNumber,
            checkBox1: data.checkBox1,
            checkBox2: data.checkBox2,
            checkBox3: data.checkBox3,
            checkBox4: data.checkBox4,
            type: data.type,
          }
        : {
            courseLessonId: data.courseLessonId,
            courseId: data.courseId,
            question: data.question,
            questionNumber: data.questionNumber,
            fileType: data.fileType,
            type: data.type,
          };

    const numberExist = await LessonQuiz.find({
      _id: { $nin: [id] },
      courseLessonId: data.courseLessonId,
      courseId: data.courseId,
      questionNumber: data.questionNumber,
    });
    // if (numberExist.length !== 0) {
    //   res.status(400).json({
    //     message: "Quiz Question Number Already Exist",
    //   });
    // } else {
    const editDetail = await LessonQuiz.findByIdAndUpdate(id, editedData, {
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

    const lessonData = await LessonQuiz.findOne({
      courseLessonId: courseLessonId,
    }).populate("courseId");

    res.status(200).json({
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

    const lessonData = await LessonQuiz.find({
      courseLessonId: courseLessonId,
    });

    res.status(200).json({
      message: " Quiz Course Lesson Data",
      lessonData,
    });
  } catch (error) {
    next(error);
  }
}

export async function getLessonQuizList(req, res, next) {
  try {
    const courseLessonId = req.query.courseLessonId;

    const quizData = await LessonQuiz.find({
      courseLessonId: courseLessonId,
    }).sort({ questionNumber: 1 });

    res.status(200).json({
      message: " Quiz Course Lesson Data",
      quizData,
    });
  } catch (error) {
    next(error);
  }
}
export const createQuiz = createOne(LessonQuiz);
export const updateQuiz = updateOne(LessonQuiz);
export const getAllQuiz = getAll(LessonQuiz);
export const getQuiz = getOne(LessonQuiz);
export const deleteQuiz = deleteOne(LessonQuiz);
