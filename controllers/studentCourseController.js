import StudentCourse from "../models/studentCourseModel.js";
import { getAll, getOne } from "./baseController.js";

export async function payDetails(req, res, next) {
  try {
    const data = req.body;

    const exist = await StudentCourse.find({
      studentId: data.studentId,
      courseId: data.courseId,
      courseScheduleId: data.courseScheduleId,
    });

    if (exist.length == 0) {
      const payDetails = await StudentCourse.create({
        studentId: data.studentId,
        courseId: data.courseId,
        courseScheduleId: data.courseScheduleId,
        createdAt: data.createdAt,
      });
      res.status(200).json({
        message: "Payement details saved Successfully",
        payDetails,
      });
    } else {
      res.status(208).json({
        message: "Payment details already Exist",
        exist,
      });
    }
  } catch (error) {
    next(error);
  }
}

export const getPayDetails = getOne(StudentCourse);
export const getAllPayDetails = getAll(StudentCourse);
