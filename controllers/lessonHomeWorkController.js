import LessonHomeWork from "../models/lessonHomeWorkModel.js";
import { getAll, getOne, deleteOne, updateOne, createOne } from "./baseController.js";

export async function addHomeworkToCourseLesson(req, res, next) {
  try {
    const data = req.body;
    const exist = await LessonHomeWork.find({
      courseLessonId: data.courseLessonId,
      courseId: data.courseId,
      questionNumber: data.questionNumber,
      question: data.question,
    });
    const NumberExist = await LessonHomeWork.find({
      courseLessonId: data.courseLessonId,
      courseId: data.courseId,
      questionNumber: data.questionNumber,
    });
    // if (NumberExist.length !== 0) {
    //   res.status(400).json({
    //     message: "Homework Question Number Already Exist",
    //   });
    // }
    if (exist.length == 0) {
      if (data.type === "text") {
        const homeworkCreation = await LessonHomeWork.create({
          courseLessonId: data.courseLessonId,
          courseId: data.courseId,
          question: data.question,
          questionNumber: data.questionNumber,
          type: data.type,
        });
        res.status(201).json({
          message: "Homework Updated In Course Lesson",
          homeworkCreation,
        });
      } else if (data.type === "radio") {
        const homeworkCreation = await LessonHomeWork.create({
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
          message: "Homework Updated In Course Lesson",
          homeworkCreation,
        });
      } else if (data.type === "checkbox") {
        const homeworkCreation = await LessonHomeWork.create({
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
          message: "Homework Updated In Course Lesson",
          homeworkCreation,
        });
      } else {
        const homeworkCreation = await LessonHomeWork.create({
          courseLessonId: data.courseLessonId,
          courseId: data.courseId,
          question: data.question,
          questionNumber: data.questionNumber,
          fileType: data.fileType,
          type: data.type,
        });
        res.status(201).json({
          message: "Homework Updated In Course Lesson",
          homeworkCreation,
        });
      }
    } else {
      res.status(400).json({
        message: "Homework Question Already Exist",
        data: {
          exist,
        },
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function updateHomeworkToCourseLesson(req, res, next) {
  try {
    const data = req.body;
    const id = data.lessonHomeworkId;

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

    const numberExist = await LessonHomeWork.find({
      _id: { $nin: [id] },
      courseLessonId: data.courseLessonId,
      courseId: data.courseId,
      questionNumber: data.questionNumber,
    });
    // if (numberExist.length !== 0) {
    //   res.status(400).json({
    //     message: "HomeWork Question Number Already Exist",
    //   });
    // } else {
    const editDetail = await LessonHomeWork.findByIdAndUpdate(id, editedData, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      status: "Created",
      message: " Updated Homework Successfuly to Courrse Lesson",
      editDetail,
    });
    // }
  } catch (error) {
    next(error);
  }
}

export async function getHomeworkCourseLesson(req, res, next) {
  try {
    const courseLessonId = req.query.courseLessonId;

    const lessonData = await LessonHomeWork.findOne({
      courseLessonId: courseLessonId,
    }).populate("courseId");

    res.status(200).json({
      message: " HomeWork Course Lesson Data",
      lessonData,
    });
  } catch (error) {
    next(error);
  }
}

export async function getLessonHomeworkDetail(req, res, next) {
  try {
    const courseLessonId = req.query.courseLessonId;

    const lessonData = await LessonHomeWork.find({
      courseLessonId: courseLessonId,
    });

    res.status(200).json({
      message: " Lesson HomeWork Course Lesson Data",
      lessonData,
    });
  } catch (error) {
    next(error);
  }
}

export async function getLessonHomeworkList(req, res, next) {
  try {
    const courseLessonId = req.query.courseLessonId;
    const homeworkData = await LessonHomeWork.find({
      courseLessonId: courseLessonId,
    }).sort({ questionNumber: 1 });

    res.status(200).json({
      message: " Quiz Course Lesson Data",
      homeworkData,
    });
  } catch (error) {
    next(error);
  }
}
export const createHomework = createOne(LessonHomeWork);
export const updateHomework = updateOne(LessonHomeWork);
export const getAllHomework = getAll(LessonHomeWork);
export const getHomework = getOne(LessonHomeWork);
export const deleteHomework = deleteOne(LessonHomeWork);
