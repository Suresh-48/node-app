import courseLesson from "../models/courseLessonModel.js";
import Course from "../models/courseModel.js";
import Billing from "../models/billingModel.js";
import lessonQuiz from "../models/lessonQuizModels.js";
import lessonHomeWork from "../models/lessonHomeWorkModel.js";
import courseSchedule from "../models/courseScheduleModel.js";

import { getAll, getOne, deleteOne } from "./baseController.js";
import { getQuizCourseLesson } from "./quizController.js";

export async function createLesson(req, res, next) {
  try {
    const data = req.body;
    const editedLessonName = new RegExp(["^", data.lessonName, "$"].join(""), "i");
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

        const courseData = await Course.findOne({ _id: data.courseId });

        const id = courseData._id;
        const courseActualAmount = courseData?.actualAmount ? parseInt(courseData.actualAmount) : 0;
        const courseDiscountAmount = courseData?.discountAmount ? parseInt(courseData.discountAmount) : 0;
        const lessonActualAmount = parseInt(data.lessonActualAmount);
        const lessonDiscountAmount = parseInt(data.lessonDiscountAmount);

        const editData = {
          actualAmount: courseActualAmount + lessonActualAmount,
          discountAmount: courseDiscountAmount + lessonDiscountAmount,
        };

        const editDetail = await Course.findByIdAndUpdate(id, editData, {
          new: true,
          runValidators: true,
        });

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
        const lessonData = await courseLesson.findOne({ _id: { $in: [id] } });

        const existActualAmount = parseInt(lessonData.lessonActualAmount);
        const existDiscountAmount = parseInt(lessonData.lessonDiscountAmount);
        const newLessonActualAmount = parseInt(data.lessonActualAmount);
        const newLessonDiscountAmount = parseInt(data.lessonDiscountAmount);

        const courseData = await Course.findOne({ _id: data.courseId });

        const courseId = courseData._id;
        const courseActualAmount = parseInt(courseData.actualAmount);
        const courseDiscountAmount = parseInt(courseData.discountAmount);

        const newActualAmount = Math.abs(existActualAmount - newLessonActualAmount);
        const newDiscountAmount = Math.abs(existDiscountAmount - newLessonDiscountAmount);

        if (existActualAmount < newLessonActualAmount || existDiscountAmount < newLessonDiscountAmount) {
          const editData = {
            actualAmount: courseActualAmount + newActualAmount,
            discountAmount: courseDiscountAmount + newDiscountAmount,
          };
          const editCourseDetail = await Course.findByIdAndUpdate(courseId, editData, {
            new: true,
            runValidators: true,
          });
        } else if (existActualAmount < newLessonActualAmount) {
          const editData = {
            actualAmount: courseActualAmount + newActualAmount,
          };
          const editCourseDetail = await Course.findByIdAndUpdate(courseId, editData, {
            new: true,
            runValidators: true,
          });
        } else if (existDiscountAmount < newLessonDiscountAmount) {
          const editData = {
            actualAmount: courseActualAmount + newActualAmount,
          };
          const editCourseDetail = await Course.findByIdAndUpdate(courseId, editData, {
            new: true,
            runValidators: true,
          });
        } else {
          const editData = {
            actualAmount: courseActualAmount - newActualAmount,
            discountAmount: courseDiscountAmount - newDiscountAmount,
          };
          const editCourseDetail = await Course.findByIdAndUpdate(courseId, editData, {
            new: true,
            runValidators: true,
          });
        }

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
      status: "success",
      message: "List Of Category Lessons",
      lessonList,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSingleCourseLesson(req, res, next) {
  try {
    const lessonId = req.params.id;

    const lessonList = await courseLesson
      .findOne({ _id: lessonId })
      .populate({ path: "courseId", populate: { path: "category" } });

    res.status(200).json({
      status: "success",
      message: "List Of Category Lessons",
      lessonList,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteCourseLesson(req, res, next) {
  try {
    const lessonId = req.params.id;
    const courseDetail = await courseLesson.findOne({ _id: lessonId });
    const courseCheckout = await Billing.find({
      courseId: courseDetail.courseId,
    });
    if (courseCheckout.length === 0) {
      const deleteLesson = await courseLesson.findByIdAndDelete(lessonId);
      res.status(200).json({
        status: "success",
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

export async function getAllCourseLessonData(req, res, next) {
  try {
    const id = req.query.courseId;

    const lessonList = await courseLesson
      .find({ courseId: id })
      .populate({ path: "courseId", populate: { path: "category" } });

    const totalAmount = [];

    lessonList.map((item) => {
      if (item?.lessonDiscountAmount > 0) {
        totalAmount.push(parseInt(item?.lessonDiscountAmount));
      }
    });

    let lessonTotal = 0;
    for (let i = 0; i < totalAmount.length; i++) {
      lessonTotal = lessonTotal + totalAmount[i];
    }

    res.status(200).json({
      status: "success",
      message: "List Of Lessons Details",
      lessonList,
      lessonTotal,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCourseLessonList(req, res, next) {
  try {
    const courseId = req.query.courseId;

    const lessonData = await courseLesson.find({ courseId: courseId });

    const lessonLength = lessonData.length;

    const quizData = [];

    lessonData.map((list) => {
      quizData.push(list._id);
    });

    const lessonQuizData = [];

    for (let i = 0; i < quizData.length; i++) {
      const quizDatas = await lessonQuiz.find({ courseLessonId: quizData[i] });
      if (Object.keys(quizDatas).length > 0) {
        lessonQuizData.push(1);
      }
    }
    const lessonQuizLength = lessonQuizData.length;

    const lessonHomeWorkData = [];

    for (let i = 0; i < quizData.length; i++) {
      const homeworkData = await lessonHomeWork.find({ courseLessonId: quizData[i] });
      if (Object.keys(homeworkData).length > 0) {
        lessonHomeWorkData.push(1);
      }
    }
    const lessonHomeWorkLength = lessonHomeWorkData.length;

    const courseScheduleData = await courseSchedule.find({ courseId: courseId });

    const courseScheduleLength = courseScheduleData.length;

    res.status(200).json({
      status: "success",
      data: { lessonLength, lessonQuizLength, lessonHomeWorkLength, courseScheduleLength },
    });
  } catch (error) {
    next(error);
  }
}

export const getAllCourseLesson = getAll(courseLesson);
export const getCourseLesson = getOne(courseLesson);
