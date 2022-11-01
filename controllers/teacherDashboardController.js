import teacherDashboards from "../models/teacherDashboardModel.js";
import courseSchedule from "../models/courseScheduleModel.js";

export async function teacherDashboard(req, res, next) {
  try {
    const teacherId = req.query.teacherId;

    const dashboardDetail = await teacherDashboards.find({
      teacherId: teacherId,
    });

    const pendingPayment = 1000;
    const receivedPayment = 2000;

    const courseCount = await courseSchedule
      .find({ teacherId: teacherId })
      .distinct("courseId");

    if (dashboardDetail.length == 0) {
      const data = await teacherDashboards.create({
        totalCourse: courseCount.length,
        pendingPayment: pendingPayment,
        receivedPayment: receivedPayment,
        teacherId: teacherId,
      });
      res.status(201).json({
        data,
      });
    } else {
      const data = {
        totalCourse: courseCount.length,
        pendingPayment: pendingPayment,
        receivedPayment: receivedPayment,
      };

      res.status(201).json({
        data,
      });
    }
  } catch (error) {
    next(error);
  }
}
