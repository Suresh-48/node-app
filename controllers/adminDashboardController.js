import Parent from "../models/parentModel.js";
import Student from "../models/studentModel.js";
import Course from "../models/courseModel.js";
import Billing from "../models/billingModel.js";
import Teacher from "../models/teacherModel.js";

export async function adminDashboard(req, res, next) {
  try {


   const amount=await Billing.aggregate(
      [
        {
          $group:
            {
              _id:0,
              payment: { $sum: "$payment" },
            }
        }
      ]
   )
    const parentCount = await Parent.find();
    const studentCount = await Student.find();
    const courseCount = await Course.find();
    const teacherCount = await Teacher.find();

    const totalAmount = amount[0]?.payment

    const data = {
      totalStudent: studentCount.length,
      totalParent: parentCount.length,
      totalCourse: courseCount.length,
      totalTeacher: teacherCount.length,
      totalAmount: totalAmount?totalAmount:0,
    };

    res.status(201).json({
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function AdminGetBillingDetail(req, res, next) {
  try {
    const billingDetails = await Billing.find().populate("courseId").populate("courseScheduleId").populate("studentId");
    res.status(200).json({
      message: "Billing Detail List For Admin",
      data: billingDetails,
    });
  } catch (error) {
    next(error);
  }
}
