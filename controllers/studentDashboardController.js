import StudentDashboard from "../models/studentDashboardModel.js";
import Student from "../models/studentModel.js";
import Course from "../models/courseModel.js";
import Billing from "../models/billingModel.js";

export async function studentDashboard(req, res, next) {
  try {
    const studentId = req.query.studentId;
    const activeCourse = await Billing.find({ studentId: studentId });
    const totalCourse = await Course.find();
    const completedCourse = 0;

    const details = {
      activeCourse: activeCourse.length,
      totalCourse: totalCourse.length,
      completeCourse: completedCourse,
    };
    const dashboardDetail = await StudentDashboard.find({ studentId: studentId });
    if (dashboardDetail.length !== 0) {
      const dashboardCount = await StudentDashboard.findByIdAndUpdate(dashboardDetail[0]._id, details, {
        new: true,
        runValidators: true,
      });
      res.status(201).json({
        data: dashboardCount,
      });
    } else {
      const dashboardCount = await StudentDashboard.create(details);
      res.status(201).json({
        data: dashboardCount,
      });
    }
  } catch (error) {
    next(error);
  }
}
