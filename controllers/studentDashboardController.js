import StudentDashboard from "../models/studentDashboardModel.js";
import Student from "../models/studentModel.js";
import Course from "../models/courseModel.js";
import Billing from "../models/billingModel.js";
import upcomingSchedule from "../models/upcomingScheduleModel.js";
import moment from "moment-timezone";

export async function studentDashboard(req, res, next) {
  try {
    const studentId = req.query.studentId;
    const totalCourse = await Course.find();

    const date = new Date();
    const newDate = moment(date).tz("America/Chicago").format();
    const currentDate = moment(newDate).tz("America/Chicago").format("ll");
    const currentTime = moment(newDate).tz("America/Chicago").format("HH:mm");

    const checkoutList = await Billing.find({ studentId: studentId })
      .populate({
        path: "courseId",
        populate: {
          path: "category",
        },
      })
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("studentId");

    if (checkoutList.length > 0) {
      const activeCourseList = [];
      const completedCourseList = [];
      let count = 0;

      await checkoutList.map(async (list, index) => {
        const upcomingList = await upcomingSchedule.find({
          studentId: studentId,
          courseScheduleId: list.courseScheduleId._id,
          $or: [
            {
              $and: [{ timeStamp: currentDate }, { lessonEndTime: { $gt: currentTime } }],
            },
            {
              timeStamp: { $gt: currentDate },
            },
          ],
        });
        if (upcomingList.length === 0) {
          completedCourseList.push(list);
        } else if (upcomingList.length > 0) {
          activeCourseList.push(list);
        }
        count = count + 1;

        if (count === checkoutList.length) {
          const details = {
            activeCourse: activeCourseList.length,
            totalCourse: totalCourse.length,
            completeCourse: completedCourseList.length,
          };
          const dashboardDetail = await StudentDashboard.find({
            studentId: studentId,
          });
          if (dashboardDetail.length !== 0) {
            const dashboardCount = await StudentDashboard.findByIdAndUpdate(dashboardDetail[0]._id, details, {
              new: true,
              runValidators: true,
            });
            res.status(201).json({
              message: "Dashboard Card Count",
              data: dashboardCount,
            });
          } else {
            const dashboardCount = await StudentDashboard.create(details);
            res.status(201).json({
              message: "Dashboard Card Count",
              data: dashboardCount,
            });
         }
        }
      });
    } else {
      res.status(201).json({
        message: "Dashboard Card Count",
        data: 0,
      });
    }
  } catch (error) {
    next(error);
  }
}
