import UpcomingSchedule from "../models/upcomingScheduleModel.js";
import moment from "moment-timezone";
import upcomingSchedule from "../models/upcomingScheduleModel.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { SESSION_REFRESH_TOKEN } from "../config.js";

export async function getStudentUpcomingSchedule(req, res, next) {
  try {
    const studentId = req.query.studentId;
    const date = new Date();
    const newDate = moment(date)
      .tz("America/Chicago")
      .format();
    const currentDate = moment(newDate)
      .tz("America/Chicago")
      .format("ll");
    const currentTime = moment(newDate)
      .tz("America/Chicago")
      .format("HH:mm");

    // const currentDate=moment(currentDate,"ll").tz("America/Chicago").format("YYYY-MM-DD")
    // const currentTime=currentTime
    // var momentObj = moment(currentDate + currentTime, 'YYYY-MM-DDLT');
    // var dateTime = momentObj.format('YYYY-MM-DDTHH:mm:ss');

    const upcomingList = await UpcomingSchedule.find({
      studentId: studentId,
      $or: [
        {
          $and: [{ timeStamp: currentDate }, { lessonEndTime: { $gt: currentTime } }],
        },
        {
          timeStamp: { $gt: currentDate },
        },
      ],
    })
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .sort({ timeStamp: 1, lessonEndTime: 1 });

    res.status(200).json({
      length: upcomingList.length,
      message: "List Of Upcoming Courses",
      upcomingList,
    });
  } catch (error) {
    next(error);
  }
}
export async function getStudentCompletedSchedule(req, res, next) {
  try {
    const studentId = req.query.studentId;
    const date = new Date();
    const newDate = moment(date)
      .tz("America/Chicago")
      .format();

    const currentDate = moment(newDate)
      .tz("America/Chicago")
      .format("ll");
    const currentTime = moment(newDate)
      .tz("America/Chicago")
      .format("HH:mm");
    const upcomingList = await UpcomingSchedule.find({
      studentId: studentId,
      $or: [
        {
          $and: [{ timeStamp: currentDate }, { lessonEndTime: { $lte: currentTime } }],
        },
        {
          timeStamp: { $lt: currentDate },
        },
      ],
    })
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId");

    res.status(200).json({
      length: upcomingList.length,
      message: "List Of Upcoming Courses",
      upcomingList,
    });
  } catch (error) {
    next(error);
  }
}
export async function getParentStudentUpcomingSchedule(req, res, next) {
  try {
    const parentId = req.query.parentId;
    const date = new Date();
    const newDate = moment(date)
      .tz("America/Chicago")
      .format();

    const currentDate = moment(newDate)
      .tz("America/Chicago")
      .format("ll");
    const currentTime = moment(newDate)
      .tz("America/Chicago")
      .format("HH:mm");
    const upcomingList = await UpcomingSchedule.find({
      parentId: parentId,
      $or: [
        {
          $and: [{ timeStamp: currentDate }, { lessonEndTime: { $gt: currentTime } }],
        },
        {
          timeStamp: { $gt: currentDate },
        },
      ],
    })
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("studentId");

    res.status(200).json({
      length: upcomingList.length,
      message: "List Of Upcoming Courses",
      upcomingList,
    });
  } catch (error) {
    next(error);
  }
}
export async function getParentStudentCompletedSchedule(req, res, next) {
  try {
    const parentId = req.query.parentId;
    const date = new Date();
    const newDate = moment(date)
      .tz("America/Chicago")
      .format();

    const currentDate = moment(newDate)
      .tz("America/Chicago")
      .format("ll");
    const currentTime = moment(newDate)
      .tz("America/Chicago")
      .format("HH:mm");
    const upcomingList = await UpcomingSchedule.find({
      parentId: parentId,
      $or: [
        {
          $and: [{ timeStamp: currentDate }, { lessonEndTime: { $lte: currentTime } }],
        },
        {
          timeStamp: { $lt: currentDate },
        },
      ],
    })
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("studentId");
    res.status(200).json({
      length: upcomingList.length,
      message: "List Of Upcoming Courses",
      upcomingList,
    });
  } catch (error) {
    next(error);
  }
}
export async function getUpcomingScheduleOnCourse(req, res, next) {
  try {
    const studentId = req.query.studentId;
    const courseId = req.query.courseId;
    const date = new Date();
    const newDate = moment(date)
      .tz("America/Chicago")
      .format();

    const currentDate = moment(newDate)
      .tz("America/Chicago")
      .format("ll");
    const currentTime = moment(newDate)
      .tz("America/Chicago")
      .format("HH:mm");
    const upcomingList = await UpcomingSchedule.find({
      studentId: studentId,
      courseId: courseId,
      $or: [
        {
          $and: [{ timeStamp: currentDate }, { lessonEndTime: { $gt: currentTime } }],
        },
        {
          timeStamp: { $gt: currentDate },
        },
      ],
    })
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("studentId");
    res.status(200).json({
      length: upcomingList.length,
      message: "List Of Upcoming Lessons",
      upcomingList,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateStudentZoomTimings(req, res, next) {
  try {
    const data = req.body;
    const scheduleDetail = await upcomingSchedule.find({
      _id: data.studentCourseScheduleId,
    });

    if (scheduleDetail.length > 0) {
      const editData = {
        zoomStartTime: data.zoomStartTime,
        zoomEndTime: data.zoomEndTime,
      };
      const zoomDetails = await upcomingSchedule.findByIdAndUpdate(data.studentCourseScheduleId, editData, {
        new: true,
        runValidators: true,
      });

      console.log("data.studentId", data.studentId);

      const user = await User.findOne({ studentId: data.studentId });
      console.log("user", user);

      const refreshToken = jwt.sign({ email: user.email, password: user.password }, SESSION_REFRESH_TOKEN, {
        expiresIn: "90m",
      });

      const editUser = {
        refreshToken: refreshToken,
      };

      console.log("editUser", editUser);

      const createRefreshToken = await User.findByIdAndUpdate(user._id, editUser, {
        new: true,
        runValidators: true,
      });

      res.status(201).json({
        message: "Success",
        zoomDetails,
        createRefreshToken,
      });
    } else {
      res.status(403).json({
        message: "No Record Found",
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function getStudentUpcomingScheduleOnCalendar(req, res, next) {
  try {
    const data = req.query;
    const date = new Date();
    const newDate = moment(date)
      .tz("America/Chicago")
      .format();
    const currentDate = moment(newDate)
      .tz("America/Chicago")
      .format("ll");
    const currentTime = moment(newDate)
      .tz("America/Chicago")
      .format("HH:mm");
    let upcomingList = await UpcomingSchedule.find(
      data.studentId
        ? {
            studentId: data.studentId,
            $or: [
              {
                $and: [{ timeStamp: currentDate }, { lessonEndTime: { $gt: currentTime } }],
              },
              {
                timeStamp: { $gt: currentDate },
              },
            ],
          }
        : {
            parentId: data.parentId,
            $or: [
              {
                $and: [{ timeStamp: currentDate }, { lessonEndTime: { $gt: currentTime } }],
              },
              {
                timeStamp: { $gt: currentDate },
              },
            ],
          }
    )
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .sort({ timeStamp: 1, lessonEndTime: 1 });
    upcomingList.forEach((scheduleDetail, i) => {
      const courseStartTime = moment(scheduleDetail.courseScheduleId.startTime, "LT").format("HH:mm");
      const courseEndTime = moment(scheduleDetail.courseScheduleId.endTime, "LT").format("HH:mm");
      const lessonStartDate = moment(scheduleDetail.lessonDate + " " + courseStartTime).format();
      const lessonEndDate = moment(scheduleDetail.lessonDate + " " + courseEndTime).format();
      const title = `${scheduleDetail.courseId.name} - ${scheduleDetail.courseLessonId.lessonName} (${scheduleDetail.courseScheduleId.startTime} to ${scheduleDetail.courseScheduleId.endTime})`;
      upcomingList[i]["title"] = title;
      upcomingList[i]["start"] = lessonStartDate;
      upcomingList[i]["end"] = lessonEndDate;
    });

    res.status(200).json({
      length: upcomingList.length,
      message: "List Of Upcoming Lessons",
      upcomingList,
    });
  } catch (error) {
    next(error);
  }
}
