import ParentDashboard from "../models/parentDashboardModel.js";
import Student from "../models/studentModel.js";
import Course from "../models/courseModel.js";
import Billing from "../models/billingModel.js";
import upcomingSchedule from "../models/upcomingScheduleModel.js";
import moment from "moment-timezone";

export async function parentDashboard(req, res, next) {
  try {
    const parentId = req.query.parentId;
    const totalStudent = await Student.find({ parentId: parentId });
    const totalCourse = await Course.find();

    const date = new Date();
    const newDate = moment(date).tz("America/Chicago").format();
    const currentDate = moment(newDate).tz("America/Chicago").format("ll");
    const currentTime = moment(newDate).tz("America/Chicago").format("HH:mm");

    const checkoutList = await Billing.find({ parentId: parentId })
      .populate({
        path: "courseId",
        populate: {
          path: "category",
        },
      })
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("studentId");

    const activeCourseList = [];
    const completedCourseList = [];
    let count = 0;
    if (checkoutList.length) {
      await checkoutList.map(async (list, index) => {
        const upcomingList = await upcomingSchedule.find({
          parentId: parentId,
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
            totalStudent: totalStudent.length,
            activeCourse: activeCourseList.length,
            totalCourse: totalCourse.length,
            completeCourse: completedCourseList.length,
            parentId: parentId,
          };
          const dashboardDetail = await ParentDashboard.find({
            parentId: parentId,
          });
          if (dashboardDetail.length !== 0) {
            const dashboardCount = await ParentDashboard.findByIdAndUpdate(dashboardDetail[0]._id, details, {
              new: true,
              runValidators: true,
            });
            res.status(201).json({
              data: dashboardCount,
            });
          } else {
            const dashboardCount = await ParentDashboard.create(details);
            res.status(201).json({
              data: dashboardCount,
            });
          }
        }
      });
    } else {
      const details = {
        totalStudent: totalStudent.length,
        activeCourse: activeCourseList.length,
        totalCourse: totalCourse.length,
        completeCourse: completedCourseList.length,
        parentId: parentId,
      };
      const dashboardDetail = await ParentDashboard.find({
        parentId: parentId,
      });
      if (dashboardDetail.length !== 0) {
        const dashboardCount = await ParentDashboard.findByIdAndUpdate(dashboardDetail[0]._id, details, {
          new: true,
          runValidators: true,
        });
        res.status(201).json({
          data: dashboardCount,
        });
      } else {
        const dashboardCount = await ParentDashboard.create(details);
        res.status(201).json({
          data: dashboardCount,
        });
      }
    }
  } catch (error) {
    next(error);
  }
}
