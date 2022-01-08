import courseLesson from "../models/courseLessonModel.js";
import course from "../models/courseModel.js";
import Billing from "../models/billingModel.js";

import { getAll, getOne, deleteOne } from "./baseController.js";

export async function createLesson(req, res, next) {
  try {
    const data = req.body;
    const editedLessonName = new RegExp(
      ["^", data.lessonName, "$"].join(""),
      "i"
    );
    const lessonNumber = await courseLesson.find({
      courseId: data.courseId,
      lessonNumber: data.lessonNumber,
    });

    if (lessonNumber.length === 0) {
      const existing = await courseLesson.find({
        courseId: data.courseId,
        lessonName: editedLessonName,
      });
      if (existing.length === 0) {
        const courseLessonData = await courseLesson.create(data);

        res.status(201).json({
          message: "Lesson Created Successfully",
          courseLessonData,
        });
      } else {
        res.status(208).json({
          message: "Lesson Name Aleady Exist",
          existing,
        });
      }
    } else {
      res.status(208).json({
        message: "Lesson Number Aleady Exist",
        lessonNumber,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function updateCourseLesson(req, res, next) {
  try {
    const id = req.params.id;
    const data = req.body;

    const lessonNumber = await courseLesson.find({
      _id: { $nin: [id] },
      courseId: data.courseId,
      lessonNumber: data.lessonNumber,
    });
    if (lessonNumber.length === 0) {
      const existing = await courseLesson.find({
        _id: { $nin: [id] },
        courseId: data.courseId,
        lessonName: data.lessonName,
      });
      if (existing.length === 0) {
        const editDetail = await courseLesson.findByIdAndUpdate(id, data, {
          new: true,
          runValidators: true,
        });
        res.status(201).json({
          message: "Lesson Updated Successfully",
          editDetail,
        });
      } else {
        res.status(208).json({
          message: "Lesson Name Aleady Exist",
          existing,
        });
      }
    } else {
      res.status(208).json({
        message: "Lesson Number Aleady Exist",
        lessonNumber,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function getCategoryLessonList(req, res, next) {
  try {
    const id = req.query.courseId;
    const lessonList = await courseLesson
      .find({ courseId: id })
      .populate({ path: "courseId", populate: { path: "category" } });
    res.status(200).json({
      status: "sucess",
      message: "List Of Category Lessons",
      lessonList,
    });
  } catch (error) {
    next(error);
  }
}

export const getAllCourseLesson = getAll(courseLesson);
export const getCourseLesson = getOne(courseLesson);

export async function deleteCourseLesson(req, res, next) {
  try {
    const lessonId = req.params.id;
    const courseDetail = await courseLesson.findOne({ _id: lessonId });
    const courseCheckout = await Billing.find({
      courseId: courseDetail.courseId,
    });
    if (courseCheckout.length === 0) {
       const deleteLesson=await courseLesson.findByIdAndDelete(lessonId)
      res.status(200).json({
        status: "sucess",
        message: "Lesson Deleted Successfuly",
      });
    } else {
      res.status(403).json({
        status: "Forbiden",
        message: "Unable To Delete Course Has Bean Checkout ",
      });
    }
  } catch (error) {
    next(error);
  }
}
