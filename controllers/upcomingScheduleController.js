import UpcomingSchedule from "../models/upcomingScheduleModel.js";
import moment from "moment-timezone";

export async function getStudentUpcomingSchedule(req, res, next) {
  try {
    const studentId = req.query.studentId;
    const date = new Date();
    const newDate = moment(date).tz("America/Chicago").format();
    const currentDate = moment(newDate).tz("America/Chicago").format("ll");
    const currentTime = moment(newDate).tz("America/Chicago").format("HH:mm");

    // const currentDate=moment(currentDate,"ll").tz("America/Chicago").format("YYYY-MM-DD")
    // const currentTime=currentTime
    // var momentObj = moment(currentDate + currentTime, 'YYYY-MM-DDLT');
    // var dateTime = momentObj.format('YYYY-MM-DDTHH:mm:ss');

    const upcomingList = await UpcomingSchedule.find({
      studentId: studentId,
      $or: [
        {
          $and: [
            { timeStamp: currentDate },
            { lessonEndTime: { $gt: currentTime } },
          ],
        },
        {
          timeStamp: { $gt: currentDate },
        },
      ],
    })
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .sort({lessonDate:1,lessonEndTime:1})
      
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
    const newDate = moment(date).tz("America/Chicago").format();

    const currentDate = moment(newDate).tz("America/Chicago").format("ll");
    const currentTime = moment(newDate).tz("America/Chicago").format("HH:mm");
    const upcomingList = await UpcomingSchedule.find({
      studentId: studentId,
      $or: [
        {
          $and: [
            { timeStamp: currentDate },
            { lessonEndTime: { $lte: currentTime } },
          ],
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
    const newDate = moment(date).tz("America/Chicago").format();

    const currentDate = moment(newDate).tz("America/Chicago").format("ll");
    const currentTime = moment(newDate).tz("America/Chicago").format("HH:mm");
    const upcomingList = await UpcomingSchedule.find({
      parentId: parentId,
      $or: [
        {
          $and: [
            { timeStamp: currentDate },
            { lessonEndTime: { $gt: currentTime } },
          ],
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
    const newDate = moment(date).tz("America/Chicago").format();

    const currentDate = moment(newDate).tz("America/Chicago").format("ll");
    const currentTime = moment(newDate).tz("America/Chicago").format("HH:mm");
    const upcomingList = await UpcomingSchedule.find({
      parentId: parentId,
      $or: [
        {
          $and: [
            { timeStamp: currentDate },
            { lessonEndTime: { $lte: currentTime } },
          ],
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
    const newDate = moment(date).tz("America/Chicago").format();

    const currentDate = moment(newDate).tz("America/Chicago").format("ll");
    const currentTime = moment(newDate).tz("America/Chicago").format("HH:mm");
    const upcomingList = await UpcomingSchedule.find({
      studentId: studentId,
      courseId: courseId,
      $or: [
        {
          $and: [
            { timeStamp: currentDate },
            { lessonEndTime: { $gt: currentTime } },
          ],
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
