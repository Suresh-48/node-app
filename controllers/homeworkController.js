import homework from "../models/homeworkModels.js";
import { getAll, getOne, deleteOne, updateOne, createOne } from "./baseController.js";

export async function addHomeworkToCourseLesson(req, res, next) {
  try {
    const data = req.body;
    const exist = await homework.find({
      courseLessonId: data.courseLessonId,
      courseId: data.courseId,
    });
    if (exist.length == 0) {
      const createHomework = await homework.create({
        courseLessonId: data.courseLessonId,
        courseId: data.courseId,
        questions: data.questions,
      });
      res.status(201).json({
        message: "Homework Updated In Course Lesson",
        createHomework,
      });
    } else {
      res.status(208).json({
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

    const exist = await homework.findOne({ courseLessonId: data.courseLessonId, courseId: data.courseId });

    const id = exist._id;

    const editedData = {
      courseLessonId: data.courseLessonId,
      courseId: data.courseId,
      questions: data.questions,
    };
    const editDetail = await homework.findByIdAndUpdate(id, editedData, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      status: "Created",
      message: " Updated Homework Successfully to Course Lesson",
      editDetail,
    });
  } catch (error) {
    next(error);
  }
}

export async function getHomeworkCourseLesson(req, res, next) {
  try {
    const courseLessonId = req.query.courseLessonId;

    const lessonData = await homework.findOne({ courseLessonId: courseLessonId }).populate("courseId");

    res.status(201).json({
      message: " Homework Course Lesson Data",
      lessonData,
    });
  } catch (error) {
    next(error);
  }
}

export async function getLessonQuizDetail(req, res, next) {
  try {
    const courseLessonId = req.query.courseLessonId;

    const lessonData = await homework.find({ courseLessonId: courseLessonId })

    res.status(201).json({
      message: " Quiz Course Lesson Data",
      lessonData,
    });
  } catch (error) {
    next(error);
  }
}


export const createHomework = createOne(homework);
export const updateHomework = updateOne(homework);
export const getAllHomework = getAll(homework);
export const getHomework = getOne(homework);
export const deleteHomework = deleteOne(homework);
