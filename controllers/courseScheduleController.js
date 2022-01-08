import courseSchedule from "../models/courseScheduleModel.js";
import moment from "moment";
import teacherUpcomingSchedule from "../models/teacherUpcomingScheduleModels.js";
import { getAll, getOne, deleteOne } from "./baseController.js";
import courseLesson from "../models/courseLessonModel.js";
import Billing from "../models/billingModel.js";
import Course from "../models/courseModel.js";

export async function createSchedule(req, res, next) {
  try {
    const data = req.body;
    const exist = await courseSchedule.find({
      courseId: data.courseId,
      startTime: data.startTime,
      weeklyOn: data.weeklyOn,
      startDate: data.startDate,
    });

    const teacherScheduleList = await teacherUpcomingSchedule
      .find({ teacherId: data.teacherId })
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("teacherId");
    const lessonDetail = await courseLesson.find({ courseId: data.courseId });
    const existingSchedule = [];
    lessonDetail.forEach((res, i) => {
      const newDate = moment(data.startDate, "ll").add(7 * i, "days");
      const editedDate = moment(newDate).format("ll");

      teacherScheduleList.forEach(async (res) => {
        const getStartTime = res.courseScheduleId.startTime;
        const getEndTime = res.courseScheduleId.endTime;
        const clientStartTime = data.startTime;
        const clientEndTime = data.endTime;
        const getTime1 = moment(getStartTime, "hh:mm A").format("HH:mm");
        const getTime2 = moment(getEndTime, "hh:mm A").format("HH:mm");
        const clientTime1 = moment(clientStartTime, "hh:mm A").format("HH:mm");
        const clientTime2 = moment(clientEndTime, "hh:mm A").format("HH:mm");
        if (editedDate === res.lessonDate) {
          if (
            (getTime1 > clientTime1 &&
              clientTime1 < getTime2 &&
              getTime1 < clientTime2 &&
              clientTime2 < getTime2) ||
            (getTime1 < clientTime1 && clientTime1 < getTime2) ||
            (getTime1 === clientTime1 && getTime2 === clientTime2)
          ) {
            existingSchedule.push(res._id);
          }
        }
      });
    });
    if (existingSchedule.length == 0) {
      if (exist.length == 0) {
        const scheduleDetails = await courseSchedule.create({
          courseId: data.courseId,
          startTime: data.startTime,
          endTime: data.endTime,
          weeklyOn: data.weeklyOn,
          startDate: data.startDate,
          timeZone: data.timeZone,
          totalStudentEnrolled: data.totalStudentEnrolled,
          zoomId: data.zoomId,
          zoomPassword: data.zoomPassword,
          teacherId: data.teacherId,
        });
        res.status(201).json({
          status: "Created",
          message: "Course Scheduled Created Successfully",
          scheduleDetails,
        });
      } else {
        res.status(208).json({
          message: "Course Timing Already Scheduled",
          exist,
        });
      }
    } else {
      res.status(208).json({
        message: "Teacher Has Been Scheduled For Another Course",
        existingSchedule,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function updateSchedule(req, res, next) {
  try {
    const id = req.params.id;
    const data = req.body;
    const date = new Date();
    const newDate = moment(date).tz("America/Chicago").format();
    const currentDate = moment(newDate).tz("America/Chicago").format("ll");
    const currentTime = moment(newDate).tz("America/Chicago").format("HH:mm");

    const scheduleDetail = await courseSchedule.findOne({ _id: id });

    const value1 = data.teacherId;
    const value2 = scheduleDetail.teacherId;

    const courseCheckout = await Billing.find({ courseScheduleId: id });

    const list = await teacherUpcomingSchedule.find({
      courseScheduleId: id,
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
    });

    const teacherScheduleList = await teacherUpcomingSchedule
      .find({ teacherId: data.teacherId, courseScheduleId: { $nin: [id] } })
      .populate("courseId")
      .populate("courseScheduleId")
      .populate("courseLessonId")
      .populate("teacherId");
    const lessonDetail = await courseLesson.find({ courseId: data.courseId });
    const existingSchedule = [];
    lessonDetail.forEach((res, i) => {
      const newDate = moment(data.startDate, "ll").add(7 * i, "days");
      const editedDate = moment(newDate).format("ll");

      teacherScheduleList.forEach(async (res) => {
        const getStartTime = res.courseScheduleId.startTime;
        const getEndTime = res.courseScheduleId.endTime;
        const clientStartTime = data.startTime;
        const clientEndTime = data.endTime;
        const getTime1 = moment(getStartTime, "hh:mm A").format("HH:mm");
        const getTime2 = moment(getEndTime, "hh:mm A").format("HH:mm");
        const clientTime1 = moment(clientStartTime, "hh:mm A").format("HH:mm");
        const clientTime2 = moment(clientEndTime, "hh:mm A").format("HH:mm");
        if (editedDate === res.lessonDate) {
          if (
            (getTime1 > clientTime1 &&
              clientTime1 < getTime2 &&
              getTime1 < clientTime2 &&
              clientTime2 < getTime2) ||
            (getTime1 < clientTime1 && clientTime1 <= getTime2) ||
            (getTime1 === clientTime1 && getTime2 === clientTime2)
          ) {
            existingSchedule.push(res._id);
          }
        }
      });
    });

    const exist = await courseSchedule.find({
      courseId: data.courseId,
      startTime: data.startTime,
      endTime: data.endTime,
      startDate: data.startDate,
      _id: { $nin: [id] },
    });
    const editedData = {
      courseId: data.courseId,
      startTime: data.startTime,
      endTime: data.endTime,
      weeklyOn: data.weeklyOn,
      startDate: data.startDate,
      timeZone: data.timeZone,
      totalStudentEnrolled: data.totalStudentEnrolled,
      zoomId: data.zoomId,
      zoomPassword: data.zoomPassword,
      teacherId: data.teacherId,
    };
    if (
      (data.teacherId === null || value1 == value2) &&
      existingSchedule.length == 0
    ) {
      const editDetails = await courseSchedule.findByIdAndUpdate(
        id,
        editedData
      );
      res.status(201).json({
        status: "Created",
        message: "Course schedule Details Updated Successfully",
        editDetails,
      });
    } else if (existingSchedule.length == 0) {
      if (exist.length === 0) {
        const editDetails = await courseSchedule.findByIdAndUpdate(
          id,
          editedData
        );

        res.status(201).json({
          status: "Created",
          message: "Course schedule Details Updated Successfully",
          editDetails,
        });
      } else {
        res.status(403).json({
          status: "Already Exist",
          message: "Course Timing Already Scheduled",
          exist,
        });
      }
    } else {
      res.status(403).json({
        message: "Teacher Has Been Scheduled For Another Course",
        existingSchedule,
      });
    }
  } catch (error) {
    next(error);
  }
}
export async function getCourse(req, res, next) {
  try {
    const courseId = req.query.courseId;

    const courseList = await courseSchedule
      .find({ courseId: courseId })
      .populate("courseId")
      .populate("teacherId");

    res.status(200).json({
      status: "success",
      length: courseList.length,
      courseList,
    });
  } catch (error) {
    next(error);
  }
}
export async function getEnrolledCourse(req, res, next) {
  try {
    const courseId = req.query.courseId;

    const courseList = await courseSchedule
      .find({ courseId: courseId })
      .populate("courseId");

    res.status(200).json({
      status: "success",
      length: courseList.length,
      courseList,
    });
  } catch (error) {
    next(error);
  }
}
export const getAllSchedule = getAll(courseSchedule);
export const getSchedule = getOne(courseSchedule);

export async function getCourseScheduleOne(req, res, next) {
  try {
    const data = req.query;
    const scheduleOne = await courseSchedule
      .findOne({ _id: data.courseScheduleId })
      .populate("teacherId");
    res.status(200).json({
      status: "success",
      length: scheduleOne.length,
      scheduleOne,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteSchedule(req, res, next) {
  try {
    const data = req.query;
    const scheduleId = data.scheduleId;
    const courseId = data.courseId;
    const newCurrentDate = data.currentDate;
    const newCurrentTime = data.currentTime;

    const courseScheduleDetail = await courseSchedule.findOne({
      _id: scheduleId,
    });
    const scheduleDate = courseScheduleDetail.startDate;
    const scheduleStartTime = moment(
      courseScheduleDetail.startTime,
      "LT"
    ).format("HH:mm");

    const courseEndrolled = await Billing.find({
      courseScheduleId: scheduleId,
    });
    if (
      (newCurrentDate == scheduleDate && newCurrentTime >= scheduleStartTime) ||
      courseEndrolled.length !== 0
    ) {
      res.status(403).json({
        message: "Course Has Been Started Or Endrolled",
      });
    } else {
      const deleteSchedule = await courseSchedule.findByIdAndDelete({
        _id: scheduleId,
      });

      const teacherSchedule = await teacherUpcomingSchedule.find({
        courseScheduleId: scheduleId,
      });

      teacherSchedule.forEach(async (res, i) => {
        const deleteTeacherSchedule =
          await teacherUpcomingSchedule.findByIdAndDelete({ _id: res._id });
      });
      res.status(200).json({
        status: "success",
      });
    }
  } catch (error) {
    next(error);
  }
}
