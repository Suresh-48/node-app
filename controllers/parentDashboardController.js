import ParentDashboard from "../models/parentDashboardModel.js";
import Student from "../models/studentModel.js";
import Course from "../models/courseModel.js";
import Billing from "../models/billingModel.js";

export async function parentDashboard(req, res, next) {
  try {
    const parentId = req.query.parentId;
    const totalStudent = await Student.find({ parentId: parentId });
    const activeCourse = await Billing.find({ parentId: parentId });
    const totalCourse = await Course.find();
    const completedCourse = 0;

    const details = {
      totalStudent: totalStudent.length,
      activeCourse: activeCourse.length,
      totalCourse: totalCourse.length,
      completeCourse: completedCourse,
      parentId: parentId,
    };
    const dashboardDetail = await ParentDashboard.find({ parentId: parentId });
    if (dashboardDetail.length !== 0) {
      const dashboardCount = await ParentDashboard.findByIdAndUpdate(dashboardDetail[0]._id, details, {
        new: true,
        runValidators: true,
      });
      res.status(201).json({
        data:dashboardCount,
      });
    } else {
      const dashboardCount = await ParentDashboard.create(details);
      res.status(201).json({
        data: dashboardCount,
      });
    }
  } catch (error) {
    next(error);
  }
}
